import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import * as sinon from 'sinon'
import { table } from 'table'

import { camelCaseToTitleCase } from '../../../../src/util/internal.js'
import { ScConnection } from '../../../../src/util/sc-connection.js'

function anEnv(name: string, isDefault: boolean, isProd: boolean) {
  return {
    bgColor: '#DA162D',
    createdBy: 'someuser',
    createdTime: '2024-09-05T19:54:42.766',
    description: `This is a description for the the environment ${name}`,
    fgColor: '#FFFFFF',
    icon: 'ROCKET_LAUNCH',
    id: `id${name}`,
    isDefault,
    isProduction: isProd,
    name,
    updatedBy: 'someuser',
    updatedTime: '2024-09-05T19:54:42.766',
  }
}

describe('platform:env:display', () => {
  let scConnStub: sinon.SinonStub

  beforeEach(() => {
    scConnStub = sinon.stub(ScConnection.prototype, 'get')
  })

  afterEach(() => {
    scConnStub.restore()
  })

  it('runs platform:env:display', async () => {
    const { stdout } = await runCommand('platform:env:display')
    expect(stdout).to.contain('')
  })

  it('runs platform:env:display --name=Default', async () => {
    // Arrange
    const envName = 'Default'
    const envs = {
      data: [anEnv(envName, true, false)],
      meta: {
        pagination: {
          count: 1,
          nextPage: null,
          pageNumber: 1,
          pageSize: 10,
          totalPages: 1
        }
      }
    }
    scConnStub.returns(Promise.resolve(envs))

    const tableRows = [
      ['Key', 'Value'],
      ...Object.entries(envs.data[0]).map(([key, value]) => [camelCaseToTitleCase(key), value]),
    ]

    const config = {
      columns: {
        1: { width: 50, wrapWord: true }
      },
      drawHorizontalLine(lineIndex: number, rowCount: number) {
        return lineIndex === 0 || lineIndex === 1 || lineIndex === rowCount;
      }
    }

    const { stdout } = await runCommand(`platform:env:display --name=${envName}`)
    expect(stdout).to.contain(table(tableRows, config))
  })
})
