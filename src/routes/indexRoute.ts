import { Router } from 'express';
import indexController from '../controllers/indexController';

export const getInfoRoute = Router();
getInfoRoute.get('/get-info', indexController.handleApiRequest);

export default getInfoRoute;
