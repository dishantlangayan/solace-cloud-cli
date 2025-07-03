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

describe('missionctrl:broker:create', () => {
  let scConnPostStub: sinon.SinonStub
  let scConnGetStub: sinon.SinonStub
  const envName: string = 'MyTestEnvironment'
  const brokerName: string = 'MyEventBrokerName'
  const brokerDC: string = 'eks-ca-central-1a'
  const brokerSvcClassId: string = 'DEVELOPER'

  beforeEach(() => {
    scConnPostStub = sinon.stub(ScConnection.prototype, 'post')
    scConnGetStub = sinon.stub(ScConnection.prototype, 'get')
  })

  afterEach(() => {
    scConnPostStub.restore()
    scConnGetStub.restore()
  })

  it('runs missionctrl:broker:create cmd', async () => {
    const { stdout } = await runCommand('missionctrl:broker:create')
    expect(stdout).to.contain('')
  })

  it(`runs missionctrl:broker:create -n ${brokerName} -d ${brokerDC} -c ${brokerSvcClassId}`, async () => {
    const createOutputMsg = 'Event broker service created successfully.'
    scConnPostStub.returns(createOutputMsg)

    const { stdout } = await runCommand(`missionctrl:broker:create -n ${brokerName} -d ${brokerDC} -c ${brokerSvcClassId}`)
    expect(stdout).to.contain(createOutputMsg)
  })

  it(`runs missionctrl:broker:create -e ${envName} -n ${brokerName} -d ${brokerDC} -c ${brokerSvcClassId}`, async () => {
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
    scConnGetStub.returns(Promise.resolve(envs))

    const createOutputMsg = 'Event broker service created successfully.'
    scConnPostStub.returns(createOutputMsg)

    const { stdout } = await runCommand(`missionctrl:broker:create -e ${envName} -n ${brokerName} -d ${brokerDC} -c ${brokerSvcClassId}`)
    expect(stdout).to.contain(createOutputMsg)
  })
})
