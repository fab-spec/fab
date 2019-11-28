export const build = () => {
  console.log("I am build time.")
}

export const render = () => {
  console.log("I am render time")
  return new Response('OK', {
    status: 200
  })
}
