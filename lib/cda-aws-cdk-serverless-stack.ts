import * as cdk from 'aws-cdk-lib';
import { NodejsFunction, NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import * as lambda from 'aws-cdk-lib/aws-lambda'
import { AttributeType, Table } from 'aws-cdk-lib/aws-dynamodb';
import { RemovalPolicy } from '@aws-cdk/core';
// import * as sqs from 'aws-cdk-lib/aws-sqs';

export class CdaAwsCdkServerlessStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const bdd = new Table(this, 'BDD-TEST', {
      partitionKey: {
        name: 'id',
        type: AttributeType.STRING
      },
      tableName: 'test',
      removalPolicy: cdk.RemovalPolicy.DESTROY
    });
    const params: NodejsFunctionProps = {
      memorySize: 128,
      // depsLockFilePath : '../Landas/Bichounou.ts',
      runtime: lambda.Runtime.NODEJS_16_X,

      environment: {
        BDD_TABLE: bdd.tableName,
        CLE:'id'
      },
    };

    // ** listTest
    const listTest = new NodejsFunction(this, 'LISTTEST', {
      entry: './Lambdas/listTest.ts',
      ...params
    })

    listTest.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
      cors: {
        allowedOrigins: ['*'],
        allowedMethods: [lambda.HttpMethod.GET, lambda.HttpMethod.HEAD],
      }
    })
    bdd.grantReadData(listTest)

    // ** getTest
    const getTest = new NodejsFunction(this, 'GETTEST', {
      entry: './Lambdas/getTest.ts',
      ...params
    })

    getTest.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
      cors: {
        allowedOrigins: ['*'],
        allowedMethods: [lambda.HttpMethod.GET, lambda.HttpMethod.HEAD],
      }
    })
    bdd.grantReadData(getTest)

    // ** putTest
    const putTest = new NodejsFunction(this, 'PUTTEST', {
      entry: './Lambdas/putTest.ts',
      ...params
    })

    putTest.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
      cors: {
        allowedOrigins: ['*'],
        allowedMethods: [lambda.HttpMethod.PUT],
      }
    })
    bdd.grantWriteData(putTest)

    // ** postTest
    const postTest = new NodejsFunction(this, 'POSTTEST', {
      entry: './Lambdas/postTest.ts',
      ...params
    })

    postTest.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
      cors: {
        allowedOrigins: ['*'],
        allowedMethods: [lambda.HttpMethod.POST,lambda.HttpMethod.PUT],
      }
    })
    bdd.grantWriteData(postTest)

    // ** deleteTest
    const deleteTest = new NodejsFunction(this, 'DELETETEST', {
      entry: './Lambdas/deleteTest.ts',
      ...params
    })

    deleteTest.addFunctionUrl({
      authType: lambda.FunctionUrlAuthType.NONE,
      cors: {
        allowedOrigins: ['*'],
        allowedMethods: [lambda.HttpMethod.DELETE],
      }
    })
    bdd.grantWriteData(deleteTest)
  }
}
