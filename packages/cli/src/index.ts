import { Command } from 'commander';
import { authCommand } from './commands/auth.js';
import { purgeCommand } from './commands/purge.js';
import { zonesCommand } from './commands/zones.js';

new Command()
  .name('hivecdn')
  .description('HiveCDN CLI — manage zones, purge cache, query analytics')
  .version('2.4.1')
  .addCommand(authCommand)
  .addCommand(purgeCommand)
  .addCommand(zonesCommand)
  .parse(process.argv);
