export enum EnvironmentVariable {
    'SC_ACCESS_TOKEN' = 'SC_ACCESS_TOKEN',
    'SC_API_VERSION' = 'SC_API_VERSION',
    'SC_BASE_URL' = 'SC_BASE_URL',
}

export const DefaultBaseUrl = 'https://api.solace.cloud'

/**
 * An injectable abstraction on top of `process.env` with various convenience functions
 * for accessing environment variables.
 */
export class EnvVars {
    public constructor(private env = process.env || {}) {
        this.env = env
    }

    /**
     * Gets a `string` value for a given key.
     *
     * @param key The name of the envar.
     */
    public getString(key: string): string | undefined
    /**
     * Gets a `string` value for a given key.
     *
     * @param key The name of the envar.
     * @param def A default value.
     */
    public getString(key: string, def: string): string
    // underlying method
    public getString(key: string, def?: string): string | undefined {
        return this.env[key] ?? def
    }

    /**
     * Sets a `string` value for a given key, or removes the current value when no value is given.
     *
     * @param key The name of the envar.
     * @param value The value to set.
     */
    public setString(key: string, value: string): void {
        if (value === '') {
            this.unset(key)
            return;
        }

        this.env[key] = value
    }

    /**
     * Un-sets a value for a given key.
     *
     * @param key The name of the environment variable.
     */
    public unset(key: string): void {
        delete this.env[key]
    }
}

/**
 * The default `EnvVars` instance, which wraps `process.env`.
 */
export const envVars = new EnvVars()