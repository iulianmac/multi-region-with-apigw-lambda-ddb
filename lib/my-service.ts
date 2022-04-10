import { Construct } from 'constructs';
import * as apigateway from 'aws-cdk-lib/aws-apigateway';
import * as lambda from 'aws-cdk-lib/aws-lambda';
import * as s3 from 'aws-cdk-lib/aws-s3';
import * as route53 from 'aws-cdk-lib/aws-route53';
import * as acm from 'aws-cdk-lib/aws-certificatemanager';
import * as targets from 'aws-cdk-lib/aws-route53-targets';
import { ZONE_NAME } from './config';

type MyServiceProps = {
    region: string
  }

export class MyService extends Construct {
  constructor(scope: Construct, id: string, props: MyServiceProps) {
    super(scope, id);

    const hostedZoneName = ZONE_NAME;
    const { region } = props;

    const hostedZone = route53.HostedZone.fromLookup(this, 'MyZone', {
      domainName: hostedZoneName,
    });

    const acmCert = new acm.Certificate(this, 'Certificate', {
      domainName: `api.${region}.${hostedZoneName}`,
      subjectAlternativeNames: [`api.${hostedZoneName}`],
      validation: acm.CertificateValidation.fromDns(hostedZone),
    });

    const bucket = new s3.Bucket(this, 'MyStore');

    const handler = new lambda.Function(this, 'MyHandler', {
      runtime: lambda.Runtime.PYTHON_3_9, // So we can use async in My.js
      code: lambda.Code.fromAsset('resources'),
      handler: 'my-service.lambda_handler',
      environment: {
        BUCKET: bucket.bucketName,
      },
    });

    bucket.grantReadWrite(handler); // was: handler.role);

    const api = new apigateway.RestApi(this, 'Mys-api', {
      restApiName: 'My Service',
      description: 'This service serves Mys.',
      domainName: {
        domainName: `api.${region}.${hostedZoneName}`,
        certificate: acmCert,
      },
    });
    api.addDomainName(
      'global',
      {
        domainName: `api.${hostedZoneName}`,
        certificate: acmCert,
      },
    );

    new route53.ARecord(this, 'CustomDomainAliasRecord', {
      zone: hostedZone,
      recordName: `api.${region}.${hostedZoneName}`,
      target: route53.RecordTarget.fromAlias(new targets.ApiGateway(api)),
    });

    const getMysIntegration = new apigateway.LambdaIntegration(handler, {
      requestTemplates: { 'application/json': '{ "statusCode": "200" }' },
    });

    api.root.addMethod('GET', getMysIntegration, {
      authorizationType: apigateway.AuthorizationType.IAM,
    });
  }
}
