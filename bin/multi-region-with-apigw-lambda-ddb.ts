#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { MultiRegionWithApigwLambdaDdbStack } from '../lib/multi-region-with-apigw-lambda-ddb-stack';
import { DnsStack } from '../lib/dns-stack';

const app = new cdk.App();
const envPDX = { account: '547039824751', region: 'us-west-2' };
const envIAD = { account: '547039824751', region: 'us-east-1' };

new MultiRegionWithApigwLambdaDdbStack(app, 'MultiRegionWithApigwLambdaDdbStack-PDX', { env: envPDX });
new MultiRegionWithApigwLambdaDdbStack(app, 'MultiRegionWithApigwLambdaDdbStack-IAD', { env: envIAD });
new DnsStack(app, 'DnsStack', { env: envPDX });
