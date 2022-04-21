/* eslint-disable no-new */
import path = require('path');
import { AnyPrincipal, Effect, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import {
  CfnOutput, CfnResource, Duration, Stack, StackProps,
} from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { GatewayVpcEndpointAwsService, Vpc } from 'aws-cdk-lib/aws-ec2';
import {
  Cluster, ContainerImage, AwsLogDriver, FargateTaskDefinition,
} from 'aws-cdk-lib/aws-ecs';
import { ApplicationLoadBalancedFargateService } from 'aws-cdk-lib/aws-ecs-patterns';
import { CfnIntegration, CfnRoute } from 'aws-cdk-lib/aws-apigatewayv2';
import { HttpApi } from '@aws-cdk/aws-apigatewayv2-alpha';
import DonationsTable, { DONATIONS_TABLE } from './tables/donations';
import { cpuConfig } from './constants';

export default class RecruitmentNodejsTestStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const vpc = new Vpc(this, 'RecruitmentNodejsTestVPC', { maxAzs: cpuConfig.MAX_AZS });
    const cluster = new Cluster(this, 'Cluster', { vpc });

    // Application Load Balancer
    const fargateService = new ApplicationLoadBalancedFargateService(this, 'RecruitmentNodejsTestService', {
      cluster,
      cpu: cpuConfig.MAX_CPU_UNITS,
      memoryLimitMiB: cpuConfig.MAX_CPU_RAM,
      taskImageOptions: {
        image: ContainerImage.fromAsset(path.join(__dirname, '../src/')),
      },
    });

    // Autoscaling policy
    const scaling = fargateService.service.autoScaleTaskCount({ maxCapacity: cpuConfig.MAX_CPUS });
    scaling.scaleOnCpuUtilization('CpuScaling', {
      targetUtilizationPercent: cpuConfig.TARGET_CPU_UTILIZATION_PERCENT,
      scaleInCooldown: Duration.seconds(cpuConfig.COOLDOWN_PERIOD_SECONDS),
      scaleOutCooldown: Duration.seconds(cpuConfig.COOLDOWN_PERIOD_SECONDS),
    });

    // task definition with CloudWatch Logs
    const logging = new AwsLogDriver({
      streamPrefix: 'RecruitmentNodejsTestStackLogs',
    });

    // Logging task
    const taskDef = new FargateTaskDefinition(this, 'LoggingTaskDefinition', {
      memoryLimitMiB: cpuConfig.MAX_CPU_RAM,
      cpu: cpuConfig.MAX_CPU_UNITS,
    });

    taskDef.addContainer('AppContainer', {
      image: ContainerImage.fromAsset(path.join(__dirname, '../src/')),
      logging,
    });

    const donationsTable = new DonationsTable(this, DONATIONS_TABLE).table;
    const dynamoGatewayEndpoint = vpc.addGatewayEndpoint('dynamoGatewayEndpoint', {
      service: GatewayVpcEndpointAwsService.DYNAMODB,
    });

    // Allow PutItem action from the Fargate Task Definition only
    dynamoGatewayEndpoint.addToPolicy(
      new PolicyStatement({
        effect: Effect.ALLOW,
        principals: [new AnyPrincipal()],
        actions: [
          'dynamodb:PutItem',
        ],
        resources: [
          `${donationsTable.tableArn}`,
        ],
        conditions: {
          ArnEquals: {
            'aws:PrincipalArn': `${fargateService.taskDefinition.taskRole.roleArn}`,
          },
        },
      }),
    );

    // Write permissions for Fargate
    donationsTable.grantWriteData(fargateService.taskDefinition.taskRole);

    const httpVpcLink = new CfnResource(this, 'HttpVpcLink', {
      type: 'AWS::ApiGatewayV2::VpcLink',
      properties: {
        Name: 'V2 VPC Link',
        SubnetIds: vpc.privateSubnets.map((m) => m.subnetId),
      },
    });

    const api = new HttpApi(this, 'HttpApiGateway', {
      apiName: 'ApigwFargate',
      description: 'Integration between apigw and Application Load-Balanced Fargate Service',
    });

    const integration = new CfnIntegration(this, 'HttpApiGatewayIntegration', {
      apiId: api.httpApiId,
      connectionId: httpVpcLink.ref,
      connectionType: 'VPC_LINK',
      description: 'API Integration with AWS Fargate Service',
      integrationMethod: 'ANY',
      integrationType: 'HTTP_PROXY',
      integrationUri: fargateService.listener.listenerArn,
      payloadFormatVersion: '1.0',
    });

    new CfnRoute(this, 'Route', {
      apiId: api.httpApiId,
      routeKey: 'ANY /{proxy+}',
      target: `integrations/${integration.ref}`,
    });

    new CfnOutput(this, 'APIGatewayUrl', {
      description: 'API Gateway URL to access the GET endpoint',
      value: api.url!,
    });
  }
}
