# What the fuck is going on?

Nothing works and everything is bad, so maybe writing this down is gonna help.

What do I know?

- The BBC SSR code has enough non-standard JS that makes me hesitant to try to add the ability to customise the Rollup code that FAB build uses.
  - Allowing `export` and TS annotations feels like an ok thing, but it means that we're gonna want the output of Webpack as input into Rollup. Ok.
- EVERY runtime plugin must be able to be rolled-up. So there's no problem doing it ahead of time.
- Trying to figure out whether a plugin exports build steps and/or runtime steps or if requiring /runtime is better is a bit of a shitshow. Plus, there's the open question around ordering of plugins. Am I missing something here?

Maybe I should go back to figuring out how plugins are written before I focus on compilation?

Then again, no matter what, I'm going to need Webpack output working as Rollup input. So it'd be nice to know how all these export/compilation inputs/outputs interact. Let's do that.

Did I break anything?

- `bbc-spike` breaks on absolute-minimal-fab, so yes. `next` doesn't, but I do want some of the stuff from the spike.
