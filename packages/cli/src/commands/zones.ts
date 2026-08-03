import { Command } from 'commander';
import chalk from 'chalk';
import Table from 'cli-table3';
import ora from 'ora';
import { HiveCDN } from '@hivecdn/sdk';
import { getSDKConfig } from '../config.js';

export const zonesCommand = new Command('zones')
  .description('Manage CDN zones')
  .addCommand(
    new Command('list').alias('ls').description('List all zones')
      .action(async () => {
        const spinner = ora('Fetching…').start();
        try {
          const zones = await new HiveCDN(getSDKConfig()).zones.list();
          spinner.stop();
          const t = new Table({
            head: ['ID', 'Name', 'Status', 'Plan', 'Origin'].map(h => chalk.bold.yellow(h)),
          });
          for (const z of zones) {
            const s = z.status === 'active' ? chalk.green(z.status) : z.status === 'pending' ? chalk.yellow(z.status) : chalk.red(z.status);
            t.push([z.id, z.name, s, z.plan, z.origin.url]);
          }
          console.log(t.toString());
          console.log(chalk.dim(`\n${zones.length} zone(s)`));
        } catch (err) {
          spinner.fail(chalk.red(String(err)));
          process.exit(1);
        }
      }),
  )
  .addCommand(
    new Command('get').description('Get zone details').argument('<zone-id>')
      .action(async (id: string) => {
        const z = await new HiveCDN(getSDKConfig()).zones.get(id);
        console.log(JSON.stringify(z, null, 2));
      }),
  );
