export const DEFAULT_CONFIG_FILENAME = 'fab.config.json5'

export const DEFAULT_MIME_TYPE = 'text/html; charset=utf-8'

export const IMMUTABLE_HEADERS = { 'Cache-Control': 'immutable' }
export const NON_IMMUTABLE_HEADERS = { 'Cache-Control': 'no-cache' }

export const REGEXP_VALUE_PATTERN = /^\/.*\/([gimy]*)$/

export const HOSTING_PROVIDERS: {
  [key: string]: {
    package_name: string
    capabilities: { server: boolean; assets: boolean }
  }
} = {
  'cf-workers': {
    package_name: '@fab/deployer-cf-workers',
    capabilities: {
      server: true,
      assets: true,
    },
  },
  'aws-lambda-edge': {
    package_name: '@fab/deployer-aws-lambda',
    capabilities: {
      server: true,
      assets: false,
    },
  },
  'aws-s3': {
    package_name: '@fab/deployer-aws-s3',
    capabilities: {
      server: false,
      assets: true,
    },
  },
}
