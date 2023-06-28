import { Router } from 'express';
import passport from 'passport';
import AuthApi from './AuthApi.js';
import TransactionsApi from './TransactionsApi.js';
import UserApi from './UserApi.js';
import FilterApi from './FilterApi.js';
import SplitApi from './SplitApi.js';
const router = Router();

const auth = passport.authenticate('jwt', { session: false });

router.use('/transaction', auth, TransactionsApi);
router.use('/auth', AuthApi);
router.use('/user', UserApi);
router.use('/filter', auth, FilterApi);
router.use('/split', auth, SplitApi);

export default router;
