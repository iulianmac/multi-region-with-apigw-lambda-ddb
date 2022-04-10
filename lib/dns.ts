/* eslint-disable import/prefer-default-export */
import { Construct } from 'constructs';
import * as route53 from 'aws-cdk-lib/aws-route53';
import { ZONE_NAME } from './config';

export class DnsZone extends Construct {
  constructor(scope: Construct, id: string) {
    super(scope, id);
    new route53.PublicHostedZone(this, 'HostedZone', {
      zoneName: ZONE_NAME,
    });
  }
}
