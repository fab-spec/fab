import { ConfigTypes, FabAssetsDeployer } from '@fab/core'
import aws from 'aws-sdk'
import { nanoid } from 'nanoid'
import path from 'path'
import fs from 'fs-extra'
import { extract } from 'zip-lib'
import { _log } from '@fab/cli'
import globby from 'globby'

const log = _log('@fab/deployer-aws-s3')

export const deployAssets: FabAssetsDeployer<ConfigTypes.AwsS3> = async (
  fab_path: string,
  working_dir: string,
  config: ConfigTypes.AwsS3
) => {
  const {
    public_url = 'https://s3.amazonaws.com/',
    bucket_name,
    access_key,
    secret_key,
    region = 'us-east-1',
  } = config
  if (!bucket_name) throw new Error('Need to specify a bucket name!')

  const extracted_dir = path.join(working_dir, `cf-workers-${nanoid()}`)
  await fs.ensureDir(extracted_dir)
  log(`💚✔💚 Generated working dir in 💛${extracted_dir}💛.`)
  await extract(fab_path, extracted_dir)
  log(`💚✔💚 Unpacked FAB.`)

  await doUpload(access_key, secret_key, region, bucket_name, extracted_dir)

  return `${public_url}/${bucket_name}`
}

const doUpload = async (
  access_key: string,
  secret_key: string,
  region: string,
  bucket_name: string,
  extracted_dir: string
) => {
  const s3 = new aws.S3({
    accessKeyId: access_key,
    secretAccessKey: secret_key,
    region: region,
  })

  await s3
    .createBucket({
      Bucket: bucket_name,
      CreateBucketConfiguration: {
        LocationConstraint: region === 'us-east-1' ? undefined : region,
      },
    })
    .promise()

  const files = await globby(['_assets/**/*'], { cwd: extracted_dir })
  console.log({ files })
  const uploads = files.map((file) => {
    return s3
      .upload({
        Bucket: bucket_name,
        Key: file,
        Body: fs.createReadStream(path.join(extracted_dir, file)),
        ACL: 'public-read',
      })
      .promise()
  })

  await Promise.all(uploads)
}
