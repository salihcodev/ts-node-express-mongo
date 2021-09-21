// pkgs:
import express from 'express';

// utils:
import {
    getRegisteredUsers,
    signupHandler,
    SignInHandler,
} from '../controllers/user.controller';

// create new router:
const router = express.Router();
router.get('/s', getRegisteredUsers);
router.post('/signup', signupHandler);
router.post('/SignIn', SignInHandler);

export default router;
