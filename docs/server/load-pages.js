console.log('LOADING DEM PAGES')

//const ROUTES = {"0":"lang-en-US","1":"lang-fr-FR","3":"pages/_"}

globalThis.chunks = {
  0: require('../.nuxt/dist/server/lang-en-US'),
  1: require('../.nuxt/dist/server/lang-fr-FR'),
  3: require('../.nuxt/dist/server/pages/_'),
}
