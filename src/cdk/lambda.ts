import { Construct } from 'constructs';
import { Architecture, Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';

export class LambdaConstruct extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);

    // Use the general `Function` class to define the function with the
    // source coming from a zip package created by the build process for
    // this project.
    new Function(this, 'Function', {
      runtime: Runtime.NODEJS_18_X,
      code: Code.fromAsset('./build/index.zip'),
      handler: 'index.handler',
      architecture: Architecture.ARM_64,
    });

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
  }
}
