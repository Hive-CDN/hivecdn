import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { prompt } from 'enquirer';
import { HiveCDN } from '@hivecdn/sdk';
import { saveProfile } from '../config.js';

export const authCommand = new Command('auth')
  .description('Authenticate with HiveCDN')
  .addCommand(
    new Command('login')
      .description('Log in with your API key')
      .option('--key <key>', 'API key (or HIVECDN_API_KEY env var)')
      .option('--profile <name>', 'Profile name', 'default')
      .action(async (opts: { key?: string; profile: string }) => {
        let apiKey = opts.key ?? process.env['HIVECDN_API_KEY'];
        if (!apiKey) {
          const { key } = await prompt<{ key: string }>({
            type: 'password', name: 'key',
            message: 'Enter your HiveCDN API key',
          });
          apiKey = key;
        }
        const spinner = ora('Verifying…').start();
        try {
          const account = await new HiveCDN({ apiKey }).whoami();
          spinner.succeed(chalk.green(`Logged in as ${account.email} (${account.plan})`));
          saveProfile(opts.profile, { apiKey });
        } catch {
          spinner.fail(chalk.red('Invalid API key'));
          process.exit(1);
        }
      }),
  )
  .addCommand(
    new Command('whoami')
      .description('Show current account')
      .action(async () => {
        const { getSDKConfig } = await import('../config.js');
        const account = await new HiveCDN(getSDKConfig()).whoami();
        console.log(chalk.bold('Account:'), account.email);
        console.log(chalk.bold('Plan:   '), account.plan);
        console.log(chalk.bold('Zones:  '), account.zones);
      }),
  );
