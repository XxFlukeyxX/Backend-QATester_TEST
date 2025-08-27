import { reportAppointmentsService } from '../services/report.service.js';

export async function getAppointmentsReport(req, res, next) {
  try {
    const { date } = req.query;
    const role = req.user?.role;
    const userId = req.user?.sub;

    const report = await reportAppointmentsService({ date, role, userId });
    res.json(report);
  } catch (e) { next(e); }
}
