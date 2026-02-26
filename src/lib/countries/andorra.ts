import { Country } from '../vat-validation';

export const andorra: Country = {
  name: 'Andorra',
  codes: ['AD', 'AND', '020'],
  calcFn: (vat: string): boolean => {
    if (vat.length !== 8) return false;
    const firstChar = vat[0].toUpperCase();
    const lastChar = vat[7].toUpperCase();
    // First and last characters must be from the allowed set
    const allowedChars = 'FEALECDGOPU';
    return allowedChars.includes(firstChar) && allowedChars.includes(lastChar);
  },
  rules: {
    multipliers: {},
    regex: [/^(AD)([fealecdgopuFEALECDGOPU]\d{6}[fealecdgopuFEALECDGOPU])$/]
  }
};
