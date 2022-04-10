import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as MyDnsZone from './dns';

export class DnsStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);
    new MyDnsZone.DnsZone(this, 'MyService');
  }
}
