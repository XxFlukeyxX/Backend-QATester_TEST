import { getMeService, updateMeService } from '../services/user.service.js';

export async function getMe(req, res, next) {
  try {
    const userId = req.user?.sub;
    const user = await getMeService(userId);
    res.json({ user });
  } catch (e) { next(e); }
}

export async function updateMe(req, res, next) {
  try {
    const userId = req.user?.sub;
    const user = await updateMeService(userId, req.body);
    res.json({ message: 'อัปเดตข้อมูลสำเร็จ', user });
  } catch (e) { next(e); }
}
