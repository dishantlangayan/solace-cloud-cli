import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('missionctrl:broker:create', () => {
  it('runs missionctrl:broker:create cmd', async () => {
    const {stdout} = await runCommand('missionctrl:broker:create')
    expect(stdout).to.contain('hello world')
  })

  it('runs missionctrl:broker:create --name oclif', async () => {
    const {stdout} = await runCommand('missionctrl:broker:create --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
