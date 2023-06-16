# An AWS Lambda function implemented in TypeScript and deployed with the CDK

## Introduction

This is the simplest Lambda I could think of to demonstrate a complete build and
deploy process. The source code for the Lambda function is in the `src/main`
directory. The source for the CDK app that deploys the function is in the
`src/cdk` directory. There are no tests so `package.json` includes no
dependencies on `jest` or similar.

The `handler` function exported by [index.ts](src/main/index.ts) is the handler
property configured in [lambda.ts](src/cdk/lambda.ts). Invoking the Lambda calls
the function. 

lambda.ts uses the CDK `Function` class. This can be used for any supported
language but here for the NODEJS_18_X runtime the source is JavaScript bundled
into a zip file by the project's build process. The `NodejsFunction` class is an
alternative. This is specialized for creating functions for the NODEJS runtimes
and will handle transpiling and bundling internally. However, it requires docker
to execute so I choose not to use it. An example is shown at the [end of the
README](#example-nodejsfunction).

In outline the build process is

* [Prettier](https://prettier.io) and [ESLint](https://eslint.org) are setup so
  that running `yarn format` will reformat the source according the Prettier's
  rules and `yarn lint` will check the source with ESList.
* TypeScript is compiled to JavaScript by `tsc`. The JavaScript and source maps
  end up in the `dist` directory. Both the source for the Lambda and the source
  for the CDK app are compiled at the same time. `yarn tsc`.
* [Webpack](https://webpack.js.org) takes the JavaScript from `dist/main` and
  produces the final [index.js](build/index.js). For this simple Lambda this is
  mostly minimization. It also processes the source maps produced by `tsc` so
  that the final source map points from the `index.js` output by webpack to the
  original `index.ts` source. `yarn webpack`.
* Zip takes the final `index.js` and `index.js.map` output by webpack and
  creates the `index.zip` that will be used by the CDK to create the Lambda
  function in AWS. `yarn zip`.
* [AWS Cloud Development Kit](https://aws.amazon.com/cdk/) creates a
  Cloudformation template from the definitions in [app.ts](src/cdk/app.ts) and
  [lambda.ts](src/cdk/lambda.ts) after they've been compiled to JavaScript by
  `tsc`. This is then deployed to AWS together with the code in `index.zip`.

## Prerequisites and build environment

This was build using yarn 3.6.0 not using zero-install. Run `yarn install` first.

### Access to an AWS Account

Set AWS_PROFILE environment variable to choose the AWS CLI profile you want to
use with cdk.

### AWS CLI Installed

You'll need the cli available for part of the bootstrap process and to log in to
AWS if you're using AWS IAM Identity Center.

### Bootstrap AWS CDK

If you've not used the CDK before you'll need to
[bootstrap](https://docs.aws.amazon.com/cdk/v2/guide/bootstrapping.html) the
environment you're going to deploy into. An environment is a combination of AWS
account and region. Follow the instruction in the Bootstrapping section of the
[Getting started](https://docs.aws.amazon.com/cdk/v2/guide/getting_started.html)
guide.

## Execution

Set the AWS_PROFILE environment variable if you're not using the default
profile. Log in to AWS if you need to. `aws sso login`.

Run `yarn build && yarn deploy`. Even if you want to just run `yarn synth` you
need to run `yarn build` first because [lambda.ts](src/cdk/lambda.ts) references
the `index.zip` file created by the build process.

Log in to your AWS account and you'll see the newly deployed Lambda.

Use `yarn destroy` to tear down the artifacts created by the deploy.

## The Pieces

### CDK

The app entry in `cdk.json` specifies the command that `cdk` will run to define
the [stack](https://docs.aws.amazon.com/cdk/v2/guide/stacks.html) to synthesize
and deploy. Here "app" is configured to run "yarn app" so the final command is
defined in [package.json](package.json).

### ESLint

ESLint is configured by [.eslintrc.json](.eslintrc.json). Read the comments in
that file to understand the configuration.

### Prettier

Configured by [.prettierignore](.prettierignore) and
[.prettierrc.yml](.prettierrc.yml). Both files have comments. I prefer this over
adding to `package.json` because comments are possible with separate files.

### tsc

Configuration for the compiler is in [tsconfig.js](tsconfig.json). 

### Webpack

Webpack takes the JavaScript output by the TypeScript compiler, `tsc`, and creates
the bundles that are loaded by node. See the comments in [webpack.config.js](webpack.config.js) for configuration information.

### yarn

The scripts.

#### app

Run the `app.js` script created from `src/cdk/app.ts` by the typescript
compilation process.

#### build

Combines `clean`, `tsc`, `webpack` and `zip` to create the final bundle that 
cdk will deploy.

#### clean

Removes build products.

#### deploy

Synthesize the Cloudformation templates from the cdk app and deploy to AWS.

#### destroy

Remove from AWS the artifacts created by the `deploy` command.

#### diff

Compare what the current cdk stack would produce with what's currently deployed
and show the differences.

#### format

Run `prettier` to reformat the typescript code.

#### lint

Run `eslint` to check the typescript code.

#### synth

Run `cdk synth` to synthesize and print out the Cloudformation template for the
app stack.

#### tsc

Run the typescript compiler.

#### webpack

Run webpack.

#### zip

Take the output from webpack and create the zip file that the `app.ts` expects.
If you don't have a zip file synth, diff and deploy won't work.

## Example NodejsFunction

```typescript
    // Use the `NodejsFunction` to define effectively the same function but
    // using the process built into the CDK to create and package the JavaScript
    // starting from the TypeScript.
    new NodejsFunction(this, 'NodejsFunction', {
      runtime: Runtime.NODEJS_18_X,
      architecture: Architecture.ARM_64,
      bundling: {
        minify: true,
        sourceMap: true,
      },
      environment: {
        NODE_OPTIONS: '--enable-source-maps',
      },
      entry: './src/main/index.ts',
      handler: 'handler',
    });
```
