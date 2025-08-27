import { Router } from 'express';
import {
  searchDoctors, addDoctorSlots, getDoctorSlots,
  updateDoctorSlot, deleteDoctorSlot
} from '../controllers/doctor.controller.js';
import { auth, allow } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { searchDoctorSchema, addSlotsSchema, updateSlotSchema } from '../validators/doctor.validator.js';
import { prepareSlots, prepareSingleSlot } from '../middlewares/prepareSlots.js';

const router = Router();

router.get('/', validate(searchDoctorSchema), searchDoctors);

router.post('/:id/slots',
  auth(true), allow('doctor'),
  prepareSlots(), validate(addSlotsSchema),
  addDoctorSlots
);

router.patch('/:id/slots/:slotId',
  auth(true), allow('doctor'),
  prepareSingleSlot(), validate(updateSlotSchema),
  updateDoctorSlot
);

router.delete('/:id/slots/:slotId',
  auth(true), allow('doctor'),
  deleteDoctorSlot
);

router.get('/:id/slots', getDoctorSlots);

export default router;
