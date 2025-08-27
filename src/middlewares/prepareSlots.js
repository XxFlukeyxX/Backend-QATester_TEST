import { parseFlexibleToUTC, toMySQLDateTimeUTC, toThaiDisplay, toEnglishDisplay } from '../utils/datetime.js';

export function prepareSlots() {
  return (req, res, next) => {
    try {
      const input = Array.isArray(req.body?.slots) ? req.body.slots : [];
      if (!input.length) return next();

      const prepared = input.map(s => {
        const dUTC = parseFlexibleToUTC(s);
        return {
          mysqlUTC: toMySQLDateTimeUTC(dUTC),
          th: toThaiDisplay(dUTC),            
          en: toEnglishDisplay(dUTC)          
        };
      });

      req.locals = req.locals || {};
      req.locals.slotsPrepared = prepared;

      req.body.slots = prepared.map(p => p.mysqlUTC);

      next();
    } catch (e) {
      return res.status(400).json({ message: e.message || 'Bad date format' });
    }
  };
}

export function prepareSingleSlot() {
  return (req, res, next) => {
    try {
      const s = String(req.body?.slot || '').trim();
      if (!s) return next();

      const dUTC = parseFlexibleToUTC(s);
      const prepared = {
        mysqlUTC: toMySQLDateTimeUTC(dUTC),
        th: toThaiDisplay(dUTC),
        en: toEnglishDisplay(dUTC)
      };

      req.locals = req.locals || {};
      req.locals.slotPrepared = prepared;

      req.body.slot = prepared.mysqlUTC;

      next();
    } catch (e) {
      return res.status(400).json({ message: e.message || 'Bad date format' });
    }
  };
}
