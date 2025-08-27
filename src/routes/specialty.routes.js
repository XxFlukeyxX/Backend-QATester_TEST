import { Router } from 'express';
import { getSpecialties } from '../controllers/specialty.controller.js';

const router = Router();
router.get('/', getSpecialties);
export default router;
