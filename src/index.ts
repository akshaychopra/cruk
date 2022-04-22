import express from 'express';
import dotenv from 'dotenv';
import donation from './routes/donation';

const app = express();
dotenv.config();
const port = 80;

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).send('success');
});

app.use('/', donation);

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`server started at http://localhost:${port}`);
});
