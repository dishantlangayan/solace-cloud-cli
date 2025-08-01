import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import * as sinon from 'sinon'

import { ScConnection } from '../../../../src/util/sc-connection'
import { setEnvVariables } from '../../../util/test-utils'

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
    const { stdout } = await runCommand('platform:env:create')
    expect(stdout).to.contain('')
  })

  it(`runs platform:env:create  --name=${envName}`, async () => {
    const createOutputMsg = 'Environment created successfully.'
    scConnStub.returns(createOutputMsg)

    const { stdout } = await runCommand(`platform:env:create --name=${envName}`)
    expect(stdout).to.contain(createOutputMsg)
  })
})
