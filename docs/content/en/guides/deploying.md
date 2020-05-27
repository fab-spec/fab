---
title: Deploying
description: 'Manually deploy your FAB to the cloud'
category: Guides
position: 203
---

# Deploying FABs

There are two ways to deploy FABs:

- **Manually**, by adding a `deploy` section to your `fab.config.json5` and calling `fab deploy fab.zip` on the command line.
- **Automatically**, by using a cloud-based service such as [Linc](https://linc.sh).

> 👉 Read more about the [advantages of Automatic Deploys](/kb/automatic-deploys), or read on for manual configuration instructions.

## Assets vs Server hosting

FABs are [a combination of a server file and an assets directory](/kb/fab-structure), and while some hosts (like the NodeJS-based `@fab/server`) are capable of serving both, in practice it can be advantageous to have the stored separately.

For instance, you typically only have one "version" of your FAB deployed at once, i.e. one `server.js` file online at any one time, but assets from old releases may still need to be accessed. Also, since assets are guaranteed to be fingerprinted they can, and are, served with `cache-control: immutable`, meaning that they're readily cached at the edge using a CDN, meaning that the performance requirements of the hosting service itself is quite different.

With that in mind, these are the currently-supported hosting platforms:

## AWS S3

AWS S3 is a perfect choice for your asset hosts, since it's virtually unlimited and extremely cost-effective, and can be set up for public, read-only access, with the FAB server sitting in front of it.

> 👉 In fact, S3 is so well-suited to asset hosting it is currently the _only_ asset hosting option, until [this issue](https://github.com/fab-spec/fab/pull/113) is resolved to use Cloudflare KV store for assets.

To configure S3 bucket creation & uploading, add the following section to your `fab.config.json5`:

```json5
{
  //...
  "deploy": {
    //...
    "aws-s3": {
      access_key: "@S3_ACCESS_KEY",
      secret_key: "@S3_SECRET_KEY",
      region: "us-east-1",
      bucket_name: "fab-assets-your-project-name"
    }
    //...
  }
}
```

The two values that you'll need are an `ACCESS KEY` and `SECRET KEY` for your AWS account, with enough permissions to create, set permissions on, and upload to a bucket. You can [create an IAM User](https://console.aws.amazon.com/iam/home?region=us-east-1#/users) with the following policy to allow full access to S3 buckets on your account, but only those starting with the name `fab-assets-`:

```json
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "CreateFabAssetBuckets",
            "Action": [
                "s3:*"
            ],
            "Effect": "Allow",
            "Resource": [
                "arn:aws:s3:::fab-assets-*",
                "arn:aws:s3:::fab-assets-*/*"
            ]
        }
    ]
}
```

Either hard-code the access key & secret into the `fab.config.json5` file or store them in a `.env` file in the same directory, where the FAB deployer will automatically pick them up.

## Cloudflare Workers

The best production FAB hosting environment right now is [Cloudflare Workers](https://workers.dev). To deploy a FAB server component to them, we need the following config:

### For a `.workers.dev` subdomain

When you sign up for a Cloudflare account, you can reserve a namespace on the `.workers.dev` subdomain. This gives you a place to test Cloudflare deployments as you develop your app, before choosing and releasing to a production domain. In order to dpeloy to a workers.dev subdomain, add the following config:

```json5
{
  //...
  "deploy": {
    //...
    "cf-workers": {
      account_id: "@CF_WORKERS_ACCOUNT_ID",
      api_token: "@CF_WORKERS_API_TOKEN",
      workers_dev: true,
      script_name: "your-app-name"
    },
    //...
  }
}
```

This will deploy your FAB to `your-app-name.<your-account>.workers.dev`. For more information about how to get your Account ID and API Token, visit https://linc.sh/docs/cloudflare-workers.

### For a production domain

The only additional requirement is the `zone_id` for your domain, and to specify any subdomains you want your FAB active using the `route` property:

```json5
{
  //...
  "deploy": {
    //...
    "cf-workers": {
      account_id: "@CF_WORKERS_ACCOUNT_ID",
      api_token: "@CF_WORKERS_API_TOKEN",
      workers_dev: false,
      script_name: "unused-but-still-must-be-unique",
      zone_id: "@FAB_DEV_ZONE_ID",
      route: "https://your.domain.com/*"
    },
    //...
  }
}
```

Your `zone_id` and `route` must match. For more information about gathering this data, see  https://linc.sh/docs/cloudflare-workers.

## Lambda@Edge

For production use-cases that are heavily tied to AWS infrastructure, Lambda@Edge offers the highest-performing hosting environment.

You require the following config:

```json5
{
  //...
  "deploy": {
    //...
    'aws-lambda-edge': {
      access_key: '@AWS_LAMBDA_ACCESS_KEY',
      cf_distribution_id: '@AWS_CF_DISTRIBUTION_ID',
      lambda_arn: '@AWS_LAMBDA_ARN',
      secret_key: '@AWS_LAMBDA_SECRET_KEY',
      region: 'us-east-1'
    },
    //...
  }
}
```

For a guided tutorial about setting up this architecture, including a Cloudformation template to speed up configuration, see https://linc.sh/docs/lambda

### Limitations

Lambda@Edge cannot stream responses, and is limited to 1MB responses, important for non-immutable assets.
