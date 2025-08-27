import { Router } from 'express';
import { auth } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { getMe, updateMe } from '../controllers/user.controller.js';
import { updateMeSchema } from '../validators/user.validator.js';

const router = Router();

router.get('/me', auth(true), getMe);
router.put('/me', auth(true), validate(updateMeSchema), updateMe);

export default router;
