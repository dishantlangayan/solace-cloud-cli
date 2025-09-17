import {runCommand} from '@oclif/test'
import {expect} from 'chai'
import * as sinon from 'sinon'

import {EnvironmentApiResponse, EnvironmentListApiResponse} from '../../../../src/types/environment'
import {printObjectAsKeyValueTable} from '../../../../src/util/internal'
import {ScConnection} from '../../../../src/util/sc-connection'
import {anEnv, setEnvVariables} from '../../../util/test-utils'

describe('platform:env:display', () => {
  setEnvVariables()
  const envName = 'MyTestEnvironment'
  const envId = 'MyTestEnvironmentId'
  let scConnStub: sinon.SinonStub

  beforeEach(() => {
    scConnStub = sinon.stub(ScConnection.prototype, 'get')
  })

  afterEach(() => {
    scConnStub.restore()
  })

  it('runs platform:env:display', async () => {
    const {stdout} = await runCommand('platform:env:display')
    expect(stdout).to.contain('')
  })

  it(`runs platform:env:display --name=${envName}`, async () => {
    // Arrange
    const envs: EnvironmentListApiResponse = {
      data: [anEnv(envName, true, false)],
      meta: {
        pagination: {
          count: 1,
          nextPage: null,
          pageNumber: 1,
          pageSize: 10,
          totalPages: 1,
        },
      },
    }
    scConnStub.returns(Promise.resolve(envs))

    // Act
    const {stdout} = await runCommand(`platform:env:display --name=${envName}`)

    // Assert
    expect(scConnStub.getCall(0).args[0]).to.contain(`?name=${envName}`)
    expect(stdout).to.contain(printObjectAsKeyValueTable(envs.data[0] as unknown as Record<string, unknown>))
  })

  it(`runs platform:env:display --env-id=${envId}`, async () => {
    // Arrange
    const envs: EnvironmentApiResponse = {
      data: anEnv(envName, true, false),
    }
    scConnStub.returns(Promise.resolve(envs))

    // Act
    const {stdout} = await runCommand(`platform:env:display --env-id=${envId}`)

    // Assert
    expect(scConnStub.getCall(0).args[0]).to.contain(`/${envId}`)
    expect(stdout).to.contain(printObjectAsKeyValueTable(envs.data as unknown as Record<string, unknown>))
  })
})
