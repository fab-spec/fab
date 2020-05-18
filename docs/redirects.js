export default ({ Router }) => {
  Router.on(
    '/guides/18-05-2020-why-frontend-bundles',
    () =>
      new Response(null, {
        status: 301,
        headers: {
          Location: '/blog/18-05-2020-why-frontend-bundles',
        },
      })
  )
}
