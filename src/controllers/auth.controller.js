import { registerService, loginService } from '../services/auth.service.js';

export async function register(req, res, next) {
  try {
    const result = await registerService(req.body);
    res.status(201).json({ message: 'ลงทะเบียนสำเร็จ', ...result });
  } catch (err) { next(err); }
}

export async function login(req, res, next) {
  try {
    const result = await loginService(req.body);
    res.json({ message: 'เข้าสู่ระบบสำเร็จ', ...result });
  } catch (err) { next(err); }
}
