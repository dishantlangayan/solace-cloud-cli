import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('platform:env:display', () => {
  it('runs platform:env:display cmd', async () => {
    const {stdout} = await runCommand('platform:env:display')
    expect(stdout).to.contain('hello world')
  })

  it('runs platform:env:display --name oclif', async () => {
    const {stdout} = await runCommand('platform:env:display --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
