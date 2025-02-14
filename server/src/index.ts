import express from 'express';
import dotenv from 'dotenv';
dotenv.config();

import { Request, Response } from 'express';
import getInfoRoute from './routes/indexRoute';
const app = express();
app.use(express.json());

const port: number = 3000;

app.get('/', (req: Request, res: Response) => {
  res.send('go to /get-info');
});

app.use('/api', getInfoRoute);

app.listen(port, () => {
  console.log('listening on port ' + port);
});
