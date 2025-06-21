import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import * as sinon from 'sinon'

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

describe('platform:env:delete', () => {
  let scConnDeleteStub: any
  let scConnGetStub: any
  let envName: string = 'MyTestEnvironment'

  beforeEach(() => {
    scConnDeleteStub = sinon.stub(ScConnection.prototype, <any>'delete');
    scConnGetStub = sinon.stub(ScConnection.prototype, <any>'get');
  });

  afterEach(() => {
    scConnDeleteStub.restore();
    scConnGetStub.restore();
  })

  it('runs platform:env:delete cmd', async () => {
    const { stdout } = await runCommand('platform:env:delete')
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
          totalPages: 1
        }
      }
    }

    let deleteSuccessMsg = `Environment with id 'id${envName}' has been deleted successfully.`
    scConnGetStub.returns(Promise.resolve(envs))
    scConnDeleteStub.returns(deleteSuccessMsg)

    const { stdout } = await runCommand(`platform:env:delete --name ${envName}`)
    expect(stdout).to.contain(deleteSuccessMsg)
  })

  it(`runs platform:env:delete --env-id id${envName}`, async () => {
    let deleteSuccessMsg = `Environment with id 'id${envName}' has been deleted successfully.`
    scConnDeleteStub.returns(deleteSuccessMsg)

    const { stdout } = await runCommand(`platform:env:delete --env-id id${envName}`)
    expect(stdout).to.contain(deleteSuccessMsg)
  })
})
