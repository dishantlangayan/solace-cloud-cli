import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('missionctrl:broker:list', () => {
  it('runs missionctrl:broker:list cmd', async () => {
    const {stdout} = await runCommand('missionctrl:broker:list')
    expect(stdout).to.contain('hello world')
  })

  it('runs missionctrl:broker:list --name oclif', async () => {
    const {stdout} = await runCommand('missionctrl:broker:list --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
