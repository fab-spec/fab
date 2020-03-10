import fs from 'fs'
import path from 'path'
import { promisify } from 'util'
import cpy from 'cpy'
import del from 'del'
import globby from 'globby'

const writeFile = promisify(fs.writeFile)

// const enum WorkerType {
//   DEV = 'DEV',
//   REGULAR = 'REGULAR',
//   SITE = 'SITE',
// }

interface DeployProps {
  accountId: string
  name: string
  fabDir: string
  tmpDir: string
  assetsBaseURL?: string
  zoneId?: string
}

export interface DotDevProps extends DeployProps {
  assetsBaseURL: string
}

export interface RegularWorkerProps extends DeployProps {
  zoneId: string
  assetsBaseURL?: string
}

interface Env {
  BASE_URL?: string
}

const isWorkerDotDev = (props: DeployProps) => {
  return !props.zoneId
}

// function isDotDev(props: DeployProps): props is DotDevProps {
//   return (props as RegularWorkerProps).zoneId === undefined
// }

// function getWorkerType(props: DeployProps): WorkerType {
//   if (isDotDev(props)) {
//     return WorkerType.DEV
//   }
//   return (props as RegularWorkerProps).assetsBaseURL
//     ? WorkerType.REGULAR
//     : WorkerType.SITE
// }

const initDirs = async (props: DeployProps) => {
  const tmpDir = path.resolve(props.tmpDir)
  await del(tmpDir)
  const fabDir = props.fabDir
  const serverDir = path.join(tmpDir, 'server')
  const publicDir = path.join(tmpDir, 'public')
  fs.mkdirSync(props.tmpDir, { recursive: true })
  fs.mkdirSync(serverDir, { recursive: true })
  fs.mkdirSync(publicDir, { recursive: true })
  await cpy('server.js', serverDir, { cwd: fabDir })
  await cpy('_assets/**', publicDir, { cwd: fabDir, parents: true })
  return { tmpDir, fabDir, publicDir, serverDir }
}

const generatePackageJson = async (dir: string) => {
  await writeFile(path.join(dir, 'package.json'), JSON.stringify({ main: 'index.js' }))
}

const generateWranglerToml = async (dir: string, env: any, props: DeployProps) => {
  // await fs.writeFile(
  //   '.fab/deploy/cf/wrangler.toml',

  const toml = `
name = "${props.name}"
type = "webpack"
zone_id = "${props.zoneId ? props.zoneId : ''}"
private = false
account_id = "${props.accountId}"
workers_dev = ${isWorkerDotDev(props)}
route = ""
`
}

const generateURLHandler = async (
  baseURL: string,
  serverDir: string,
  publicDir: string
): Promise<Env> => {
  const files = await globby('**', { cwd: publicDir })
  const hash = files.reduce((acc: any, cur: string) => {
    acc['/' + cur] = true
    return acc
  }, {})
  await writeFile(path.join(serverDir, 'assets_manifest.json'), JSON.stringify(hash))
  fs.copyFileSync(
    path.join(__dirname, '..', 'templates', 'URLAssetHandler.js'),
    path.join(serverDir, 'assetHandler.js')
  )
  return {
    BASE_URL: baseURL,
  }
}

const generateAssetsHandler = async (
  props: DeployProps,
  serverDir: string,
  publicDir: string
) => {
  if (props.assetsBaseURL) {
    await generateURLHandler(props.assetsBaseURL, serverDir, publicDir)
  }
  console.log({ serverDir, publicDir })
}

const bundle = async (props: DeployProps) => {
  const { serverDir, publicDir } = await initDirs(props)
  await generatePackageJson(serverDir)
  const env = await generateAssetsHandler(props, serverDir, publicDir)
  console.log({ env })
}

const deploy = async (props: DeployProps) => {
  await bundle(props)
}

export { deploy }
