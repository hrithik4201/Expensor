import { Router } from 'express';
import * as FilterController from '../controller/FilterController.js';
const router = Router();

router.get('/', FilterController.filter);

export default router;
