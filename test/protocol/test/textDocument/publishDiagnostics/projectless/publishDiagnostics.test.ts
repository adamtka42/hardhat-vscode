import { test } from 'mocha'
import { DiagnosticSeverity } from 'vscode-languageserver-protocol'
import { TestLanguageClient } from '../../../../src/TestLanguageClient'
import { getInitializedClient } from '../../../client'
import { getProjectPath } from '../../../helpers'

let client!: TestLanguageClient

describe('[projectless] publishDiagnostics', () => {
  beforeEach(async () => {
    client = await getInitializedClient()
    client.clear()
  })

  afterEach(async () => {
    await client.closeAllDocuments()
  })

  test('missing semicolon', async function () {
    const documentPath = getProjectPath('projectless/src/diagnostics/MissingSemicolon.hyp')

    await client.openDocument(documentPath)

    await client.getDiagnostic(documentPath, {
      source: 'hyperion',
      severity: DiagnosticSeverity.Error,
      message: "Expected ';' but got '}'",
      range: {
        start: {
          line: 5,
          character: 0,
        },
        end: {
          line: 5,
          character: 1,
        },
      },
    })
  })

  test('non existing import', async function () {
    const documentPath = getProjectPath('projectless/src/diagnostics/ImportNonexistent.hyp')

    await client.openDocument(documentPath)

    await client.getDiagnostic(documentPath, {
      source: 'hyperion',
      severity: DiagnosticSeverity.Error,
      message: 'not found: File import callback not supported',
      range: {
        start: {
          line: 4,
          character: 0,
        },
        end: {
          line: 4,
          character: 27,
        },
      },
    })
  })
})
