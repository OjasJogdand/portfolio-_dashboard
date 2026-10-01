import { Router } from 'express';
import { getPortfolio } from './controllers.js';

const router = Router();

// Route to get the entire calculated portfolio
router.get('/portfolio', getPortfolio);

export default router;
