import { render } from '@jaredpalmer/after'
import routes from './routes'

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST)

export default async (req, res, settings) =>
  await render({
    req,
    res,
    routes,
    assets,
    // Anything else you add here will be made available
    // within getInitialProps(ctx)
    // e.g a redux store...
    ...settings
  })
