import type { CholesterolResults } from '@/types/assessment';

export function calculateAge(dobString: string): string {
  if (!dobString) return '';
  const parts = dobString.replace(/\./g, '/').split('/');
  if (parts.length !== 3) return '';
  const day = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1;
  const year = parseInt(parts[2], 10);
  const birthDate = new Date(year, month, day);
  if (isNaN(birthDate.getTime())) return '';
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
  return String(age);
}

export function calculateBMI(heightCm: number, weightKg: number): string {
  if (!heightCm || !weightKg || heightCm === 0) return '';
  const heightM = heightCm / 100;
  return String(Math.round((weightKg / (heightM * heightM)) * 10) / 10);
}

export function classifyBMI(bmi: string): string {
  const val = parseFloat(bmi);
  if (isNaN(val)) return '';
  if (val < 18.5) return 'Underweight';
  if (val < 25) return 'Healthy weight';
  if (val < 30) return 'Overweight';
  return 'Obese';
}

// Updated: Screening-appropriate language (not diagnostic)
export function classifyBloodPressure(systolic: string, diastolic: string): string {
  const sys = parseFloat(systolic);
  const dia = parseFloat(diastolic);
  if (isNaN(sys) || isNaN(dia)) return '';

  if (sys < 90 && dia < 60) return 'Low reading';
  if (sys >= 180 || dia >= 120) return 'Very high reading - urgent GP review';
  if (sys >= 160 || dia >= 100) return 'High reading - GP review advised';
  if (sys >= 140 || dia >= 90) return 'Raised reading - GP confirmation needed';
  if (sys >= 130 || dia >= 85) return 'Higher end of normal';
  if (sys >= 120 || dia >= 80) return 'Normal reading';
  return 'Optimal reading';
}

export function classifyPulse(pulse: string): string {
  const val = parseFloat(pulse);
  if (isNaN(val)) return '';
  if (val >= 60 && val <= 100) return 'Normal range';
  if (val < 60) return 'Below typical range';
  return 'Above typical range';
}

export function assessCholesterol(
  totalChol: string,
  ldl: string,
  hdl: string,
  triglycerides: string
): CholesterolResults {
  const results: CholesterolResults = {};
  const tc = parseFloat(totalChol);
  const h = parseFloat(hdl);
  const l = parseFloat(ldl);
  const tg = parseFloat(triglycerides);

  if (!isNaN(tc)) {
    if (tc < 5) results.totalStatus = 'Desirable';
    else if (tc < 6.5) results.totalStatus = 'Borderline high';
    else results.totalStatus = 'High';
  }

  if (!isNaN(h)) {
    if (h > 1.2) results.hdlStatus = 'Good protective level';
    else if (h > 1.0) results.hdlStatus = 'Moderate level';
    else results.hdlStatus = 'Low, needs improvement';
  }

  if (!isNaN(l)) {
    if (l < 3) results.ldlStatus = 'Optimal';
    else if (l < 4.1) results.ldlStatus = 'Borderline high';
    else results.ldlStatus = 'High';
  }

  if (!isNaN(tg)) {
    if (tg < 2.3) results.triglyceridesStatus = 'Desirable';
    else if (tg < 4.5) results.triglyceridesStatus = 'Borderline high';
    else results.triglyceridesStatus = 'High';
  }

  if (!isNaN(tc) && !isNaN(h) && h > 0) {
    results.ratio = Math.round((tc / h) * 10) / 10;
    results.nonHdl = Math.round((tc - h) * 10) / 10;
    if (results.ratio < 4) results.riskLevel = 'Low risk';
    else if (results.ratio < 5) results.riskLevel = 'Moderate risk';
    else results.riskLevel = 'High risk';
  }

  if (!isNaN(l) && !isNaN(h) && h > 0) {
    results.ldlHdlRatio = Math.round((l / h) * 10) / 10;
  }

  if ((!isNaN(tc) && (tc >= 6.5 || results.riskLevel === 'High risk')) || (!isNaN(l) && l >= 4.1)) {
    results.overall = 'Raised, GP review recommended';
  } else if (!isNaN(tc) && (tc >= 5 || results.riskLevel === 'Moderate risk')) {
    results.overall = 'Borderline, lifestyle focus';
  } else if (!isNaN(tc)) {
    results.overall = 'Within healthy range';
  } else {
    results.overall = '';
  }

  return results;
}

export function calculateChalderTotal(chalder: Record<string, string>): string {
  let total = 0;
  let count = 0;
  for (let i = 1; i <= 11; i++) {
    const val = chalder[String(i)];
    if (val !== undefined && val !== '') {
      total += parseInt(val, 10);
      count++;
    }
  }
  return count ? String(total) : '';
}

export function classifyFatigue(score: string): string {
  const val = parseInt(score, 10);
  if (isNaN(val)) return '';
  if (val < 20) return 'Minimal fatigue';
  if (val < 40) return 'Mild fatigue';
  if (val < 70) return 'Moderate fatigue';
  return 'Significant fatigue';
}

export function calculateWellbeingAverage(values: Record<string, string>): string {
  const ids = ['wbEnergy', 'wbSleep', 'wbMood', 'wbActivity', 'wbNutrition', 'wbSocial', 'wbStress', 'wbWorkLife', 'wbPurpose', 'wbLifeSatisfaction'];
  const vals = ids
    .map(id => parseFloat(values[id] || ''))
    .filter(v => !isNaN(v));
  if (!vals.length) return '';
  const avg = vals.reduce((a, b) => a + b, 0) / vals.length;
  return avg.toFixed(1);
}

export function classifyWellbeing(avg: string): string {
  const n = parseFloat(avg);
  if (isNaN(n)) return '';
  if (n >= 8) return 'Strong';
  if (n >= 6) return 'Good';
  if (n >= 4) return 'Needs support';
  return 'Low';
}

export function getStatusColor(category: string): string {
  const cat = category.toLowerCase();
  if (cat.includes('optimal') || cat.includes('healthy') || cat.includes('normal') || cat.includes('desirable') || cat.includes('good') || cat.includes('strong') || cat.includes('minimal') || cat.includes('low risk')) {
    return 'text-status-optimal';
  }
  if (cat.includes('borderline') || cat.includes('higher end') || cat.includes('elevated') || cat.includes('moderate') || cat.includes('overweight') || cat.includes('mild') || cat.includes('needs support')) {
    return 'text-status-elevated';
  }
  if (cat.includes('high') || cat.includes('raised') || cat.includes('obese') || cat.includes('severe') || cat.includes('urgent') || cat.includes('underweight') || cat.includes('below') || cat.includes('above') || cat.includes('significant')) {
    return 'text-status-high';
  }
  return 'text-foreground';
}
