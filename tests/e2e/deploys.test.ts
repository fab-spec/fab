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
      fab_filename: `fab.create-react-app.zip`,
      cf_workers: {
        required_env_vars: ['CF_WORKERS_API_TOKEN', 'AWS_S3_SECRET_KEY'],
        s3_access_key: 'AKIAWIORJFSCPZGQ4K6U',
        s3_bucket: 'fab-ci-assets-create-react-app-cf-workers',
        script_name: 'fab-ci-create-react-app',
        cf_account_id: 'cd3d2f25fb7dfdd4e8be7f187b2cbad1',
      },
      aws_lambda_edge: {
        required_env_vars: ['AWS_CRA_SECRET', 'AWS_S3_SECRET_KEY'],
        s3_bucket: 'fab-ci-assets-create-react-app-aws-lambda-edge',
      },
    },
    // {
    //   name: 'NextJS',
    //   test_dir: 'nextjs-test',
    //   fab_filename: `fab.nextjs.zip`,
    //   cf_workers: {
    //     required_env_vars: ['CF_WORKERS_API_TOKEN', 'AWS_S3_SECRET_KEY'],
    //     s3_bucket: 'fab-ci-assets-create-react-app-cf-workers',
    //     script_name: 'fab-ci-nextjs',
    //   },
    //   aws_lambda_edge: {
    //     required_env_vars: ['AWS_NEXTJS_SECRET', 'AWS_S3_SECRET_KEY'],
    //     s3_bucket: 'fab-ci-assets-create-react-app-aws-lambda-edge',
    //   },
    // },
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
    })

    it('should deploy FABs to CF Workers', async () => {
      const {
        required_env_vars,
        s3_bucket,
        script_name,
        cf_account_id,
        s3_access_key,
      } = project.cf_workers
      const fab_path = path.resolve(cwd, fab_filename)
      if (!(await fs.pathExists(fab_path))) {
        return console.log(
          `No fab found at ${fab_path}. Skipping deploy test for ${name}.`
        )
      }
      if (!required_env_vars.every((var_name) => process.env[var_name])) {
        return console.log(
          `Missing env vars. Require ${required_env_vars.join(
            ', '
          )}. Skipping deploy test for ${name}.`
        )
      }
      const config_filename = `fab.config-${test_dir}.json5`
      await fs.writeFile(
        path.join(cwd, config_filename),
        `{
          plugins: {},
          deploy: {
            'cf-workers': {
              account_id: '${cf_account_id}',
              api_token: '@${required_env_vars[0]}',
              script_name: '${script_name}',
              workers_dev: true
            },
            'aws-s3': {
              access_key: '${s3_access_key}',
              secret_key: '@${required_env_vars[1]}',
              region: 'us-east-1',
              bucket_name: '${s3_bucket}',
            }
          }
        }`
      )
      await shell(
        `fab deploy ${path.relative(cwd, fab_path)} --config=${config_filename}`,
        { cwd }
      )
    })
  }
})
