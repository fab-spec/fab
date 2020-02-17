**_<h3 align="center"><br/><img width="461" alt="fab logo wide" src="https://user-images.githubusercontent.com/23264/53997145-306ba300-418f-11e9-91d0-b44e6df85d4c.png"/></h3>_**

[![Join discussion on Discord](https://img.shields.io/discord/308323056592486420.svg)](https://discord.gg/Qvj3pJY)

**NOTE: these docs are for the `next` branch, which is in public pre-release, and active development.** For the docs related to FAB v0, (e.g. standalone tools like `@fab/static` & `@fab/compile`) which are now in maintenance mode, see [fab-docs--production--v0.branch.linc-preview.sh](https://fab-docs--production--v0.branch.linc-preview.sh/).

# FAB Specification

💎 FABs are a **compile target for frontend applications**.

They unify **static sites, single page applications (SPAs) as well as server-rendered JavaScript UIs** in one bundle format, allowing instant deployment to a wide range of hosting platforms. Its goal is to do for frontend applications what Docker has done for infrastructure—a standard for interoperable tooling.

https://github.com/fab-spec/fab

## Overview

<img width="100%" alt="FAB Diagram" src="https://user-images.githubusercontent.com/23264/63136503-b5e46080-c015-11e9-9f69-c974e11d9528.png"/>

<p align="right">
👉 <em>Read more about the <a href="https://fab.dev/kb/fab-structure">FAB Structure</a></em>.
</p>

## Getting started

Want to try building a FAB from your project? Head to [https://fab.dev/guides/getting-started](https://fab.dev/guides/getting-started).

## The FAB format

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
