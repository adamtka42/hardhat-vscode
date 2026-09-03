import { test } from 'mocha'
import { expect } from 'chai'
import { TestLanguageClient } from '../../../../src/TestLanguageClient'
import { getInitializedClient } from '../../../client'
import { getProjectPath, makeRange } from '../../../helpers'
import { toUri } from '../../../../src/helpers'

let client!: TestLanguageClient

describe('[hardhat][codeAction]', () => {
  beforeEach(async () => {
    client = await getInitializedClient()
  })

  afterEach(async () => {
    await client.closeAllDocuments()
  })

  test('add license identifier', async () => {
    const documentPath = getProjectPath('hardhat/contracts/codeAction/NoLicense.hyp')
    const documentUri = toUri(documentPath)

    await client.openDocument(documentPath)

    const diagnostic = await client.getDiagnostic(documentPath, { message: 'SPDX license identifier not provided' })

    const codeActions = await client.getCodeActions(documentUri, diagnostic)

    const expected = [
      {
        title: 'Add license identifier: MIT',
        kind: 'quickfix',
        isPreferred: false,
        edit: {
          changes: {
            [toUri(getProjectPath('hardhat/contracts/codeAction/NoLicense.hyp'))]: [
              {
                range: {
                  start: {
                    character: 0,
                    line: 0,
                  },
                  end: {
                    character: 0,
                    line: 0,
                  },
                },
                newText: '// SPDX-License-Identifier: MIT\n',
              },
            ],
          },
        },
      },
      {
        title: 'Add license identifier: GPL-2.0-or-later',
        kind: 'quickfix',
        isPreferred: false,
        edit: {
          changes: {
            [toUri(getProjectPath('hardhat/contracts/codeAction/NoLicense.hyp'))]: [
              {
                range: {
                  start: {
                    character: 0,
                    line: 0,
                  },
                  end: {
                    character: 0,
                    line: 0,
                  },
                },
                newText: '// SPDX-License-Identifier: GPL-2.0-or-later\n',
              },
            ],
          },
        },
      },
      {
        title: 'Add license identifier: GPL-3.0-or-later',
        kind: 'quickfix',
        isPreferred: false,
        edit: {
          changes: {
            [toUri(getProjectPath('hardhat/contracts/codeAction/NoLicense.hyp'))]: [
              {
                range: {
                  start: {
                    character: 0,
                    line: 0,
                  },
                  end: {
                    character: 0,
                    line: 0,
                  },
                },
                newText: '// SPDX-License-Identifier: GPL-3.0-or-later\n',
              },
            ],
          },
        },
      },
      {
        title: 'Add license identifier: Unlicense',
        kind: 'quickfix',
        isPreferred: false,
        edit: {
          changes: {
            [toUri(getProjectPath('hardhat/contracts/codeAction/NoLicense.hyp'))]: [
              {
                range: {
                  start: {
                    character: 0,
                    line: 0,
                  },
                  end: {
                    character: 0,
                    line: 0,
                  },
                },
                newText: '// SPDX-License-Identifier: Unlicense\n',
              },
            ],
          },
        },
      },
    ]

    expect(codeActions).to.have.deep.members(expected)
  })

  test('add multi override specifier', async () => {
    const documentPath = getProjectPath('hardhat/contracts/codeAction/AddMultioverrideSpecifier.hyp')
    const documentUri = toUri(documentPath)

    await client.openDocument(documentPath)

    let diagnostic = await client.getDiagnostic(documentPath, {
      message: 'needs to specify overridden contracts',
      range: makeRange(20, 11, 20, 14),
    })

    let codeActions = await client.getCodeActions(documentUri, diagnostic)

    let expected = [
      {
        title: 'Add override(...) specifier to function definition',
        kind: 'quickfix',
        isPreferred: true,
        edit: {
          changes: {
            [toUri(getProjectPath('hardhat/contracts/codeAction/AddMultioverrideSpecifier.hyp'))]: [
              {
                newText: ' override(Alpha, Gamma)',
                range: {
                  start: {
                    line: 20,
                    character: 23,
                  },
                  end: {
                    line: 20,
                    character: 23,
                  },
                },
              },
            ],
          },
        },
      },
    ]

    expect(codeActions).to.have.deep.members(expected)

    diagnostic = await client.getDiagnostic(documentPath, {
      message: 'needs to specify overridden contracts',
      range: makeRange(22, 32, 22, 47),
    })

    codeActions = await client.getCodeActions(documentUri, diagnostic)

    expected = [
      {
        title: 'Add missing contracts to specifier',
        kind: 'quickfix',
        isPreferred: true,
        edit: {
          changes: {
            [toUri(getProjectPath('hardhat/contracts/codeAction/AddMultioverrideSpecifier.hyp'))]: [
              {
                range: {
                  start: {
                    line: 22,
                    character: 32,
                  },
                  end: {
                    line: 22,
                    character: 47,
                  },
                },
                newText: 'override(Alpha, Beta, Gamma)',
              },
            ],
          },
        },
      },
    ]

    expect(codeActions).to.have.deep.members(expected)
  })

  test('add override specifier', async () => {
    const documentPath = getProjectPath('hardhat/contracts/codeAction/AddOverrideSpecifier.hyp')
    const documentUri = toUri(documentPath)

    await client.openDocument(documentPath)

    const diagnostic = await client.getDiagnostic(documentPath, {
      range: makeRange(20, 11, 20, 25),
    })

    const codeActions = await client.getCodeActions(documentUri, diagnostic)

    const expected = [
      {
        title: 'Add override specifier to function definition',
        kind: 'quickfix',
        isPreferred: true,
        edit: {
          changes: {
            [toUri(getProjectPath('hardhat/contracts/codeAction/AddOverrideSpecifier.hyp'))]: [
              {
                newText: '    override\n',
                range: {
                  start: {
                    line: 22,
                    character: 0,
                  },
                  end: {
                    line: 22,
                    character: 0,
                  },
                },
              },
            ],
          },
        },
      },
    ]

    expect(codeActions).to.have.deep.members(expected)
  })

  test('add virtual specifier', async () => {
    const documentPath = getProjectPath('hardhat/contracts/codeAction/AddVirtualSpecifier.hyp')
    const documentUri = toUri(documentPath)

    await client.openDocument(documentPath)

    const diagnostic = await client.getDiagnostic(documentPath, {
      range: makeRange(4, 11, 4, 15),
    })

    const codeActions = await client.getCodeActions(documentUri, diagnostic)

    const expected = [
      {
        title: 'Add virtual specifier to function definition',
        kind: 'quickfix',
        isPreferred: true,
        edit: {
          changes: {
            [toUri(getProjectPath('hardhat/contracts/codeAction/AddVirtualSpecifier.hyp'))]: [
              {
                newText: ' virtual',
                range: {
                  start: {
                    line: 4,
                    character: 29,
                  },
                  end: {
                    line: 4,
                    character: 29,
                  },
                },
              },
            ],
          },
        },
      },
    ]

    expect(codeActions).to.have.deep.members(expected)
  })

  test('constrain mutability - view', async () => {
    const documentPath = getProjectPath('hardhat/contracts/codeAction/ConstrainMutabilityView.hyp')
    const documentUri = toUri(documentPath)

    await client.openDocument(documentPath)

    const diagnostic = await client.getDiagnostic(documentPath, {
      range: makeRange(6, 11, 6, 21),
    })

    const codeActions = await client.getCodeActions(documentUri, diagnostic)

    const expected = [
      {
        title: 'Add view modifier to function declaration',
        kind: 'quickfix',
        isPreferred: true,
        edit: {
          changes: {
            [toUri(getProjectPath('hardhat/contracts/codeAction/ConstrainMutabilityView.hyp'))]: [
              {
                range: {
                  start: {
                    line: 6,
                    character: 32,
                  },
                  end: {
                    line: 6,
                    character: 32,
                  },
                },
                newText: 'view ',
              },
            ],
          },
        },
      },
    ]

    expect(codeActions).to.have.deep.members(expected)
  })

  test('constrain mutability - pure', async () => {
    const documentPath = getProjectPath('hardhat/contracts/codeAction/ConstrainMutabilityPure.hyp')
    const documentUri = toUri(documentPath)

    await client.openDocument(documentPath)

    const diagnostic = await client.getDiagnostic(documentPath, {
      range: makeRange(4, 11, 4, 18),
    })

    const codeActions = await client.getCodeActions(documentUri, diagnostic)

    const expected = [
      {
        title: 'Add pure modifier to function declaration',
        kind: 'quickfix',
        isPreferred: true,
        edit: {
          changes: {
            [toUri(getProjectPath('hardhat/contracts/codeAction/ConstrainMutabilityPure.hyp'))]: [
              {
                range: {
                  start: {
                    line: 4,
                    character: 29,
                  },
                  end: {
                    line: 4,
                    character: 29,
                  },
                },
                newText: 'pure ',
              },
            ],
          },
        },
      },
    ]

    expect(codeActions).to.have.deep.members(expected)
  })

  test('constrain mutability - modify to pure', async () => {
    const documentPath = getProjectPath('hardhat/contracts/codeAction/ConstrainMutabilityModifyToPure.hyp')
    const documentUri = toUri(documentPath)

    await client.openDocument(documentPath)

    const diagnostic = await client.getDiagnostic(documentPath, {
      range: makeRange(4, 11, 4, 21),
    })

    const codeActions = await client.getCodeActions(documentUri, diagnostic)

    const expected = [
      {
        title: 'Change view modifier to pure in function declaration',
        kind: 'quickfix',
        isPreferred: true,
        edit: {
          changes: {
            [toUri(getProjectPath('hardhat/contracts/codeAction/ConstrainMutabilityModifyToPure.hyp'))]: [
              {
                range: {
                  start: {
                    line: 4,
                    character: 32,
                  },
                  end: {
                    line: 4,
                    character: 36,
                  },
                },
                newText: 'pure',
              },
            ],
          },
        },
      },
    ]

    expect(codeActions).to.have.deep.members(expected)
  })

  test('mark contract as abstract or implement interface', async () => {
    const documentPath = getProjectPath('hardhat/contracts/codeAction/MarkAbstract.hyp')
    const documentUri = toUri(documentPath)

    await client.openDocument(documentPath)

    const diagnostic = await client.getDiagnostic(documentPath, {
      range: makeRange(7, 9, 7, 16),
    })

    const codeActions = await client.getCodeActions(documentUri, diagnostic)

    const expected = [
      {
        title: 'Add missing functions from interfaces',
        kind: 'quickfix',
        isPreferred: false,
        edit: {
          changes: {
            [toUri(getProjectPath('hardhat/contracts/codeAction/MarkAbstract.hyp'))]: [
              {
                range: {
                  start: {
                    line: 7,
                    character: 0,
                  },
                  end: {
                    line: 7,
                    character: 31,
                  },
                },
                newText: 'contract Counter is ICounter {\n  function increment() external pure override {}\n}',
              },
            ],
          },
        },
      },
      {
        title: 'Add abstract to contract declaration',
        kind: 'quickfix',
        isPreferred: false,
        edit: {
          changes: {
            [toUri(getProjectPath('hardhat/contracts/codeAction/MarkAbstract.hyp'))]: [
              {
                range: {
                  start: {
                    line: 7,
                    character: 0,
                  },
                  end: {
                    line: 7,
                    character: 0,
                  },
                },
                newText: 'abstract ',
              },
            ],
          },
        },
      },
    ]

    expect(codeActions).to.have.deep.members(expected)
  })

  test('specify data location', async () => {
    const documentPath = getProjectPath('hardhat/contracts/codeAction/SpecifyDataLocation.hyp')
    const documentUri = toUri(documentPath)

    await client.openDocument(documentPath)

    let diagnostic = await client.getDiagnostic(documentPath, {
      range: makeRange(5, 14, 5, 26),
    })

    let codeActions = await client.getCodeActions(documentUri, diagnostic)

    let expected = [
      {
        title: "Specify 'memory' as data location",
        kind: 'quickfix',
        isPreferred: false,
        edit: {
          changes: {
            [toUri(getProjectPath('hardhat/contracts/codeAction/SpecifyDataLocation.hyp'))]: [
              {
                range: {
                  start: {
                    line: 5,
                    character: 14,
                  },
                  end: {
                    line: 5,
                    character: 26,
                  },
                },
                newText: 'uint256[] memory p1',
              },
            ],
          },
        },
      },
      {
        title: "Specify 'storage' as data location",
        kind: 'quickfix',
        isPreferred: false,
        edit: {
          changes: {
            [toUri(getProjectPath('hardhat/contracts/codeAction/SpecifyDataLocation.hyp'))]: [
              {
                range: {
                  start: {
                    line: 5,
                    character: 14,
                  },
                  end: {
                    line: 5,
                    character: 26,
                  },
                },
                newText: 'uint256[] storage p1',
              },
            ],
          },
        },
      },
    ]

    expect(codeActions).to.have.deep.members(expected)

    diagnostic = await client.getDiagnostic(documentPath, {
      range: makeRange(5, 28, 5, 46),
    })

    codeActions = await client.getCodeActions(documentUri, diagnostic)

    expected = [
      {
        title: "Specify 'memory' as data location",
        kind: 'quickfix',
        isPreferred: false,
        edit: {
          changes: {
            [toUri(getProjectPath('hardhat/contracts/codeAction/SpecifyDataLocation.hyp'))]: [
              {
                range: {
                  start: {
                    line: 5,
                    character: 28,
                  },
                  end: {
                    line: 5,
                    character: 46,
                  },
                },
                newText: 'string memory p2',
              },
            ],
          },
        },
      },
      {
        title: "Specify 'storage' as data location",
        kind: 'quickfix',
        isPreferred: false,
        edit: {
          changes: {
            [toUri(getProjectPath('hardhat/contracts/codeAction/SpecifyDataLocation.hyp'))]: [
              {
                range: {
                  start: {
                    line: 5,
                    character: 28,
                  },
                  end: {
                    line: 5,
                    character: 46,
                  },
                },
                newText: 'string storage p2',
              },
            ],
          },
        },
      },
    ]

    expect(codeActions).to.have.deep.members(expected)

    diagnostic = await client.getDiagnostic(documentPath, {
      range: makeRange(8, 15, 8, 35),
    })

    codeActions = await client.getCodeActions(documentUri, diagnostic)

    expected = [
      {
        title: "Specify 'memory' as data location",
        kind: 'quickfix',
        isPreferred: false,
        edit: {
          changes: {
            [toUri(getProjectPath('hardhat/contracts/codeAction/SpecifyDataLocation.hyp'))]: [
              {
                range: {
                  start: {
                    line: 8,
                    character: 15,
                  },
                  end: {
                    line: 8,
                    character: 35,
                  },
                },
                newText: 'uint256[] memory p3',
              },
            ],
          },
        },
      },
      {
        title: "Specify 'calldata' as data location",
        kind: 'quickfix',
        isPreferred: false,
        edit: {
          changes: {
            [toUri(getProjectPath('hardhat/contracts/codeAction/SpecifyDataLocation.hyp'))]: [
              {
                range: {
                  start: {
                    line: 8,
                    character: 15,
                  },
                  end: {
                    line: 8,
                    character: 35,
                  },
                },
                newText: 'uint256[] calldata p3',
              },
            ],
          },
        },
      },
    ]

    expect(codeActions).to.have.deep.members(expected)

    diagnostic = await client.getDiagnostic(documentPath, {
      range: makeRange(8, 37, 8, 46),
    })

    codeActions = await client.getCodeActions(documentUri, diagnostic)

    expected = [
      {
        title: "Specify 'memory' as data location",
        kind: 'quickfix',
        isPreferred: false,
        edit: {
          changes: {
            [toUri(getProjectPath('hardhat/contracts/codeAction/SpecifyDataLocation.hyp'))]: [
              {
                range: {
                  start: {
                    line: 8,
                    character: 37,
                  },
                  end: {
                    line: 8,
                    character: 46,
                  },
                },
                newText: 'string memory p4',
              },
            ],
          },
        },
      },
      {
        title: "Specify 'calldata' as data location",
        kind: 'quickfix',
        isPreferred: false,
        edit: {
          changes: {
            [toUri(getProjectPath('hardhat/contracts/codeAction/SpecifyDataLocation.hyp'))]: [
              {
                range: {
                  start: {
                    line: 8,
                    character: 37,
                  },
                  end: {
                    line: 8,
                    character: 46,
                  },
                },
                newText: 'string calldata p4',
              },
            ],
          },
        },
      },
    ]

    expect(codeActions).to.have.deep.members(expected)

    diagnostic = await client.getDiagnostic(documentPath, {
      range: makeRange(10, 13, 10, 18),
    })

    codeActions = await client.getCodeActions(documentUri, diagnostic)

    expected = [
      {
        title: "Specify 'memory' as data location",
        kind: 'quickfix',
        isPreferred: false,
        edit: {
          changes: {
            [toUri(getProjectPath('hardhat/contracts/codeAction/SpecifyDataLocation.hyp'))]: [
              {
                range: {
                  start: {
                    line: 10,
                    character: 13,
                  },
                  end: {
                    line: 10,
                    character: 18,
                  },
                },
                newText: 'bytes memory',
              },
            ],
          },
        },
      },
      {
        title: "Specify 'calldata' as data location",
        kind: 'quickfix',
        isPreferred: false,
        edit: {
          changes: {
            [toUri(getProjectPath('hardhat/contracts/codeAction/SpecifyDataLocation.hyp'))]: [
              {
                range: {
                  start: {
                    line: 10,
                    character: 13,
                  },
                  end: {
                    line: 10,
                    character: 18,
                  },
                },
                newText: 'bytes calldata',
              },
            ],
          },
        },
      },
    ]

    expect(codeActions).to.have.deep.members(expected)

    diagnostic = await client.getDiagnostic(documentPath, {
      range: makeRange(10, 20, 10, 34),
    })

    codeActions = await client.getCodeActions(documentUri, diagnostic)

    expected = [
      {
        title: "Specify 'memory' as data location",
        kind: 'quickfix',
        isPreferred: false,
        edit: {
          changes: {
            [toUri(getProjectPath('hardhat/contracts/codeAction/SpecifyDataLocation.hyp'))]: [
              {
                range: {
                  start: {
                    line: 10,
                    character: 20,
                  },
                  end: {
                    line: 10,
                    character: 34,
                  },
                },
                newText: 'string memory ',
              },
            ],
          },
        },
      },
      {
        title: "Specify 'calldata' as data location",
        kind: 'quickfix',
        isPreferred: false,
        edit: {
          changes: {
            [toUri(getProjectPath('hardhat/contracts/codeAction/SpecifyDataLocation.hyp'))]: [
              {
                range: {
                  start: {
                    line: 10,
                    character: 20,
                  },
                  end: {
                    line: 10,
                    character: 34,
                  },
                },
                newText: 'string calldata ',
              },
            ],
          },
        },
      },
    ]

    expect(codeActions).to.have.deep.members(expected)

    diagnostic = await client.getDiagnostic(documentPath, {
      range: makeRange(13, 4, 13, 29),
    })

    codeActions = await client.getCodeActions(documentUri, diagnostic)

    expected = [
      {
        title: 'Remove specified data location',
        kind: 'quickfix',
        isPreferred: false,
        edit: {
          changes: {
            [toUri(getProjectPath('hardhat/contracts/codeAction/SpecifyDataLocation.hyp'))]: [
              {
                range: {
                  start: {
                    line: 13,
                    character: 4,
                  },
                  end: {
                    line: 13,
                    character: 29,
                  },
                },
                newText: 'uint256 singleUint',
              },
            ],
          },
        },
      },
    ]

    expect(codeActions).to.have.deep.members(expected)
  })

  test('specify visibility', async () => {
    const documentPath = getProjectPath('hardhat/contracts/codeAction/SpecifyVisibility.hyp')
    const documentUri = toUri(documentPath)

    await client.openDocument(documentPath)

    const diagnostic = await client.getDiagnostic(documentPath, {
      range: makeRange(4, 11, 4, 14),
    })

    const codeActions = await client.getCodeActions(documentUri, diagnostic)

    const expected = [
      {
        title: 'Add public visibility to function declaration',
        kind: 'quickfix',
        isPreferred: false,
        edit: {
          changes: {
            [toUri(getProjectPath('hardhat/contracts/codeAction/SpecifyVisibility.hyp'))]: [
              {
                range: {
                  start: {
                    line: 4,
                    character: 16,
                  },
                  end: {
                    line: 4,
                    character: 16,
                  },
                },
                newText: ' public',
              },
            ],
          },
        },
      },
      {
        title: 'Add private visibility to function declaration',
        kind: 'quickfix',
        isPreferred: false,
        edit: {
          changes: {
            [toUri(getProjectPath('hardhat/contracts/codeAction/SpecifyVisibility.hyp'))]: [
              {
                range: {
                  start: {
                    line: 4,
                    character: 16,
                  },
                  end: {
                    line: 4,
                    character: 16,
                  },
                },
                newText: ' private',
              },
            ],
          },
        },
      },
    ]

    expect(codeActions).to.have.deep.members(expected)
  })

  test('auto import console.hyp', async () => {
    const documentPath = getProjectPath('hardhat/contracts/codeAction/ImportConsole.hyp')
    const documentUri = toUri(documentPath)

    await client.openDocument(documentPath)

    const diagnostic = await client.getDiagnostic(documentPath, {
      range: makeRange(5, 4, 5, 11),
    })

    const codeActions = await client.getCodeActions(documentUri, diagnostic)

    const expected = [
      {
        title: "Add import from '@theqrl/hardhat'",
        kind: 'quickfix',
        isPreferred: true,
        edit: {
          changes: {
            [toUri(documentPath)]: [
              {
                range: {
                  start: {
                    character: 0,
                    line: 3,
                  },
                  end: {
                    character: 0,
                    line: 3,
                  },
                },
                newText: 'import "@theqrl/hardhat/console.hyp";\n\n',
              },
            ],
          },
        },
      },
    ]

    expect(codeActions).to.have.deep.members(expected)
  })
})
