// pkgs:
import express from 'express';

// utils:
import {
    getRegisteredUsers,
    signupHandler,
    signInHandler,
} from '../controllers/user.controller';

// create new router:
const router = express.Router();
router.get('/s', getRegisteredUsers);
router.post('/signup', signupHandler);
router.post('/signin', signInHandler);

export default router;
