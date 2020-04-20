# Guarding against non-authenticated users with FABs

Even if your application is fully client-rendered (as in, runs wholly in the browser), it can still be beneficial to detect whether someone is already logged in before booting the JS. Indeed, a lot of the most complex React/etc applications are designed to run _fully behind a log-in screen_—any marketing or documentation pages are served from a different system, even on a different URL (e.g. example.com vs app.example.com).

In that case, you can add a few lines to your FAB to detect the presence (and validity, if you like) of your chosen authentication method. Below is an example, using cookie-based auth, taken from `app.linc.sh`\*

```
export default () => {
  return async function responder({ request }) {
    // TODO: fill in auth
  }
}
```

_\* Linc is a product built by the same team that develops FABs. [Read more]._
