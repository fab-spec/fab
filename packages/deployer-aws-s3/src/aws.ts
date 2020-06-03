import aws from 'aws-sdk'
import { ReadStream } from 'fs'
import { IMMUTABLE_HEADERS } from '@fab/core'

export function authenticate(region: string, access_key: string, secret_key: string) {
  aws.config.update({
    region,
    accessKeyId: access_key,
    secretAccessKey: secret_key,
  })
  return new aws.S3()
}

export async function createBucket(s3: aws.S3, bucket_name: string) {
  await s3
    .createBucket({
      Bucket: bucket_name,
    })
    .promise()
}

export async function makeBucketWebsite(s3: aws.S3, bucket_name: string) {
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
}

export async function putObject(
  s3: aws.S3,
  bucket_name: string,
  file: string,
  body_stream: ReadStream,
  content_type: string
) {
  await s3
    .putObject({
      Bucket: bucket_name,
      Key: file,
      Body: body_stream,
      ACL: 'public-read',
      ContentType: content_type,
      CacheControl: IMMUTABLE_HEADERS['cache-control'],
    })
    .promise()
}
