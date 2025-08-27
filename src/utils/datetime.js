const TH_MONTHS = {
  'ม.ค.':1,'ก.พ.':2,'มี.ค.':3,'เม.ย.':4,'พ.ค.':5,'มิ.ย.':6,
  'ก.ค.':7,'ส.ค.':8,'ก.ย.':9,'ต.ค.':10,'พ.ย.':11,'ธ.ค.':12,
  'มกราคม':1,'กุมภาพันธ์':2,'มีนาคม':3,'เมษายน':4,'พฤษภาคม':5,'มิถุนายน':6,
  'กรกฎาคม':7,'สิงหาคม':8,'กันยายน':9,'ตุลาคม':10,'พฤศจิกายน':11,'ธันวาคม':12
};

const z2 = n => String(n).padStart(2,'0');

function dateFromBangkokISO(isoWithTZ) {
  const d = new Date(isoWithTZ);
  if (isNaN(d.getTime())) throw new Error('Invalid ISO: ' + isoWithTZ);
  return d; 
}

export function toMySQLDateTimeUTC(dateObj) {
  return dateObj.toISOString().slice(0,19).replace('T',' ');
}

export function toEnglishDisplay(dateObj) {
  const d = new Date(dateObj.getTime() + 7*60*60*1000);
  const y = d.getUTCFullYear();
  const M = d.getUTCMonth()+1;
  const D = d.getUTCDate();
  let hh = d.getUTCHours();
  const mm = d.getUTCMinutes();
  const am = hh < 12 ? 'AM' : 'PM';
  hh = hh % 12; if (hh === 0) hh = 12;
  return `${z2(D)}/${z2(M)}/${y} ${hh}:${z2(mm)} ${am}`;
}

export function toThaiDisplay(dateObj) {
  const d = new Date(dateObj.getTime() + 7*60*60*1000);
  const y = d.getUTCFullYear() + 543;
  const M = d.getUTCMonth()+1;
  const D = d.getUTCDate();
  const hh = z2(d.getUTCHours());
  const mm = z2(d.getUTCMinutes());
  return `${z2(D)}/${z2(M)}/${y} ${hh}:${mm} น.`;
}

export function parseFlexibleToUTC(input) {
  const raw = String(input).trim();

  if (/^\d{4}-\d{2}-\d{2}T/.test(raw)) {
    const d = new Date(raw);
    if (isNaN(d.getTime())) throw new Error('Invalid ISO datetime: ' + raw);
    return d;
  }

  const re = /^(\d{1,2})\s+([ก-๛\.]+)\s+(\d{2,4})\s+(\d{1,2}):(\d{2})\s*(น\.|น)?\.?$/;
  const m = raw.match(re);
  if (m) {
    const D = parseInt(m[1],10);
    const monName = m[2];
    let Y = parseInt(m[3],10);
    const h = parseInt(m[4],10);
    const min = parseInt(m[5],10);

    const M = TH_MONTHS[monName];
    if (!M) throw new Error('Unknown Thai month: ' + monName);

    if (Y < 100) Y = 2500 + Y;
    const YCE = Y - 543;

    const iso = `${YCE}-${z2(M)}-${z2(D)}T${z2(h)}:${z2(min)}:00+07:00`;
    return dateFromBangkokISO(iso);
  }

  throw new Error('Unrecognized date format: ' + raw);
}
