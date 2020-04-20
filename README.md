<h3 align="center"><a href="https://github.com/fab-spec/fab"><img width="461" alt="Frontend Application Bundles" src={require('../assets/FAB Stencil Logo Wide.png')}/></a></h3>

[![npm](https://img.shields.io/npm/v/@fab/cli)](https://www.npmjs.com/package/@fab/cli)
[![GitHub Workflow Status](https://github.com/fab-spec/fab/workflows/FAB%20CI/badge.svg)](https://github.com/fab-spec/fab/actions)
[![Join discussion on Discord](https://img.shields.io/discord/308323056592486420.svg)](https://discord.gg/Qvj3pJY)
[![Financial Contributors on Open Collective](https://opencollective.com/fab/all/badge.svg?label=financial+contributors)](https://opencollective.com/fab)

Frontend Application Bundles (💎 FABs) are a **bundle format for frontend applications**.

A bit like a Docker container, but specifically for frontend, they **unify static sites, single page applications (SPAs) as well as server-rendered JavaScript UIs** in a single format, allowing you to separate _what you're building_ from _where you're planning to host it_.

## Get started

Head to [https://fab.dev/guides/getting-started](fab.dev/guides/getting-started) to start building your own FABs, or read on for more information about the project.

## The FAB format

<img width="100%" alt="FAB Diagram" src="https://user-images.githubusercontent.com/23264/63136503-b5e46080-c015-11e9-9f69-c974e11d9528.png"/>

<p align="right">
👉 <em>Read more about the <a href="https://fab.dev/kb/fab-structure">FAB Structure</a></em>.
</p>

### What is a Frontend Application?

The term _**Frontend Application**_ encompasses a wide range of modern web projects, from purely static sites with no client-side JS, to entirely client-rendered apps hitting an API, or those with a significant server-side-rendering component. But they are defined in opposition to a more traditional "backend" application, which may emit HTML across the wire as well, but usually has a persistent server, with direct connections to databases and a local filesystem.

This is synonymous with some of the more common web app development methodologies in the React/Angular/Vue/Ember ecosystems—a self-contained single-page-app, potentially pre-rendered or server-rendered, talking to a separate backend app or collection of services via HTTP.

### Why a new bundle format?

The _**Frontend Application Bundle**_ is designed to fill a gap between existing options for frontend application deployment and hosting environments. Usually, you have a choice between a static site host, which prevents you from having any active server-side components, or a more traditional web app host designed for hosting backends.

And while deploying frontend apps to backend-centric hosts works reasonably well, it misses a crucial aspect of frontend web development—_iteration speed_. UI development benefits greatly from rapid prototyping and feedback, and since frontend apps, having no direct dependencies on databases or filesystems, can be cloned & deployed freely, backend-centric workflows can feel overly constrained.

As such, static site hosting has grown in popularity among the frontend application community, and static site generators along with them. But there are many reasons why it's preferable or even essential to include a server-side component in your application, which these projects can't take advantage of without fundamentally changing how they build & deliver their app.

_**Frontend Application Bundles**_ are the container format that work equally well for fully-static through to full server-rendered frontend apps, making your choice of _technology_ independent from your choice of _hosting_.

---

@glenmaddern.

## Contributors

### Code Contributors

This project exists thanks to all the people who contribute. [[Contribute](CONTRIBUTING.md)].
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

Prior to the

**NOTE: these docs are for the `next` branch, which is in public pre-release, and active development.** For the docs related to FAB v0, (e.g. standalone tools like `@fab/static` & `@fab/compile`) which are now in maintenance mode, see [fab-docs--production--v0.branch.linc-preview.sh](https://fab-docs--production--v0.branch.linc-preview.sh/).
