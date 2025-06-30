import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import * as sinon from 'sinon'

import { ScConnection } from '../../../../src/util/sc-connection.js'

describe('missionctrl:broker:delete', () => {
  let scConnDeleteStub: any
  let scConnGetStub: any
  let brokerId: string = 'MyTestBrokerId'
  //let brokerName: string = 'MyTestBrokerName'

  beforeEach(() => {
    scConnDeleteStub = sinon.stub(ScConnection.prototype, <any>'delete');
    scConnGetStub = sinon.stub(ScConnection.prototype, <any>'get');
  });

  afterEach(() => {
    scConnDeleteStub.restore();
    scConnGetStub.restore();
  })

  it('runs missionctrl:broker:delete cmd', async () => {
    const { stdout } = await runCommand('missionctrl:broker:delete')
    expect(stdout).to.contain('')
  })

  it(`runs missionctrl:broker:delete -b ${brokerId}`, async () => {
    let deleteSuccessMsg = `Event broker service with id '${brokerId}' has been deleted successfully.`
    scConnDeleteStub.returns(deleteSuccessMsg)

    const { stdout } = await runCommand(`missionctrl:broker:delete -b ${brokerId}`)
    expect(stdout).to.contain(deleteSuccessMsg)
  })
})
