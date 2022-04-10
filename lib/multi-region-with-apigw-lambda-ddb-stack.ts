import { Environment, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as MyPythonService from './my-service';

interface Stack2Props extends StackProps {
  env: Environment;
}

export class MultiRegionWithApigwLambdaDdbStack extends Stack {
  constructor(scope: Construct, id: string, props: Stack2Props) {
    super(scope, id, props);
    const region = props.env.region ? props.env.region : 'us-west-2';
    new MyPythonService.MyService(this, 'MyService', { region });
  }
}
