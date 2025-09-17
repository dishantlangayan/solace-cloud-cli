import {runCommand} from '@oclif/test'
import {expect} from 'chai'
import * as sinon from 'sinon'

import {Environment, EnvironmentApiResponse} from '../../../../src/types/environment.js'
import {printObjectAsKeyValueTable} from '../../../../src/util/internal'
import {ScConnection} from '../../../../src/util/sc-connection'
import {anEnv, setEnvVariables} from '../../../util/test-utils'

describe('platform:env:create', () => {
  setEnvVariables()
  let scConnStub: sinon.SinonStub
  const envName: string = 'MyTestEnvironment'

  beforeEach(() => {
    scConnStub = sinon.stub(ScConnection.prototype, 'post')
  })

  afterEach(() => {
    scConnStub.restore()
  })

  it('runs platform:env:create', async () => {
    const {stdout} = await runCommand('platform:env:create')
    expect(stdout).to.contain('')
  })

  it(`runs platform:env:create --name=${envName}`, async () => {
    // Arrange
    const expectBody = {
      isDefault: false,
      isProduction: false,
      name: envName,
    }
    const expectEnv: Environment = anEnv(envName, false, false)
    const expectResponse: EnvironmentApiResponse = {
      data: expectEnv,
    }
    scConnStub.returns(expectResponse)

    // Act
    const {stdout} = await runCommand(`platform:env:create --name=${envName}`)

    // Assert
    expect(scConnStub.getCall(0).calledWith('/platform/environments', expectBody)).to.be.true
    expect(stdout).to.contain(printObjectAsKeyValueTable(expectResponse.data as unknown as Record<string, unknown>))
  })

  it(`runs platform:env:create --name=${envName} --description="This is an environment description."`, async () => {
    // Arrange
    const expectBody = {
      description: 'This is an environment description.',
      isDefault: false,
      isProduction: false,
      name: envName,
    }
    const expectEnv: Environment = anEnv(envName, false, false)
    const expectResponse: EnvironmentApiResponse = {
      data: expectEnv,
    }
    expectResponse.data.description = expectBody.description
    scConnStub.returns(expectResponse)

    // Act
    const {stdout} = await runCommand(
      `platform:env:create --name=${envName} --description="This is an environment description."`,
    )

    // Assert
    expect(scConnStub.getCall(0).calledWith('/platform/environments', expectBody)).to.be.true
    expect(stdout).to.contain(printObjectAsKeyValueTable(expectResponse.data as unknown as Record<string, unknown>))
  })
})
