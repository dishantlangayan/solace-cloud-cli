import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import * as sinon from 'sinon'

import { camelCaseToTitleCase, renderKeyValueTable } from '../../../../src/util/internal'
import { ScConnection } from '../../../../src/util/sc-connection'
import { anEnv, setEnvVariables } from '../../../util/test-utils'

describe('platform:env:display', () => {
  setEnvVariables()
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

    const { stdout } = await runCommand(`platform:env:display --name=${envName}`)
    expect(stdout).to.contain(renderKeyValueTable(tableRows, { 1: { width: 50, wrapWord: true } }))
  })
})
