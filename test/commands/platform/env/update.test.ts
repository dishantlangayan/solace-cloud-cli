import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import * as sinon from 'sinon'

import { ScConnection } from '../../../../src/util/sc-connection'
import { anEnv, setEnvVariables } from '../../../util/test-utils'

describe('platform:env:update', () => {
  setEnvVariables()
  let scConnUpdateStub: sinon.SinonStub
  let scConnGetStub: sinon.SinonStub
  const envName: string = 'MyTestEnvironment'

  beforeEach(() => {
    scConnUpdateStub = sinon.stub(ScConnection.prototype, 'put')
    scConnGetStub = sinon.stub(ScConnection.prototype, 'get')
  })

  afterEach(() => {
    scConnUpdateStub.restore()
    scConnGetStub.restore()
  })

  it('runs platform:env:update cmd', async () => {
    const { stdout } = await runCommand('platform:env:update')
    expect(stdout).to.contain('')
  })

  it(`runs platform:env:update --name ${envName} --new-name New${envName}`, async () => {
    // Arrange
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

    const updateSuccessMsg = `Environment with id 'id${envName}' has been updated successfully.`
    scConnGetStub.returns(Promise.resolve(envs))
    scConnUpdateStub.returns(updateSuccessMsg)

    const { stdout } = await runCommand(`platform:env:update --name ${envName} --new-name New${envName}`)
    expect(stdout).to.contain(updateSuccessMsg)
  })

  it(`runs platform:env:update --env-id id${envName} --desc "This is a test description."`, async () => {
    const updateSuccessMsg = `Environment with id 'id${envName}' has been updated successfully.`
    scConnUpdateStub.returns(updateSuccessMsg)

    const { stdout } = await runCommand(`platform:env:update --env-id id${envName} --desc "This is a test description."`)
    expect(stdout).to.contain(updateSuccessMsg)
  })
})
