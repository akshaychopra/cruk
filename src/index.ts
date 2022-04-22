import express from 'express';
import dotenv from 'dotenv';
import donation from './routes/donation';
import { startElasticClient } from './util/elastic';
import { WinstonLogger } from './util/logger';

dotenv.config();

// start elasticsearch
startElasticClient();

const app = express();

const port = 80;
const nodeEnv = process.env.NODE_ENV || 'dev';

const wLogger = new WinstonLogger(nodeEnv);
wLogger.setupSentry(process.env.SENTRY_DSN || '');

const mLogger = WinstonLogger.createMorganMiddleware(process.env.NODE_ENV || 'dev');
app.use(mLogger);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).send('success');
});

app.use('/', donation);

app.listen(port, () => {
  global.logger.log({ message: `server started at http://localhost:${port}`, level: 'info' });
});
