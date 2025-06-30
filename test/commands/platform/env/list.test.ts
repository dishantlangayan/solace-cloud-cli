import { runCommand } from '@oclif/test'
import { expect } from 'chai'
import * as sinon from 'sinon'
import { table } from 'table'

import { ScConnection } from '../../../../src/util/sc-connection'

function anEnv(name: string, isDefault: boolean, isProd: boolean) {
  return {
    createdBy: 'someuser',
    createdTime: '2024-09-05T19:54:42.766',
    description: `This is a description for the the environment ${name}`,
    id: `id${name}`,
    isDefault,
    isProduction: isProd,
    name,
    updateddBy: 'someuser',
    updatedTime: '2024-09-05T19:54:42.766',
  }
}

describe('platform:env:list', () => {
  let scConnStub: any

  beforeEach(() => {
    scConnStub = sinon.stub(ScConnection.prototype, <any>'get');
  });

  afterEach(() => {
    scConnStub.restore();
  })

  it('runs platform:env:list', async () => {
    // Arrange
    const envs = {
      data: [anEnv('Default', true, false), anEnv('Dev', false, false), anEnv('Prod', false, true)],
      meta: {
        pagination: {
          count: 3,
          nextPage: null,
          pageNumber: 1,
          pageSize: 10,
          totalPages: 1
        }
      }
    }
    scConnStub.returns(Promise.resolve(envs))

    // Expected
    const envArray = [
      ['Name', 'Id', 'Is Default', 'Is Production', 'Description'],
      ...envs.data.map((item: any) => [
        item.name,
        item.id,
        item.isDefault,
        item.isProduction,
        item.description]),
    ]

    const config = {
      columns: {
        4: { width: 50, wrapWord: true }
      }
    }
    // Run command
    const { stdout } = await runCommand('platform:env:list')
    expect(stdout).to.contain(table(envArray, config))
  })

  it('runs platform:env:list --pageSize=5 --pageNumber=1', async () => {
    // Arrange
    const envs = {
      data: [anEnv('Default', true, false), anEnv('Dev', false, false), anEnv('Prod', false, true)],
      meta: {
        pagination: {
          count: 3,
          nextPage: null,
          pageNumber: 1,
          pageSize: 5,
          totalPages: 1
        }
      }
    }
    scConnStub.returns(Promise.resolve(envs))

    // Expected
    const envArray = [
      ['Name', 'Id', 'Is Default', 'Is Production', 'Description'],
      ...envs.data.map((item: any) => [
        item.name,
        item.id,
        item.isDefault,
        item.isProduction,
        item.description]),
    ]

    const config = {
      columns: {
        4: { width: 50, wrapWord: true }
      }
    }

    // Run command
    const { stdout } = await runCommand('platform:env:list --pageSize=5', '--pageNumber=1')
    expect(stdout).to.contain(table(envArray, config))
  })
})
