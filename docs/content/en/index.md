---
title: 'Home'
description: 'Empower your NuxtJS application with @nuxt/content module: write in a content/ directory and fetch your Markdown, JSON, YAML and CSV files through a MongoDB like API, acting as Git-based Headless CMS.'
position: 1
category: Home
features:
  - FABs good
---

<h3 align="center"><img width="461" alt="FAB Stencil Logo Wide" src="https://user-images.githubusercontent.com/23264/79783164-24618700-8338-11ea-9c64-39738f29003a.png"/>
</h3>

<h5 align="center"><small><a href="https://fab.dev">https://fab.dev </a> • <a href="https://github.com/fab-spec/fab">https://github.com/fab-spec/fab </a> • <a href="https://twitter.com/fab_spec">@fab_spec </a></small></h5>

<div class="inline-images"></div>

[![npm](https://img.shields.io/npm/v/@fab/cli?label=%F0%9F%93%A6%20npm)](https://www.npmjs.com/package/@fab/cli)
[![Join discussion on Discord](https://img.shields.io/discord/308323056592486420?label=%F0%9F%92%AC%20discord%20)](https://discord.gg/Qvj3pJY)
[![GitHub last commit](https://img.shields.io/github/last-commit/fab-spec/fab?label=%E2%9C%8F%EF%B8%8F%20last%20commit)](https://github.com/fab-spec/fab)
[![GitHub Workflow Status](https://github.com/fab-spec/fab/workflows/FAB%20CI/badge.svg)](https://github.com/fab-spec/fab/actions)
[![Financial Contributors on Open Collective](https://img.shields.io/opencollective/all/fab?label=%F0%9F%92%B0%20supporters)](https://opencollective.com/fab)

Frontend Application Bundles (💎 FABs) are a **bundle format for frontend applications**.

They **unify static sites, single page applications (SPAs), server-side rendering (SSR) & server-side logic** in a single format, one that is universally compatible with and **easy to deploy to a wide range of hosting providers**, even your own infrastructure!

<div class="inline-video">
  <iframe src="https://www.youtube.com/embed/yIiGBU10SH8?rel=0&modestbranding=1" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen>
  </iframe>
</div>
    

<base-alert type="info">

**Want to get started?** Head to [fab.dev/guides/getting-started](/guides/getting-started) to start building your own FABs, or read on for more information about the project.

</base-alert>

## What can I can use FABs for?

Because FABs include [server-side JavaScript](/kb/fab-structure) capabilities but deploy [with a single command](/guides/deploying), you can start to add server-side logic without the complexity of managing servers. Making it easy to do things like:

- Deploy anything, even a server-rendered NextJS app, to Cloudflare workers.
- Add server-side logic like redirects & proxying to a Create React App project, without ejecting.
- Use Gatsby to generate a logged-in vs logged-out homepage and dynamically choose which one to serve to each user.
- Guard your application against unauthenticated users, by checking a cookie before you serve any JS or HTML.
- Deploy every commit to a unique URL to share your progress with colleagues.
- ...and more

> 👉 These examples will be being fleshed out in the coming days, for now the best place to learn is the [Adding Server-Side Logic](/guides/adding-server-side-logic) step of the [guide](/guides/getting-started), or [join our Discord channel](https://discord.gg/Qvj3pJY) to discuss your use-case.

## What frameworks & projects are supported?

At the moment, the FAB project is focussing on supporting the following projects, to try to give the best possible experience for the most users.

> 👉 If your app is in the following list, `npx fab init` should be all you need to run to get started!
>
> See [fab.dev/guides/getting-started](/guides/getting-started) for more info.

- Client-side rendered React (e.g. Create React App & friends)
- Server-side, client-side & static pre-rendered NextJS
- VueJS, AngularJS, Svelte etc projects that compile to static assets
- Anything else that's fully static (i.e. any app that can be hosted on S3, Netlify, Surge, etc.)
- An existing server-side rendered applications, with [some conversion](/guides/converting-custom-ssr).

However, _any_ server-side application that runs in (or compiles to) JavaScript, plus any amount of client-side code, should be able to be supported. If your application is not covered by the above list, it's worth reading the [FAB project goals](/kb/project-goals) and then [getting involved](/guides/giving-feedback) to make sure your needs will be supported in future.

## Where can I host them?

Currently, we have first-class support for releasing FABs to:

- Cloudflare Workers, using `@fab/deployer-cf-workers`
  - Free or \$5+/month
  - 200 cities worldwide
  - Extremely high-performance
- AWS Lambda@Edge, using `@fab/deployer-aws-lambda`
  - 84 cities worldwide
  - Some [limitations]
  - Good performance
  - Ideal for companies already running infrastructure on AWS
- Anywhere that can run NodeJS, using `@fab/server`, e.g.
  - Docker
  - Heroku
  - Now.sh v1

> 👉 Releases can be triggered manually using `fab deploy` on the command line or automatically using [Linc](https://linc.sh), a preconfigured CI/CD pipeline from the team behind FABs, with a generous free tier.
>
> See [fab.dev/guides/deploying](/guides/deploying) for more info.

## How does it work?

A FAB is a special ZIP file with two components, a single server-side JavaScript file, and a folder full of assets.

<h5 align="center">
  <img
    width="350px"
    max-width="100%"
    alt="FAB Structure"
    src="https://user-images.githubusercontent.com/23264/64143562-f9333180-ce53-11e9-9058-4d1d961a1d35.png"
  />
</h5>

From a fully static site, single-page app, to a fully server-rendered JS site, the FAB tooling compiles your application down to these two primitives.

> 👉 Read more about the FAB structure at [fab.dev/kb/fab-structure](/kb/fab-structure).

## What is a Frontend Application?

The term _**Frontend Application**_ encompasses a wide range of modern web projects, from purely static sites with no client-side JS, to entirely client-rendered apps hitting an API, or those with a significant server-side-rendering component. But they are defined in opposition to a more traditional "backend" application, which may emit HTML across the wire as well, but usually has a persistent server, with direct connections to databases and a local filesystem.

This is synonymous with some of the more common web app development methodologies in the React/Angular/Vue/Ember ecosystems—a self-contained single-page-app, potentially pre-rendered or server-rendered, talking to a separate backend app or collection of services via HTTP.

## Why a new bundle format?

The _**Frontend Application Bundle**_ is designed to fill a gap between existing options for frontend application deployment and hosting environments. Usually, you have a choice between a static site host, which prevents you from having any active server-side components, or a more traditional web app host designed for hosting backends.

And while deploying frontend apps to backend-centric hosts works reasonably well, it misses a crucial aspect of frontend web development—_iteration speed_. UI development benefits greatly from rapid prototyping and feedback, and since frontend apps, having no direct dependencies on databases or filesystems, can be cloned & deployed freely, backend-centric workflows can feel overly constrained.

As such, static site hosting has grown in popularity among the frontend application community, and static site generators along with them. But there are many reasons why it's preferable or even essential to include a server-side component in your application, which these projects can't take advantage of without fundamentally changing how they build & deliver their app.

_**Frontend Application Bundles**_ are the container format that work equally well for fully-static through to full server-rendered frontend apps, making your choice of _technology_ independent from your choice of _hosting_.

## Contributors

This project is being led by [Glen Maddern](https://github.com/geelen), previously a creator of [Styled Components](https://styled-components.com) & [CSS Modules](https://github.com/css-modules/css-modules), and supported by the whole team at [Linc](https://linc.sh), which is a pre-configured CI/CD pipeline for sites built with FABs.

Special thanks also must go to:

- [Jed Schmidt](https://github.com/jed) for donating the `fab` package name on NPM, replacing his super original and inventive [streaming JavaScript framework](https://www.npmjs.com/package/fab/v/0.5.3-original) from 2011!
- [Charlie Gleason](https://github.com/superhighfives) for the awesome FAB logo design!

### Code Contributors

Thank you to everyone who has contributed code so far. [[Get involved yourself](/guides/contributing), if you like].
<a href="https://github.com/fab-spec/fab/graphs/contributors"><img src="https://opencollective.com/fab/contributors.svg?width=890&button=false" /></a>

### Financial Contributors

Become a financial contributor and help us sustain our community. [[Contribute](https://opencollective.com/fab/contribute)]

#### Individuals

<a href="https://opencollective.com/fab"><img src="https://opencollective.com/fab/individuals.svg?width=890" /></a>

#### Organizations

Support this project with your organization. Your logo will show up here with a link to your website. [[Contribute](https://opencollective.com/fab/contribute)]

<a href="https://opencollective.com/fab/organization/0/website"><img src="https://opencollective.com/fab/organization/0/avatar.svg"/></a>
<a href="https://opencollective.com/fab/organization/1/website"><img src="https://opencollective.com/fab/organization/1/avatar.svg"/></a>
<a href="https://opencollective.com/fab/organization/2/website"><img src="https://opencollective.com/fab/organization/2/avatar.svg"/></a>
<a href="https://opencollective.com/fab/organization/3/website"><img src="https://opencollective.com/fab/organization/3/avatar.svg"/></a>
<a href="https://opencollective.com/fab/organization/4/website"><img src="https://opencollective.com/fab/organization/4/avatar.svg"/></a>
<a href="https://opencollective.com/fab/organization/5/website"><img src="https://opencollective.com/fab/organization/5/avatar.svg"/></a>
<a href="https://opencollective.com/fab/organization/6/website"><img src="https://opencollective.com/fab/organization/6/avatar.svg"/></a>
<a href="https://opencollective.com/fab/organization/7/website"><img src="https://opencollective.com/fab/organization/7/avatar.svg"/></a>
<a href="https://opencollective.com/fab/organization/8/website"><img src="https://opencollective.com/fab/organization/8/avatar.svg"/></a>
<a href="https://opencollective.com/fab/organization/9/website"><img src="https://opencollective.com/fab/organization/9/avatar.svg"/></a>

## FAB version 0.x docs

Prior to the v1 release, FABs were in a v0 experimental phase, with a different design, and many different packages. For the docs related to FAB v0, (e.g. standalone tools like `@fab/static` & `@fab/compile`) which are now in maintenance mode, see [fab-docs--production--v0.branch.linc-preview.sh](https://fab-docs--production--v0.branch.linc-preview.sh/).
