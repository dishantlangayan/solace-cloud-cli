import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('platform:env:update', () => {
  it('runs platform:env:update cmd', async () => {
    const {stdout} = await runCommand('platform:env:update')
    expect(stdout).to.contain('hello world')
  })

  it('runs platform:env:update --name oclif', async () => {
    const {stdout} = await runCommand('platform:env:update --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
