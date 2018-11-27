const render = require('app-index').default;

render({
  url: '/',
  method: 'GET',
  headers: {
    host: 'localhost:3000',
    'user-agent': 'curl/7.54.0',
    accept: '*/*'
  }
}).then(response => {
  console.log("GOT RESPONSE")
  console.log(response)
})
