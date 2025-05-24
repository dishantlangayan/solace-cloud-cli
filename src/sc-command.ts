import { Command, Flags, Interfaces } from '@oclif/core'

import { DefaultBaseUrl, EnvironmentVariable, envVars } from './config/env-vars.js'

export type Flags<T extends typeof Command> = Interfaces.InferredFlags<T['flags'] & typeof ScCommand['baseFlags']>
export type Args<T extends typeof Command> = Interfaces.InferredArgs<T['args']>

/**
 * A base command that provided common functionality for all sc commands.
 *
 * All implementations of this class need to implement the run() method.
 *
 */

export abstract class ScCommand<T extends typeof Command> extends Command {
  // define flags that can be inherited by any command that extends BaseCommand
  static baseFlags = {
    'log-level': Flags.option({
      default: 'info',
      helpGroup: 'GLOBAL',
      options: ['debug', 'warn', 'error', 'info', 'trace'] as const,
      summary: 'Specify level for logging.',
    })(),
  }
  // add the --json flag
  static enableJsonFlag = true
  protected args!: Args<T>
  protected flags!: Flags<T>

  protected async catch(err: Error & { exitCode?: number }): Promise<unknown> {
    // add any custom logic to handle errors from the command
    // or simply return the parent class error handling
    return super.catch(err)
  }

  protected async finally(_: Error | undefined): Promise<unknown> {
    // called after run and catch regardless of whether or not the command errored
    return super.finally(_)
  }

  public async init(): Promise<void> {
    await super.init()
    const { args, flags } = await this.parse({
      args: this.ctor.args,
      baseFlags: (super.ctor as typeof ScCommand).baseFlags,
      enableJsonFlag: this.ctor.enableJsonFlag,
      flags: this.ctor.flags,
      strict: this.ctor.strict,
    })
    this.flags = flags as Flags<T>
    this.args = args as Args<T>

    // set base url if not defined in environment variables
    if (!envVars.getString(EnvironmentVariable.SC_BASE_URL)) {
      this.debug(`Environment variable '${EnvironmentVariable.SC_BASE_URL}' not set, using default '${DefaultBaseUrl}'`)
      envVars.setString(EnvironmentVariable.SC_BASE_URL, DefaultBaseUrl)
    }

    // Check if Access Token is set
    const value = envVars.getString(EnvironmentVariable.SC_ACCESS_TOKEN);
    if (!value) {
      throw new Error(`Environment variable ${EnvironmentVariable.SC_ACCESS_TOKEN} is not set and required for any API operations.`);
    }
  }
}