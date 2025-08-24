import {table} from 'table'

/**
 * Formats a camel case style `string` into a title case.
 *
 * @param text Text to transform.
 */
export function camelCaseToTitleCase(text: string): string {
  return text
    .replaceAll(/(^\w|\s\w)/g, (m) => m.toUpperCase())
    .replaceAll(/([A-Z][a-z]+)/g, ' $1')
    .replaceAll(/\s{2,}/g, ' ')
    .trim()
}

export interface ColumnConfig {
  width?: number
  wrapWord?: boolean
}

/**
 * Prints object data in a formatted key-value table.
 * @param data The object data to print
 * @returns Formatted table string
 */
export function printObjectAsKeyValueTable<T extends Record<string, unknown>>(data: T): string {
  const tableRows = [
    ['Key', 'Value'],
    ...Object.entries(data).map(([key, value]) => [camelCaseToTitleCase(key), value]),
  ]
  return renderKeyValueTable(tableRows)
}

export function renderTable<T>(data: T[][], columnConfig?: Record<number, ColumnConfig>): string {
  // Table config
  const tableConfig = {
    columns: columnConfig,
  }
  const tableStr = table(data, tableConfig)
  return tableStr
}

export function renderKeyValueTable<T>(data: T[][], columnConfig?: Record<number, ColumnConfig>): string {
  if (columnConfig === undefined) {
    columnConfig = {1: {width: 50, wrapWord: true}}
  }

  // Table config
  const tableConfig = {
    columns: columnConfig,
    drawHorizontalLine(lineIndex: number, rowCount: number) {
      return lineIndex === 0 || lineIndex === 1 || lineIndex === rowCount
    },
  }
  const tableStr = table(data, tableConfig)
  return tableStr
}

/**
 * Sleep function.
 * @param ms Num of milliseconds to wait
 * @returns Promise that resolves after the specified time
 */
export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms)
  })
}

export const sleepModule = {sleep}
