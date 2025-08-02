import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import * as sinon from 'sinon'

import { ScConnection } from '../../../../src/util/sc-connection.js'
import { anEnv, setEnvVariables } from '../../../util/test-utils'

describe('missionctrl:broker:create', () => {
  setEnvVariables()
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
