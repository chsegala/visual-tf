// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import cors from 'cors';
import express from 'express';
import { realpathSync } from 'fs';
import { AddressInfo } from 'net';
import open from 'open';
import { join } from 'path';
import { pinoHttp } from 'pino-http';
import { logger } from 'shared';
import type yargs from "yargs";
import { router as terraformRouter } from '../routes/terraform';

interface Args {
  cwd: string;
  port: number;
  nodeEnv: string;
}

const _handler = (({ cwd, port, nodeEnv }: Args): void => {
  const app = express();
  app.use(cors());

  if (nodeEnv === 'development') {
    app.use(pinoHttp({ logger }))
  }

  // eslint-disable-next-line import/no-named-as-default-member
  const staticContentPath = realpathSync(join(__dirname, 'static'));

  logger.info(`serving content from '${staticContentPath}'`);
  app.use('/', express.static(staticContentPath));
  app.use('/api/terraform', terraformRouter({ cwd }))

  // const wsServer = new ws.Server({ noServer: true });
  // wsServer.on('connection', (socket: ws) => {
  //   logger.debug('connected');

  //   socket.on('message', (message: string) => {
  //     logger.info({ message }, 'received message')
  //   });
  // });

  const server = app.listen(port);
  // server.on('upgrade', (request, socket, head) => {
  //   wsServer.handleUpgrade(request, socket, head, (_s) => {
  //     wsServer.emit('connection', _s, request);
  //   });
  // });

  server.on('listening', () => {

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const _port = (server.address() as AddressInfo).port;
    logger.info(`server up and listening on port ${_port}`)

    open(`http://localhost:${_port}/`).catch(() => logger.warn('unable to open browser'));
  });
})

//#region command

export const serve = {
  command: 'serve',
  desc: 'start express server',
  builder: (_yargs: typeof yargs): typeof yargs => {
    return _yargs
      .env()
      .option('root-path', {
        alias: ['cwd', 'working-dir'],
        type: 'string',
        default: process.cwd(),
      })
      .option('express-port', {
        alias: ['port'],
        type: 'number',
        default: 0,
      })
      ;
  },
  handler: _handler
}

//#endregion