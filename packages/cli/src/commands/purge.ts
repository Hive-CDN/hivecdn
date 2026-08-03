import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { HiveCDN } from '@hivecdn/sdk';
import { getSDKConfig } from '../config.js';

export const purgeCommand = new Command('purge')
  .description('Purge cached content from the edge network')
  .requiredOption('-z, --zone <id>', 'Zone ID')
  .option('--all', 'Purge everything in the zone')
  .option('--urls <urls...>', 'Specific URLs to purge')
  .option('--tags <tags...>', 'Cache tags to purge')
  .option('--prefixes <prefixes...>', 'URL prefixes to purge')
  .action(async (opts: {
    zone: string;
    all?: boolean;
    urls?: string[];
    tags?: string[];
    prefixes?: string[];
  }) => {
    const cdn = new HiveCDN(getSDKConfig());
    const spinner = ora('Queueing purge…').start();

    try {
      let result;
      if (opts.all) {
        result = await cdn.cache.purgeEverything(opts.zone);
      } else if (opts.urls?.length) {
        result = await cdn.cache.purgeUrls(opts.zone, opts.urls);
      } else if (opts.tags?.length) {
        result = await cdn.cache.purgeTags(opts.zone, opts.tags);
      } else if (opts.prefixes?.length) {
        result = await cdn.cache.purgePrefixes(opts.zone, opts.prefixes);
      } else {
        spinner.fail('Specify --all, --urls, --tags, or --prefixes');
        process.exit(1);
      }

      spinner.succeed(chalk.green(`Purge queued (id: ${result.id}, targets: ${result.targets})`));
    } catch (err) {
      spinner.fail(chalk.red(String(err)));
      process.exit(1);
    }
  });
