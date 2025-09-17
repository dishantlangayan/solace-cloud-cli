import {runCommand} from '@oclif/test'
import {expect} from 'chai'
import * as sinon from 'sinon'

import {ScConnection} from '../../../../src/util/sc-connection'
import {anEnv, setEnvVariables} from '../../../util/test-utils'

describe('platform:env:delete', () => {
  setEnvVariables()
  let scConnDeleteStub: sinon.SinonStub
  let scConnGetStub: sinon.SinonStub
  const envName: string = 'MyTestEnvironment'

  beforeEach(() => {
    scConnDeleteStub = sinon.stub(ScConnection.prototype, 'delete')
    scConnGetStub = sinon.stub(ScConnection.prototype, 'get')
  })

  afterEach(() => {
    scConnDeleteStub.restore()
    scConnGetStub.restore()
  })

  it('runs platform:env:delete cmd', async () => {
    const {stdout} = await runCommand('platform:env:delete')
    expect(stdout).to.contain('')
  })

  it(`runs platform:env:delete --name ${envName}`, async () => {
    // Arrange
    const envs = {
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

    const deleteSuccessMsg = `Environment with id 'id${envName}' has been deleted successfully.`
    scConnGetStub.returns(Promise.resolve(envs))
    scConnDeleteStub.returns(deleteSuccessMsg)

    // Act
    const {stdout} = await runCommand(`platform:env:delete --name ${envName}`)

    // Assert
    expect(scConnGetStub.getCall(0).args[0]).to.contain(`?name=${envName}`)
    expect(scConnDeleteStub.getCall(0).calledWith(`/platform/environments/id${envName}`)).to.be.true
    expect(stdout).to.contain(deleteSuccessMsg)
  })

  it(`runs platform:env:delete --env-id id${envName}`, async () => {
    // Arrange
    const deleteSuccessMsg = `Environment with id 'id${envName}' has been deleted successfully.`
    scConnDeleteStub.returns(deleteSuccessMsg)

    // Act
    const {stdout} = await runCommand(`platform:env:delete --env-id id${envName}`)

    // Assert
    expect(scConnDeleteStub.getCall(0).calledWith(`/platform/environments/id${envName}`)).to.be.true
    expect(stdout).to.contain(deleteSuccessMsg)
  })
})
