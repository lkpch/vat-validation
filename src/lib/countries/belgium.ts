import { Country } from '../vat-validation';

export const belgium: Country = {
  name: 'Belgium',
  codes: ['BE', 'BEL', '056'],
  calcFn: (vat: string): boolean => {
    const newVat = vat.length === 9 ? '0' + vat : vat;
    if (newVat[0] === '0' && newVat[1] === '0') return false;

    const check = 97 - (Number(newVat.slice(0, 8)) % 97);
    return check === Number(newVat.slice(8, 10));
  },
  rules: {
    multipliers: {},
    regex: [/^(BE)([01]?\d{9})$/]
  }
};
