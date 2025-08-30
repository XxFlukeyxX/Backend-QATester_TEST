export default function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500;

  const map = {
    UnauthorizedError: 'ไม่มีสิทธิ์เข้าถึง',
    'Invalid credentials': 'อีเมลหรือรหัสผ่านไม่ถูกต้อง',
    'Slot already booked': 'ช่วงเวลานี้ถูกจองแล้ว',
    'Forbidden': 'ไม่มีสิทธิ์ทำรายการนี้'
  };

  const message = map[err.name] || map[err.message] || err.message || 'เกิดข้อผิดพลาดภายในระบบ';
  return res.status(status).json({ message });
}
