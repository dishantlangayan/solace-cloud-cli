import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('platform:env:list', () => {
  it('runs platform:env:list cmd', async () => {
    const {stdout} = await runCommand('platform:env:list')
    expect(stdout).to.contain('hello world')
  })

  it('runs platform:env:list --name oclif', async () => {
    const {stdout} = await runCommand('platform:env:list --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
