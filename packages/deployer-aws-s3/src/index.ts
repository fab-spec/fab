import { AwsS3DeployConfig, FabDeployer } from '@fab/core'

console.log('HEY HO')

export const deployAssets: FabDeployer<AwsS3DeployConfig> = async (
  fab_path: string,
  working_dir: string,
  config: AwsS3DeployConfig
) => {
  const { public_url = 'https://s3.amazonaws.com/', bucket_name } = config
  if (!bucket_name) throw new Error('Need to specify a bucket name!')

  // TODO: upload, obvs

  return `${public_url}/${bucket_name}`
}
