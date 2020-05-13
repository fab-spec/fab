---
name: 'Automatic Deploys'
route: '/kb/automatic-deploys'
menu: Knowledge Base
---

# Automatic Deploys

While [deploying manually](/guides/deploying) from the command-line is great to get going with FABs, once you have a project established using FABs it's far more convenient to set up a workflow where new commits to a particular branch, say `master`, are automatically built & deployed to your chosen production host.

This page describes the FAB project's recommended best practice about working with FABs and production sites. This page is a work-in-progress, further examples will be added in the coming days.

> 👉 Disclosure: the FAB project [is supported by](/#contributors) [Linc](https://linc.sh), which is a tool that was designed in tandem with FABs to provide this very workflow.

## Preview hosting

As each FAB is a [production artefact](/kb/production), configuring a cloud-based tool to build & generate FABs means that hosting per-commit previews becomes trivial. [Read more](https://linc.sh/blog/ten-unexpected-uses-for-preview-links) about the benefits of per-commit previews on the [Linc blog](https://linc.sh/blog).

## Automatic, atomic releases

If you've already built & tested a particular FAB on a particular commit, then releasing it to your production traffic should be a noop—it is simply a matter of now sending all traffic to `https://example.com` to your new release. Building a new (untested) FAB and deploying it directly to production traffic, while possible, should always be the less-preferred method of deploying to production.

Ideally, merging a PR should result in an instantaneous release to production, since, for a fast-forward merge (i.e. when your PR is "up to date with master"), the `tree_id` is unchanged from the last commit on the PR branch. This means that a suitably-advanced CI/CD pipeline can immediately release the latest FAB, since its contents cannot have changed if the contents of the repository did not.

## Workflow integrations

Since every FAB built from a particular source commit will be identical, using FABs as your unit of measurement for performance (e.g. Calibre, Lighthouse) or correctness (e.g. Cypress, Percy) integrations can significantly accelerate the confidence your team has in your application's development.

This is especially true on larger teams with multiple disparate development teams and a single operations team—the ability for an ops team to say "use any framework you want, as long as it compiles to a FAB" gives the two business units a standard to develop against.
