/*!
 * Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */

import assert from 'assert'
import { instance, mock, when, anything } from 'ts-mockito'
import * as vscode from 'vscode'
import {
    TemplateFunctionResource,
    TemplateSymbolProvider,
    TemplateSymbolResolver,
} from '../../../shared/cloudformation/templateSymbolResolver'

const range = new vscode.Range(0, 0, 0, 0)

const firstFunctionType = string('Type')
const firstFunction = module('Function1', [firstFunctionType])

const secondFunctionType = string('Type')
const secondFunction = module('Function2', [secondFunctionType])

const looksLikeFunctionType = string('Type')
const looksLikeFunction = module('LooksLikeFunction', [looksLikeFunctionType])

const symbols: vscode.DocumentSymbol[] = [
    module('Globals'),
    module('Resources', [
        firstFunction,
        module('NumberType', [number('Type')]),
        secondFunction,
        module('MissingType', [string('Missing')]),
        module('AnotherResource'),
        looksLikeFunction,
    ]),
]

function module(name: string, children: vscode.DocumentSymbol[] = []) {
    return symbol(name, vscode.SymbolKind.Module, children)
}

function string(name: string, children: vscode.DocumentSymbol[] = []) {
    return symbol(name, vscode.SymbolKind.String, children)
}

function number(name: string, children: vscode.DocumentSymbol[] = []) {
    return symbol(name, vscode.SymbolKind.Number, children)
}

function symbol(name: string, kind: vscode.SymbolKind, children: vscode.DocumentSymbol[] = []) {
    const newSymbol = new vscode.DocumentSymbol(name, 'detail', kind, range, range)
    newSymbol.children = children

    return newSymbol
}

describe('TemplateSymbolResolver', function () {
    let mockDocument: vscode.TextDocument
    let document: vscode.TextDocument

    let mockSymbolProvider: TemplateSymbolProvider
    let symbolProvider: TemplateSymbolProvider

    beforeEach(function () {
        mockDocument = mock()
        document = instance(mockDocument)

        mockSymbolProvider = mock()
        symbolProvider = instance(mockSymbolProvider)

        when(mockSymbolProvider.getSymbols(document, anything())).thenResolve(symbols)
        when(mockSymbolProvider.getText(firstFunctionType, document)).thenReturn('"Type": "AWS::Serverless::Function"')
        when(mockSymbolProvider.getText(secondFunctionType, document)).thenReturn('Type: AWS::Serverless::Function')
        when(mockSymbolProvider.getText(looksLikeFunctionType, document)).thenReturn('Type: NotActuallyAFunction')
    })

    it('gets function resources', async function () {
        const symbolResolver = new TemplateSymbolResolver(document, symbolProvider)
        const functionResources = await symbolResolver.getResourcesOfKind('function', false)

        const expectedResources: TemplateFunctionResource[] = [
            {
                name: firstFunction.name,
                range: firstFunction.range,
                kind: 'function',
            },
            {
                name: secondFunction.name,
                range: secondFunction.range,
                kind: 'function',
            },
        ]

        assert.deepStrictEqual(functionResources, expectedResources)
    })
})
