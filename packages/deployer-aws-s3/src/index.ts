import { ConfigTypes, FabAssetsDeployer, getContentType } from '@dev-spendesk/core'
import { nanoid } from 'nanoid'
import path from 'path'
import fs from 'fs-extra'
import { extract } from 'zip-lib'
import globby from 'globby'
import pretty from 'pretty-bytes'
import { authenticate, createBucket, makeBucketWebsite, putObject } from './aws'
import { log } from './utils'
import aws from 'aws-sdk'

export const deployAssets: FabAssetsDeployer<ConfigTypes.AwsS3> = async (
  fab_path: string,
  package_dir: string,
  config: ConfigTypes.AwsS3
) => {
  const { bucket_name, access_key, secret_key, region = 'us-east-1', endpoint } = config
  if (!bucket_name) throw new Error('Need to specify a bucket name!')

  const extracted_dir = path.join(package_dir, `aws-s3-${nanoid()}`)
  await fs.ensureDir(extracted_dir)
  log.tick(`Generated working dir in 💛${extracted_dir}💛.`)
  await extract(fab_path, extracted_dir)
  log.tick(`Unpacked FAB.`)

  return await doUpload(
    access_key,
    secret_key,
    region,
    bucket_name,
    extracted_dir,
    endpoint
  )
}

const doUpload = async (
  access_key: string,
  secret_key: string,
  region: string,
  bucket_name: string,
  extracted_dir: string,
  endpoint?: string
) => {
  const s3 = authenticate(region, access_key, secret_key, endpoint)
  const assets_host = await createOrReuseBucket(s3, bucket_name, region)

  await makeBucketWebsite(s3, bucket_name)
  log.tick(`Configured S3 website at 💛${assets_host}💛.`)

  log(`Uploading files...`)
  const files = await globby(['_assets/**/*'], { cwd: extracted_dir })
  const uploads = files.map(async (file) => {
    const content_type = getContentType(file)
    const body_stream = fs.createReadStream(path.join(extracted_dir, file))
    await putObject(s3, bucket_name, file, body_stream, content_type)
    log.continue(`🖤  ${file} (${pretty(body_stream.bytesRead)})🖤`)
  })

  await Promise.all(uploads)

  return assets_host
}

async function createOrReuseBucket(s3: aws.S3, bucket_name: string, region: string) {
  try {
    await createBucket(s3, bucket_name)
    log.tick(`Created bucket 💛${bucket_name}💛 in region 💛${region}💛.`)
    return `https://${bucket_name}.s3.${region}.amazonaws.com`
  } catch (e) {
    if (e.code !== 'BucketAlreadyOwnedByYou') throw e

    if (e.region !== region) {
      log.cross(
        `Warning: bucket already exists in region 💛${e.region}💛
        Config file specifies region: 💛${region}💛
        💚Ignoring config value and reusing existing bucket.💚`
      )
    } else {
      log.tick(
        `Bucket 💛${bucket_name}💛 already exists in region 💛${region}💛, reusing.`
      )
    }
    return `https://${bucket_name}.s3.${e.region}.amazonaws.com`
  }
}
