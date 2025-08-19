import {runCommand} from '@oclif/test'
import {expect} from 'chai'
import * as sinon from 'sinon'

import {Environment, EnvironmentApiResponse, EnvironmentDetail} from '../../../../src/types/environment'
import {camelCaseToTitleCase, renderKeyValueTable} from '../../../../src/util/internal'
import {ScConnection} from '../../../../src/util/sc-connection'
import {anEnv, setEnvVariables} from '../../../util/test-utils'

describe('platform:env:update', () => {
  setEnvVariables()
  let scConnUpdateStub: sinon.SinonStub
  let scConnGetStub: sinon.SinonStub
  const envName: string = 'MyTestEnvironment'
  const envNewName: string = 'MyNewTestEnvironment'
  const envDescription: string = 'This is an environment description.'

  beforeEach(() => {
    scConnUpdateStub = sinon.stub(ScConnection.prototype, 'put')
    scConnGetStub = sinon.stub(ScConnection.prototype, 'get')
  })

  afterEach(() => {
    scConnUpdateStub.restore()
    scConnGetStub.restore()
  })

  it('runs platform:env:update cmd', async () => {
    const {stdout} = await runCommand('platform:env:update')
    expect(stdout).to.contain('')
  })

  it(`runs platform:env:update --name=${envName} --new-name=${envNewName}`, async () => {
    // Arrange
    const expectBody = {
      name: envNewName,
    }
    const expectEnv: Environment = anEnv(envNewName, false, false) // Environment with new name
    const expectResponse: EnvironmentDetail = {
      data: expectEnv,
    }
    const expectEnvApiResponse: EnvironmentApiResponse = {
      data: [anEnv(envName, false, false)],
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

    scConnGetStub.returns(Promise.resolve(expectEnvApiResponse))
    scConnUpdateStub.returns(Promise.resolve(expectResponse))

    const tableRows = [
      ['Key', 'Value'],
      ...Object.entries(expectResponse.data).map(([key, value]) => [camelCaseToTitleCase(key), value]),
    ]

    // Act
    const {stdout} = await runCommand(`platform:env:update --name=${envName} --new-name=${envNewName}`)

    // Assert
    expect(scConnGetStub.getCall(0).args[0]).to.contain(`?name=${envName}`)
    expect(scConnUpdateStub.getCall(0).calledWith(`/platform/environments/id${envName}`, expectBody)).to.be.true
    expect(stdout).to.contain(renderKeyValueTable(tableRows))
  })

  it(`runs platform:env:update --env-id=id${envName} --isDefault`, async () => {
    // Arrange
    const expectBody = {
      isDefault: true,
    }
    const expectEnv: Environment = anEnv(envName, true, false)
    const expectResponse: EnvironmentDetail = {
      data: expectEnv,
    }

    scConnUpdateStub.returns(Promise.resolve(expectResponse))

    const tableRows = [
      ['Key', 'Value'],
      ...Object.entries(expectResponse.data).map(([key, value]) => [camelCaseToTitleCase(key), value]),
    ]

    // Act
    const {stdout} = await runCommand(`platform:env:update --env-id=id${envName} --isDefault`)

    // Assert
    expect(scConnUpdateStub.getCall(0).calledWith(`/platform/environments/id${envName}`, expectBody)).to.be.true
    expect(stdout).to.contain(renderKeyValueTable(tableRows))
  })

  it(`runs platform:env:update --env-id=id${envName} --description="${envDescription}"`, async () => {
    // Arrange
    const expectBody = {
      description: envDescription,
    }
    const expectEnv: Environment = anEnv(envName, false, false)
    expectEnv.description = envDescription
    const expectResponse: EnvironmentDetail = {
      data: expectEnv,
    }

    scConnUpdateStub.returns(Promise.resolve(expectResponse))

    const tableRows = [
      ['Key', 'Value'],
      ...Object.entries(expectResponse.data).map(([key, value]) => [camelCaseToTitleCase(key), value]),
    ]

    // Act
    const {stdout} = await runCommand(`platform:env:update --env-id=id${envName} --description="${envDescription}"`)

    // Assert
    expect(scConnUpdateStub.getCall(0).calledWith(`/platform/environments/id${envName}`, expectBody)).to.be.true
    expect(stdout).to.contain(renderKeyValueTable(tableRows))
  })
})
