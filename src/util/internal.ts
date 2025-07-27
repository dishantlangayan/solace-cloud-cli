import { table } from 'table'

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
    width?: number;
    wrapWord?: boolean;
}

export function renderTable<T>(
    data: T[][],
    columnConfig?: Record<number, ColumnConfig>): string {
    
    // Table config
    const tableConfig = {
        columns: columnConfig
    }
    const tableStr = table(data, tableConfig)
    return tableStr
}

export function renderKeyValueTable<T>(
    data: T[][],
    columnConfig?: Record<number, ColumnConfig>): string {

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