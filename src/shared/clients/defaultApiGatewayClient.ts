/*!
 * Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import { APIGateway } from 'aws-sdk'
import { ext } from '../extensionGlobals'
import '../utilities/asyncIteratorShim'
import { ApiGatewayClient } from './apiGatewayClient'
import { RestApi } from 'aws-sdk/clients/apigateway'

export class DefaultApiGatewayClient implements ApiGatewayClient {
    public constructor(public readonly regionCode: string) {}

    public async *getResourcesForApi(apiId: string): AsyncIterableIterator<APIGateway.Resource> {
        const client = await this.createSdkClient()

        const request: APIGateway.GetResourcesRequest = {
            restApiId: apiId,
        }

        do {
            const response: APIGateway.Resources = await client.getResources(request).promise()

            if (response.items !== undefined && response.items.length > 0) {
                yield* response.items
            }

            request.position = response.position
        } while (request.position !== undefined)
    }

    public async *listApis(): AsyncIterableIterator<RestApi> {
        const client = await this.createSdkClient()

        const request: APIGateway.GetRestApisRequest = {}

        do {
            const response: APIGateway.RestApis = await client.getRestApis(request).promise()

            if (response.items !== undefined && response.items.length > 0) {
                yield* response.items
            }

            request.position = response.position
        } while (request.position !== undefined)
    }

    public async testInvokeMethod(
        apiId: string,
        resourceId: string,
        method: string,
        body: string,
        pathWithQueryString: string | undefined
    ): Promise<APIGateway.TestInvokeMethodResponse> {
        const client = await this.createSdkClient()
        const request: APIGateway.TestInvokeMethodRequest = {
            restApiId: apiId,
            resourceId: resourceId,
            httpMethod: method,
            body: body,
        }
        if (pathWithQueryString) {
            request.pathWithQueryString = pathWithQueryString
        }

        return await client.testInvokeMethod(request).promise()
    }

    private async createSdkClient(): Promise<APIGateway> {
        return await ext.sdkClientBuilder.createAndConfigureServiceClient(
            options => new APIGateway(options),
            undefined,
            this.regionCode
        )
    }
}
