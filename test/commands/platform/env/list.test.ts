import {runCommand} from '@oclif/test'
import {expect} from 'chai'
import * as sinon from 'sinon'

import {Environment} from '../../../../src/types/environment'
import {renderTable} from '../../../../src/util/internal'
import {ScConnection} from '../../../../src/util/sc-connection'
import {anEnv, setEnvVariables} from '../../../util/test-utils'

describe('platform:env:list', () => {
  setEnvVariables()

  const defaultPageSize = 10
  const defaultPageNumber = 1

  let scConnStub: sinon.SinonStub

  beforeEach(() => {
    scConnStub = sinon.stub(ScConnection.prototype, 'get')
  })

  afterEach(() => {
    scConnStub.restore()
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
          totalPages: 1,
        },
      },
    }
    scConnStub.returns(Promise.resolve(envs))

    // Expected
    const envArray = [
      ['Name', 'Id', 'Is Default', 'Is Production', 'Description'],
      ...envs.data.map((item: Environment) => [
        item.name,
        item.id,
        item.isDefault,
        item.isProduction,
        item.description,
      ]),
    ]

    // Act
    const {stdout} = await runCommand('platform:env:list')

    // Assert
    expect(scConnStub.getCall(0).args[0]).to.contain(`?pageSize=${defaultPageSize}&pageNumber=${defaultPageNumber}`)
    expect(stdout).to.contain(renderTable(envArray, {4: {width: 50, wrapWord: true}}))
  })

  it('runs platform:env:list --pageSize=5 --pageNumber=1', async () => {
    // Arrange
    const pageSize = 5
    const pageNumber = 1
    const envs = {
      data: [anEnv('Default', true, false), anEnv('Dev', false, false), anEnv('Prod', false, true)],
      meta: {
        pagination: {
          count: 3,
          nextPage: null,
          pageNumber: 1,
          pageSize: 5,
          totalPages: 1,
        },
      },
    }
    scConnStub.returns(Promise.resolve(envs))

    // Expected
    const envArray = [
      ['Name', 'Id', 'Is Default', 'Is Production', 'Description'],
      ...envs.data.map((item: Environment) => [
        item.name,
        item.id,
        item.isDefault,
        item.isProduction,
        item.description,
      ]),
    ]

    // Act
    const {stdout} = await runCommand(`platform:env:list --pageSize=${pageSize} --pageNumber=${pageNumber}`)

    // Assert
    expect(scConnStub.getCall(0).args[0]).to.contain(`?pageSize=${pageSize}&pageNumber=${pageNumber}`)
    expect(stdout).to.contain(renderTable(envArray, {4: {width: 50, wrapWord: true}}))
  })
})
