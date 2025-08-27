import { listSpecialtiesService } from '../services/specialty.service.js';

export async function getSpecialties(_req, res, next) {
  try {
    const items = await listSpecialtiesService();
    res.json({ items });
  } catch (e) { next(e); }
}
