import { FabAssetsDeployer, ConfigTypes } from '@fab/core'

export const deployAssets: FabAssetsDeployer<ConfigTypes.AwsS3> = async (
  fab_path: string,
  working_dir: string,
  config: ConfigTypes.AwsS3
) => {
  const { public_url = 'https://s3.amazonaws.com/', bucket_name } = config
  if (!bucket_name) throw new Error('Need to specify a bucket name!')

  // TODO: upload, obvs

  return `${public_url}/${bucket_name}`
}
