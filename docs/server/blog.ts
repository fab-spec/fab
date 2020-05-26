import React from 'react'
import ReactDOMServer from 'react-dom/server'
import { NotionRenderer } from 'react-notion/dist/react-notion.cjs.production.min.js'

import { FABRuntime } from '@fab/core'

export default ({ Router }: FABRuntime) => {
  Router.on('/blog/notion', async () => {
    const blogs = await fetch(
      'https://notion-api.splitbee.io/v1/table/779ebbf9d6974a9fa08003ebc82fb76f'
    ).then((res) => res.json())

    console.log({ blogs })

    const blockMap = await fetch(
      `https://notion-api.splitbee.io/v1/page/${blogs[0].id}`
    ).then((res) => res.json())

    console.log({ blockMap })

    return new Response(
      ReactDOMServer.renderToStaticMarkup(
        React.createElement(NotionRenderer, { blockMap })
      ),
      {
        headers: {
          'Content-Type': 'text/html',
        },
      }
    )
  })
}
