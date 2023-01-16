import { Router } from 'express';
import * as BillsSplit from '../controller/BillsSplitController.js';
const router = Router();

router.post('/', BillsSplit.Split);

export default router;
