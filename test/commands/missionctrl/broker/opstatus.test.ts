import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import * as sinon from 'sinon'

import { camelCaseToTitleCase, renderKeyValueTable } from '../../../../src/util/internal.js'
import { ScConnection } from '../../../../src/util/sc-connection.js'
import { createTestOperationResponse, setEnvVariables } from '../../../util/test-utils.js'

describe('missionctrl:broker:opstatus', () => {
  setEnvVariables()
  const brokerName: string = 'MyTestBroker'
  const brokerId: string = 'MyTestBrokerId'
  const operationId: string = 'MyOperationId'
  let scConnStub: sinon.SinonStub

  beforeEach(() => {
    scConnStub = sinon.stub(ScConnection.prototype, 'get')
  })

  afterEach(() => {
    scConnStub.restore()
  })

  it('runs missionctrl:broker:opstatus cmd', async () => {
    const { stdout } = await runCommand('missionctrl:broker:opstatus')
    expect(stdout).to.contain('')
  })

  it(`runs missionctrl:broker:opstatus -b ${brokerId}`, async () => {
    // Arrange
    let opsResponse = createTestOperationResponse(brokerId, 5, operationId, 'in-progress')
    scConnStub.returns(Promise.resolve(opsResponse))

    const tableRows = [
      ['Key', 'Value'],
      ...Object.entries(opsResponse.data).map(([key, value]) => [camelCaseToTitleCase(key), value]),
    ]

    const { stdout } = await runCommand(`missionctrl:broker:opstatus -b ${brokerId}`)
    expect(stdout).to.contain(renderKeyValueTable(tableRows))
  })
})
