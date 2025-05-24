import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('platform:env:delete', () => {
  it('runs platform:env:delete cmd', async () => {
    const {stdout} = await runCommand('platform:env:delete')
    expect(stdout).to.contain('hello world')
  })

  it('runs platform:env:delete --name oclif', async () => {
    const {stdout} = await runCommand('platform:env:delete --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
