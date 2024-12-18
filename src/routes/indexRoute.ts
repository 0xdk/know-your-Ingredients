import { Router } from 'express';
import handleApiRequest from '../controllers/indexController';
import indexController from '../controllers/indexController';

export const getInfoRoute = Router();
getInfoRoute.get('/get-info', handleApiRequest);

export default getInfoRoute;
