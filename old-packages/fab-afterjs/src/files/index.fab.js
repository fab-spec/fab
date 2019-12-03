import { render } from '@jaredpalmer/after'
import routes from './routes'

const assets = require(process.env.RAZZLE_ASSETS_MANIFEST)

export default async (req, res, settings) => {
  // Add headers here, or use ctx.res.setHeader inside getInitialProps
  res.setHeader('Content-Type', 'text/html')
  res.setHeader('Cache-Control', 's-maxage=300, public, max-age=0')

  return await render({
    req,
    res,
    routes,
    assets,
    // Anything else you add here will be made available
    // within getInitialProps(ctx)
    // e.g a redux store...
    ...settings
  })
}
