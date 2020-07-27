import path from 'path'
import { getWorkingDir } from './helpers'
import fs from 'fs-extra'
import { shell } from '../utils'

describe('Deploy tests', () => {
  let cwd: string

  beforeAll(async () => {
    cwd = await getWorkingDir('deploys', true)
  })

  const projects = [
    {
      name: 'Create React App',
      test_dir: 'cra-test',
      fab_filename: `fab.react-app.zip`,
      cf_workers: {
        required_env_vars: {
          cf_api: 'CF_WORKERS_API_TOKEN',
          s3_secret: 'AWS_S3_SECRET_KEY',
        },
        s3_access_key: 'AKIAWIORJFSCPZGQ4K6U',
        s3_bucket: 'fab-ci-assets-create-react-app-cf-workers',
        script_name: 'fab-ci-create-react-app',
        cf_account_id: '2e39fe49d1e04e295900f31a54e98586',
      },
      aws_lambda_edge: {
        required_env_vars: {
          lambda_secret: 'AWS_CRA_SECRET',
          s3_secret: 'AWS_S3_SECRET_KEY',
        },
        lambda_access_key: 'AKIAWIORJFSCKBFIHH3I',
        lambda_arn:
          'arn:aws:lambda:us-east-1:430472506500:function:create-react-app-aws-lambda-edge-renderer',
        cf_distribution_id: 'E21MWL8EM38Z5Q',
        s3_access_key: 'AKIAWIORJFSCPZGQ4K6U',
        s3_bucket: 'fab-ci-assets-create-react-app-aws-lambda-edge',
      },
    },
    {
      name: 'NextJS',
      test_dir: 'nextjs-test',
      fab_filename: `fab.nextjs.zip`,
      cf_workers: {
        required_env_vars: {
          cf_api: 'CF_WORKERS_API_TOKEN',
          s3_secret: 'AWS_S3_SECRET_KEY',
        },
        s3_access_key: 'AKIAWIORJFSCPZGQ4K6U',
        s3_bucket: 'fab-ci-assets-nextjs-cf-workers',
        script_name: 'fab-ci-nextjs',
        cf_account_id: '2e39fe49d1e04e295900f31a54e98586',
      },
      aws_lambda_edge: {
        required_env_vars: {
          lambda_secret: 'AWS_NEXTJS_SECRET',
          s3_secret: 'AWS_S3_SECRET_KEY',
        },
        lambda_access_key: 'AKIAWIORJFSCGEPQ7LWJ',
        lambda_arn:
          'arn:aws:lambda:us-east-1:430472506500:function:nextjs-aws-lambda-edge-renderer',
        cf_distribution_id: 'E1KZB8DX6ZCP2V',
        s3_access_key: 'AKIAWIORJFSCPZGQ4K6U',
        s3_bucket: 'fab-ci-assets-nextjs-aws-lambda-edge',
      },
    },
  ]

  for (const project of projects) {
    const { name, test_dir, fab_filename } = project

    describe(name, () => {
      it('should copy FABs from the previous test run', async () => {
        const fab_in_other_test = path.resolve(cwd, `../${test_dir}/fab.zip`)
        if (await fs.pathExists(fab_in_other_test)) {
          await shell(`cp ${fab_in_other_test} ${fab_filename}`, { cwd })
        } else {
          console.log(
            `No fab.zip found in the ${name} project. Run that E2E test before running this one. Skipping.`
          )
        }
      })

      it('should deploy to CF Workers', async () => {
        const {
          required_env_vars,
          s3_bucket,
          script_name,
          cf_account_id,
          s3_access_key,
        } = project.cf_workers
        const fab_config = `{
          plugins: {},
          deploy: {
            'cf-workers': {
              account_id: '${cf_account_id}',
              api_token: '@${required_env_vars.cf_api}',
              script_name: '${script_name}',
              workers_dev: true
            },
            'aws-s3': {
              access_key: '${s3_access_key}',
              secret_key: '@${required_env_vars.s3_secret}',
              region: 'us-east-1',
              bucket_name: '${s3_bucket}',
            }
          }
        }`

        return await deploy(fab_filename, name, required_env_vars, test_dir, fab_config)
      })

      it('should deploy to AWS Lambda@Edge', async () => {
        const {
          required_env_vars,
          lambda_access_key,
          lambda_arn,
          cf_distribution_id,
          s3_access_key,
          s3_bucket,
        } = project.aws_lambda_edge
        const fab_config = `{
          plugins: {},
          deploy: {
            'aws-lambda-edge': {
              access_key: '${lambda_access_key}',
              cf_distribution_id: '${cf_distribution_id}',
              lambda_arn: '${lambda_arn}',
              secret_key: '@${required_env_vars.lambda_secret}',
              region: 'us-east-1'
            },
            'aws-s3': {
              access_key: '${s3_access_key}',
              secret_key: '@${required_env_vars.s3_secret}',
              region: 'us-east-1',
              bucket_name: '${s3_bucket}',
            }
          }
        }`

        return await deploy(fab_filename, name, required_env_vars, test_dir, fab_config)
      })
    })
  }

  async function deploy(
    fab_filename: string,
    name: string,
    required_env_vars: { [k: string]: string },
    test_dir: string,
    fab_config: string
  ) {
    const fab_path = path.resolve(cwd, fab_filename)
    if (!(await fs.pathExists(fab_path))) {
      return console.log(`No fab found at ${fab_path}. Skipping deploy test for ${name}.`)
    }
    const env_vars = Object.values(required_env_vars)
    if (!env_vars.every((var_name) => process.env[var_name])) {
      return console.log(
        `Missing env vars. Require ${env_vars.join(
          ', '
        )}. Skipping deploy test for ${name}.`
      )
    }
    const config_filename = `fab.config-${test_dir}.json5`
    await fs.writeFile(path.join(cwd, config_filename), fab_config)
    await shell(
      `fab deploy ${path.relative(cwd, fab_path)} --config=${config_filename}`,
      { cwd }
    )
  }
})
