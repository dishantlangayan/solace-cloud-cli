import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import * as sinon from 'sinon'

import { ScConnection } from '../../../../src/util/sc-connection.js'

describe('platform:env:create', () => {
  let scConnStub: any
  let envName: string = 'MyTestEnvironment'

  beforeEach(() => {
    scConnStub = sinon.stub(ScConnection.prototype, <any>'post');
  });

  afterEach(() => {
    scConnStub.restore();
  })

  it('runs platform:env:create', async () => {
    const { stdout } = await runCommand('platform:env:create')
    expect(stdout).to.contain('')
  })

  it(`runs platform:env:create  --name=${envName}`, async () => {
    let createOutputMsg = 'Environment created successfully.'
    scConnStub.returns(createOutputMsg)

    const { stdout } = await runCommand(`platform:env:create --name=${envName}`)
    expect(stdout).to.contain(createOutputMsg)
  })
})
