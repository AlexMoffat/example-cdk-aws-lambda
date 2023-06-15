import { App, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { LambdaConstruct } from './lambda';
import * as process from 'process';

export class ExampleStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    new LambdaConstruct(this, 'Lambda');
  }
}

const app = new App();

new ExampleStack(app, 'ExampleLambda', {
  env: {
    account: process.env.CDK_DEFAULT_ACCOUNT,
    region: process.env.CDK_DEFAULT_REGION,
  },
  description: 'An example.',
});
