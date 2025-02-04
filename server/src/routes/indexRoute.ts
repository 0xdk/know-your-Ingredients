import { Router, Request, Response } from 'express';
import indexController from '../controllers/indexController';

function validateInput(req: Request, res: Response, next: Function) {
  if (!req.body.input) {
    res.status(400).json({ error: 'Input is required from route' });
  } else {
    next();
  }
}

export const getInfoRoute = Router();
getInfoRoute.post('/get-info', validateInput, indexController.handleApiRequest);

export default getInfoRoute;
