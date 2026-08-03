import { Command } from 'commander';
import chalk from 'chalk';
import ora from 'ora';
import { HiveCDN } from '@hivecdn/sdk';
import { getSDKConfig } from '../config.js';

export const purgeCommand = new Command('purge')
  .description('Purge cached content from the edge')
  .requiredOption('-z, --zone <id>', 'Zone ID')
  .option('--all', 'Purge everything')
  .option('--urls <urls...>', 'URLs to purge')
  .option('--tags <tags...>', 'Cache tags to purge')
  .option('--prefixes <prefixes...>', 'URL prefixes to purge')
  .action(async (opts: { zone: string; all?: boolean; urls?: string[]; tags?: string[]; prefixes?: string[] }) => {
    const cdn = new HiveCDN(getSDKConfig());
    const spinner = ora('Queueing purge…').start();
    try {
      const result = opts.all
        ? await cdn.cache.purgeEverything(opts.zone)
        : opts.urls?.length ? await cdn.cache.purgeUrls(opts.zone, opts.urls)
        : opts.tags?.length ? await cdn.cache.purgeTags(opts.zone, opts.tags)
        : opts.prefixes?.length ? await cdn.cache.purgePrefixes(opts.zone, opts.prefixes)
        : (() => { spinner.fail('Specify --all, --urls, --tags, or --prefixes'); process.exit(1); })()!;
      spinner.succeed(chalk.green(`Purge queued — id: ${result.id}, targets: ${result.targets}`));
    } catch (err) {
      spinner.fail(chalk.red(String(err)));
      process.exit(1);
    }
  });
