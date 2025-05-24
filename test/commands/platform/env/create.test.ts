import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('platform:env:create', () => {
  it('runs platform:env:create cmd', async () => {
    const {stdout} = await runCommand('platform:env:create')
    expect(stdout).to.contain('hello world')
  })

  it('runs platform:env:create --name oclif', async () => {
    const {stdout} = await runCommand('platform:env:create --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
