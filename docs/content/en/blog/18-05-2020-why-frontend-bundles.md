---
title: 'Why "Frontend" bundles, specifically?'
category: Blog
position: 999
---

# Why "Frontend" bundles, specifically?

Something that just popped up [on Twitter](https://twitter.com/toddgeist/status/1261648564612030465) was the suggestion that the "Frontend" part of FABs could be replaced with something more generic, keeping the container idea but allowing for more "backend-y" use-cases, for example "Fullstack Application Bundle".

I thought I'd quickly jot down my thoughts on the matter.

## Use FABs for whatever you want

Before we start, it's worth pointing out that a FAB is just a zip file of a `server.js` plus any assets you want. Nothing says the assets need to be there, you could have a perfectly-valid FAB with just `server.js` providing some "backend-y" functionality, and use the FAB tooling to deploy it just fine.

In fact, in one of the [discussions on this topic](https://github.com/fab-spec/fab/issues/41), I raise the concept of having a project generating & deploying multiple FABs, or even a way of compiling two FABs together for, say, A/B testing:

> [You could have a] "FAB of FABs" where each "entry point" gets rendered to its own FAB, then you produce something of a router FAB that sits in front, at the edge, and proxies to the others.

That said, there are good reasons why FABs are designed the way they are, and why "frontend" is an important part of them:

## The real difference between "frontend" and "backend":

So this is partly my fault for using such overloaded terms, (in my defence, the other available terms are worse) but it's worth clarifying what I've come to understand as the true difference between your backend and frontend code, which is your **source of truth**:

- **Frontend** code's source of truth is the **user experience** (UX).
- **Backend** code's source of truth is the **data model** (DM).

Your source of truth is how you measure whether your code is "correct". It determines when something needs to change and why.

Notice that I'm not talking about what language the code is written in or even where it runs, only about what source of truth it serves. The source of truth could also be thought of as the "potential reasons for change", which can be a bit easier to think about:

### Example: a new feature

Let's say you have an automated deployment tool, and at the moment you can see what is _currently_ deployed, but nothing about previous attempts, successful or not.

Your task is to add the ability to view the log of previous deploy events. The data's already in the table, albeit in a fairly rough form.

Your task breaks down to:

1. Write the query to pull the info you need out of the DB.
2. Add an index to make the above query fast.
3. Add an API endpoint to expose the data to the client.
4. Add a page to the UI to list the events.
5. Query from the UI to the API to get the data.
6. Add links to this new page around the rest of the UI.

Now, since steps 1-3 would traditionally happen on your server, and 4-6 happen inside your React app, you might be tempted to consider that the split. But which of these pieces would need to change for a **user experience (UX)‌** change, versus a **data model (DM)** change?

1. **Query**: depending on how specific it is to _this_ piece of UI, potentially both, but definitely DM.
2. **Index**: DM. Changing how the data is captured or stored means figuring out how to effectively index it.
3. **API endpoint**: if it's specific for this UI, it changes with UX changes, but if it's generic (e.g. a GraphQL resolver) it might be more a DM concern.
4. **UI**: Part of UX.
5. **Data access**: Changes when you need more information. Goes away when you don't want this feature any more. UX.
6. **Links**: Changes to make this feature more/less prominent. UX.

Depending on how exactly your data is structured, and how general-purpose your API is, you might draw the line differently. Potentially your "frontend" is everything outside the DB server, potentially you have lots of backend-specific code in an API layer, potentially your DB structure is coupled all the way into your UI code. The point being, thinking about what source-of-truth a particular piece of code serves can help you understand whether you have a clean separation of concerns, or not.

### An aside: GraphQL

As a former backend developer (primarily using Rails), the meteoric rise of GraphQL initially puzzled me: I didn't quite see what problem it solved. As I understood it, when working on a UX feature, you would add UI code in JS and API-layer code in Ruby, but that felt fine, at least to me. It meant that I could access data through Rails' rich Model layer, and construct queries that I knew to be performant. GraphQL seemed like it was giving up a lot to simply write my queries in JS.

These days, however, I've come to realise that the big benefit felt by teams was that your client-side code became much more of a "complete" frontend codebase (i.e. almost all UX-driven changes could be handled by changing code in the one place), and likewise your backend _needed to change less_, since it only changed when your data model changed.

In other words, GraphQL made teams faster because it aligned the technology with the underlying sources-of-truth in the system, but it's important to note that _only one half needed to go faster_.

## Speed of Iteration

As GraphQL demonstrated, product development improves when your architecture reflects one very important fact: that **your user-experience needs to change vastly more often than your data model does**.

Just think about the number and variety of people who care about your product, either inside your team or out. How many people care about its UX (which includes functionality, design, performance, usability, etc), versus its DM (what data is captured, how it's stored, how much it costs to host & run, etc)? And how many different disciplines are needed to make a good-quality UX versus a good-quality DM?

In my experience, the _only_ path to good UX is via collaboration, using experimentation, testing, feedback & iteration. _Anything_ that speeds up that process has a direct result in the quality of your product. Conversely, the more different systems your "frontend" code covers, the slower your iteration speed, and the worse your overall outcome.

## FABs: "frontend" !== "client side"

Speeding up frontend teams and involving more people in a collaborative effort towards better UX is all well and good, but in practice it's resulted in "frontend" web development being synonymous with "client-side". Indeed, GraphQL's success lies in part to the fact that the queries themselves are part of the client-side codebase, so the frontend developers who operate there can control it.

To me, that's confusing the issue. The benefit comes from a single codebase that can be iterated on by frontend specialists with improving UX as their goal, not from the specifics of _where that code runs_. FABs are a way to package up both the client and some of your server-side code in a single deployment artefact, so that frontend developers have access to a server-side environment as easily as they do the client.

As such, you're welcome to put as much code that you consider "backend" into your `server.js` as you like, but, if it changes with the UI in service of the UX, I'd call that "frontend" code, no matter where it runs.

> This pattern is also called Backend for Frontend or [BFFs](https://samnewman.io/patterns/architectural/bff/), but I prefer considering it part of your frontend, just one that runs outside your client.

So, in answer to the original question, **FABs are all about "frontend" code because _that's the bit that needs to go faster_**. If you have truly backend-related, model-driven code, you don't want it changing as fast as your frontend. If you try to put them together, your backend is just going to slow your frontend down.

So build FABs, [preview every commit](https://linc.sh), and go fast!

## A thought experiment to finish

> This is something I plan to implement as an example, and I'll replace this with a link to that once it's done, but for now a description will have to suffice.

One thing that's never sat right with me about GraphQL is the way you first send down the queries (as source code in your JS file), then you `POST` them back to your API, then your data comes back in the structure you asked for. This makes sense if the only two layers you have is the client and the API server, but what could that look like with FABs?

Well, imagine if all your GraphQL queries were kept in the `server.js`, and exposed UI-specific endpoints on dedicated URLs:

```js
import query from './query-helper'

export default ({ Router }) => {
  Router.on('/api/sidebar-sites', async () => {
    return query(gql`
      {
        view {
          sites {
            repository_name
            name
            starred
            created_at
          }
        }
      }
    `)
  })

  Router.on('/api/site/:sitename', async () => {
    return query(gql`
      // ...
    `)
  })
}
```

This would mean instead of `/graphql` being the only endpoint your client hits, it would be hitting `/api/sidebar-sites` and `/api/site/fab-docs` instead, which means you could start to cache those requests independently, using normal HTTP headers. It would also make your web browser's network tab a _lot_ more obvious.

It also saves you from sending down the queries to the client, in effect making this a kind of "GraphQL stored procedure" (which Relay Modern calls ["static queries"](https://engineering.fb.com/data-infrastructure/relay-modern-simpler-faster-more-extensible/)). In practice this benefit may be minor, but if your FAB server and your client-side code are a single unit, deployed together and iterated on freely, why not?

---

— [@glenmaddern](https://twitter.com/glenmaddern)
