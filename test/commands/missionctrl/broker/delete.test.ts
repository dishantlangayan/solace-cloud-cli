import {runCommand} from '@oclif/test'
import {expect} from 'chai'

describe('missionctrl:broker:delete', () => {
  it('runs missionctrl:broker:delete cmd', async () => {
    const {stdout} = await runCommand('missionctrl:broker:delete')
    expect(stdout).to.contain('hello world')
  })

  it('runs missionctrl:broker:delete --name oclif', async () => {
    const {stdout} = await runCommand('missionctrl:broker:delete --name oclif')
    expect(stdout).to.contain('hello oclif')
  })
})
