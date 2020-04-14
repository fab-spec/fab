export const DEFAULT_CONFIG_FILENAME = 'fab.config.json5'

export const DEFAULT_MIME_TYPE = 'text/html; charset=utf-8'

export const IMMUTABLE_HEADERS = { 'Cache-Control': 'immutable' }
export const NON_IMMUTABLE_HEADERS = { 'Cache-Control': 'no-cache' }

export const REGEXP_VALUE_PATTERN = /^\/.*\/([gimy]*)$/
export const ENV_VAR_SYNTAX = /^@([A-Z0-9_]+$)?/

const CF_WORKERS_CONFIG = {
  account_id: '',
  zone_id: '',
  route: '',
  api_token: '',
  workers_dev: false,
  script_name: '',
}
const AWS_LAMBDA_CONFIG = {
  access_key: '',
  secret_key: '',
  region: '',
  cf_distribution_id: '',
  lambda_arn: '',
}
const AWS_S3_CONFIG = {
  access_key: '',
  secret_key: '',
  region: '',
  bucket_name: '',
}

export namespace ConfigTypes {
  export type CFWorkers = typeof CF_WORKERS_CONFIG
  export type AwsLambda = typeof AWS_LAMBDA_CONFIG
  export type AwsS3 = typeof AWS_S3_CONFIG
  export type Union = CFWorkers | AwsLambda | AwsS3
}

type HostingProvider = {
  package_name: string
  capabilities: { server: boolean; assets: boolean }
  config: ConfigTypes.Union
  extension: string
}

export const HOSTING_PROVIDERS: {
  [key: string]: HostingProvider
} = {
  'cf-workers': {
    package_name: '@fab/deployer-cf-workers',
    capabilities: {
      server: true,
      assets: true,
    },
    config: CF_WORKERS_CONFIG,
    extension: 'js',
  },
  'aws-lambda-edge': {
    package_name: '@fab/deployer-aws-lambda',
    capabilities: {
      server: true,
      assets: false,
    },
    config: AWS_LAMBDA_CONFIG,
    extension: 'zip',
  },
  'aws-s3': {
    package_name: '@fab/deployer-aws-s3',
    capabilities: {
      server: false,
      assets: true,
    },
    config: AWS_S3_CONFIG,
    extension: 'zip',
  },
}
