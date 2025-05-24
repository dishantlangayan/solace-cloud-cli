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