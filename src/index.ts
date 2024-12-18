import express from 'express';

import { Request, Response } from 'express';
import getInfoRoute from './routes/indexRoute';
const app = express();

const port: number = 8080;

app.get('/', (req: Request, res: Response) => {
  res.send('go to /get-info');
});

app.use(getInfoRoute);

app.listen(port, () => {
  console.log('listening on port ' + port);
});
