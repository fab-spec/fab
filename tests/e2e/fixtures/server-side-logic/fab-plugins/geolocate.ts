import { FABRuntime } from '@dev-spendesk/fab-core'

export default ({ Router }: FABRuntime) => {
  Router.on('/geolocate', async () => {
    const geo_response = await fetch('http://ip-api.com/json')
    const geo_json = await geo_response.json()
    const { country, regionName, city } = geo_json
    return new Response(
      `This request is being served from ${city} in ${regionName}, ${country}.`,
      {
        headers: {
          'content-type': 'text/plain',
        },
      }
    )
  })
}
