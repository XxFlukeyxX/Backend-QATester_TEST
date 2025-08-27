import {
  searchDoctorService, addSlotsService, getSlotsService,
  updateSlotService, deleteSlotService
} from '../services/doctor.service.js';

export async function searchDoctors(req, res, next) {
  try {
    const items = await searchDoctorService(req.query);
    res.json({ items });
  } catch (e) { next(e); }
}

export async function addDoctorSlots(req, res, next) {
  try {
    const userId = req.user?.sub;
    const { id } = req.params;
    const prepared = req.locals?.slotsPrepared || [];
    const result = await addSlotsService({ userId, doctorId: Number(id), prepared });
    res.status(201).json(result); // { added: N }
  } catch (e) { next(e); }
}

export async function getDoctorSlots(req, res, next) {
  try {
    const { id } = req.params;
    const items = await getSlotsService(Number(id));
    res.json({ items });
  } catch (e) { next(e); }
}

export async function updateDoctorSlot(req, res, next) {
  try {
    const userId = req.user?.sub;
    const { id, slotId } = req.params;
    const prepared = req.locals?.slotPrepared;
    const result = await updateSlotService({ userId, doctorId: Number(id), slotId: Number(slotId), prepared });
    res.json({ ...result, message: 'แก้ไขเวลาว่างสำเร็จ' });
  } catch (e) { next(e); }
}

export async function deleteDoctorSlot(req, res, next) {
  try {
    const userId = req.user?.sub;
    const { id, slotId } = req.params;
    const result = await deleteSlotService({ userId, doctorId: Number(id), slotId: Number(slotId) });
    res.json({ ...result, message: 'ลบเวลาว่างสำเร็จ' });
  } catch (e) { next(e); }
}
