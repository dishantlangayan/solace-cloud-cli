import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('missionctrl:broker:display', () => {
  it('runs missionctrl:broker:display cmd', async () => {
    const {stdout} = await runCommand('missionctrl:broker:display')
    expect(stdout).to.contain('hello world')
  })

  it('runs missionctrl:broker:display --name oclif', async () => {
    const {stdout} = await runCommand('missionctrl:broker:display --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
