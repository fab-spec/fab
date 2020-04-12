import { ConfigTypes, FabAssetsDeployer, getContentType } from '@fab/core'
import aws from 'aws-sdk'
import { nanoid } from 'nanoid'
import path from 'path'
import fs from 'fs-extra'
import { extract } from 'zip-lib'
import { _log } from '@fab/cli'
import globby from 'globby'
import pretty from 'pretty-bytes'

const log = _log('@fab/deployer-aws-s3')

export const deployAssets: FabAssetsDeployer<ConfigTypes.AwsS3> = async (
  fab_path: string,
  working_dir: string,
  config: ConfigTypes.AwsS3
) => {
  const { bucket_name, access_key, secret_key, region = 'us-east-1' } = config
  if (!bucket_name) throw new Error('Need to specify a bucket name!')

  const extracted_dir = path.join(working_dir, `cf-workers-${nanoid()}`)
  await fs.ensureDir(extracted_dir)
  log(`💚✔💚 Generated working dir in 💛${extracted_dir}💛.`)
  await extract(fab_path, extracted_dir)
  log(`💚✔💚 Unpacked FAB.`)

  return await doUpload(access_key, secret_key, region, bucket_name, extracted_dir)
}

const doUpload = async (
  access_key: string,
  secret_key: string,
  region: string,
  bucket_name: string,
  extracted_dir: string
) => {
  const assets_host = `https://${bucket_name}.s3.${region}.amazonaws.com`

  aws.config.update({
    region,
    accessKeyId: access_key,
    secretAccessKey: secret_key,
  })
  const s3 = new aws.S3()
  await s3
    .createBucket({
      Bucket: bucket_name,
    })
    .promise()
  log(`💚✔💚 Created bucket 💛${bucket_name}💛 in region 💛${region}💛.`)

  await s3
    .putBucketWebsite({
      Bucket: bucket_name,
      WebsiteConfiguration: {
        ErrorDocument: {
          Key: 'error.html',
        },
        IndexDocument: {
          Suffix: 'index.html',
        },
      },
    })
    .promise()
  log(`💚✔💚 Configured S3 website at 💛${assets_host}💛.`)

  log(`Uploading files...`)
  const files = await globby(['_assets/**/*'], { cwd: extracted_dir })
  const uploads = files.map(async (file) => {
    const content_type = getContentType(file)
    const body_stream = fs.createReadStream(path.join(extracted_dir, file))
    await s3
      .putObject({
        Bucket: bucket_name,
        Key: file,
        Body: body_stream,
        ACL: 'public-read',
        ContentType: content_type,
      })
      .promise()
    log.continue(`🖤  ${file} (${pretty(body_stream.bytesRead)})🖤`)
  })

  await Promise.all(uploads)

  return assets_host
}
