# Fab CLI design

After running a bunch of loosely-connected CLI tools (`@fab/static`, `@fab/compile`, `@fab/nextjs`), I think it'll be way easier for the user if everything's available and discoverable under a single entry point.

This goes well with a more coherent ecosystem-of-plugins approach, as well as the brand spanking new `fab` package on NPM (thanks Jed!).

So here's what I want to support:

```
fab init
fab build
fab serve
fab deploy
fab package
```

## `fab init`

If a project is using a framework like (unejected) CRA, NextJS, Gatsby, Nuxt, etc, then most of the settings can be inferred. For a first cut of this, I'd suggest that `init` tries to intuit what someone's using and generate a `fab.config.json5` file like the following:

```json5
{
  presets: {
    "@fab/preset-[FRAMEWORK]": {
      plus: "some",
      settings: "maybe"
    }
  },
  settings: {
    production: {}
  }
}
```

Any questions, or in the absence of a recognised framework, should be a Q&A process on the command line to generate the config file. I think that gives more opportunity to direct someone to the right config, rather than finding a tutorial and copying a particular incantation. They can do that with the config file anyway.

Alternative name, `fab autoconf`

## `fab build`

This is the single entry point for all building. We expect that everything has been set up in the `fab.config.json5` file. Potentially the only command line flags are:

* `--autoconf`/`--init`, which does a best-guess `fab init`, saving all defaults, then runs `fab build` as normal. This is for a CI/CD service like [Linc](https://linc.sh) to potentially generate FABs & deploys with zeroconfig from the user.
* Maybe `--intermediate-only`, idk?

Alternative name, `fab compile`? Idk.

## `fab serve`

This is a straight port of `@fab/serve`. But with one important (and much asked-for) addition:

* `--environment=ENV_NAME`/`-e ENV_NAME`, which injects environment-specific settings (that now have a home in `fab.config`) when booting up, rather than assuming production
* `--add-env-vars='{"KEY":"value"}'`, to add a one-off override. Using JSON here kinda sucks, I'm sure I can come up with a better API.
* `--port` as previous

## `fab deploy` & `fab package`

TBD, this is either CLI-driven or config driven, or Q&A with write-to-config like `fab init`. But the number of deploy targets is not gonna be massive, so one potential interface would be:

* `fab deploy --linc`, which uses [Linc](https://linc.sh) to get a preview link. Would require some auth, either system-wide in `~/.linc` or `~/
* `fab deploy --cf-workers`, which uses [Cloudflare Workers](https://workers.dev) to deploy to production
* `fab package --docker`, which uses `@fab/packager-docker` to generate... something that works in the Docker ecosystem?

This needs some further thought. It's down the priority list because Linc can already deploy preview links from a Github commit and release commits on `master` to CF Workers or Amazon Lambda@Edge (or more). So people can just use that for now.
