# @fab/deployer-cf-workers

Package & deploy a FAB to Cloudflare Workers

Add the following to your `deploy` section of your

```json5
{
  // ...
  deploy: {
    'cf-workers': {
      // Use a .env file to store these if you like
      account_id: '@CF_WORKERS_ACCOUNT_ID',
      api_token: '@CF_WORKERS_API_TOKEN',
      // Your CF script name
      script_name: 'fab-is-rad',
      // If set to true (default), then we'll only deploy to
      // fab-is-rad.[yourname].workers.dev, and you can skip zone_id/route
      workers_dev: false,
      // If ^ is false, you need these two. Zone ID is in your CF dashboard.
      zone_id: '@CF_ZONE_ID',
      // What public URL to serve on? You have to configure DNS separately
      route: 'https://fab-is-rad.com/*',

      // Optional additional bindings, only if you know you really need it
      custom_bindings: [
        {
          type: 'kv_namespace',
          name: 'GLOBAL_VAR_NAME',
          namespace_id: '...', // get from Cloudflare dashboard
        },
        // ...
      ],
    },
    // ...
  },
}
```

See https://fab.dev/guides/deploying for more info
