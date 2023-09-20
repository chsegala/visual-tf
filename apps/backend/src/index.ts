#!/usr/bin/env node

import yargs from "yargs";
import { serve } from "./commands/serve";

// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-floating-promises
yargs(process.argv.slice(2))
  .demandCommand()
   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
   //@ts-expect-error
  .command(serve)
  .help()
  .argv