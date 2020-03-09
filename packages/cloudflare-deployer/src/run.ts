import { join } from 'path'
import { deploy, DotDevProps } from './index'

const run = async () => {
  const props: DotDevProps = {
    fabDir: join(__dirname, '..', 'test-data'),
    tmpDir: 'tmp',
    name: 'blah',
    accountId: '12345',
    assetsBaseURL: 'https://somebucket.aws.com/',
  }
  await deploy(props)
}

run()
