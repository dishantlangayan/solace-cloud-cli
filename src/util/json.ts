/**
 * Parse JSON `string` data.
 *
 * @param data Data to parse.
 */
export function parseJson(data: string, _throwOnEmpty = true): unknown {
    return typeof data === 'string' ? JSON.parse(data) : data
}

/**
 * Finds a the key with the provided value in the JSON array and returns the JSON object.
 * 
 * @param array The JSON array to search
 * @param key The key to lookup in the array
 * @param value The value of the key to match
 * @returns The JSON object that matches the key and value
 */
export function findByKey<T>(array: T[], key: keyof T, value: unknown): T | undefined {
    return array.find(item => item[key] === value)
}