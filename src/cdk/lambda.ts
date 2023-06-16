import { Construct } from 'constructs';
import { Architecture, Code, Function, Runtime } from 'aws-cdk-lib/aws-lambda';

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
  }
}
