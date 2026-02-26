import { Country } from '../vat-validation';

/**
 * Numbers used to check a document or something containing numbers.
 */
type CheckSums = ReadonlyArray<number>;

/**
 * Generate check sums. Multiply numbers to validators and sum them to generate
 * check sums, they're used to check if numbers are valid.
 * @param numbers - Numbers used to generate checkers.
 * @param validators - Validators used to generate checkers.
 */
const generateCheckSums = (numbers: ReadonlyArray<number>, validators: ReadonlyArray<number>): CheckSums => {
  const initialCheckSums: CheckSums = [0, 0];

  return validators.reduce(
    ([checkerA, checkerB], validator, index) =>
      [index === 0 ? 0 : checkerA + numbers[index - 1] * validator, checkerB + numbers[index] * validator] as CheckSums,
    initialCheckSums
  );
};

const isRepeatedArray = (varNumbers: ReadonlyArray<number>) =>
  varNumbers.every((varNumber) => varNumbers[0] === varNumber);

/**
 * Get remaining of 11 or `0` if lower than 2.
 * @param value - Value used remaining.
 */
const getRemaining = (value: number): number => (value % 11 < 2 ? 0 : 11 - (value % 11));

function validateCNPJ(vat: string): boolean {
  const numbers = vat.split('').map(Number);
  if (isRepeatedArray(numbers)) {
    return false;
  }
  const validators: ReadonlyArray<number> = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2];
  const checkers = generateCheckSums(numbers, validators);
  return numbers[12] === getRemaining(checkers[0]) && numbers[13] === getRemaining(checkers[1]);
}

function validateCPF(vat: string): boolean {
  const numbers = vat.split('').map(Number);
  if (isRepeatedArray(numbers)) {
    return false;
  }

  // First check digit: multiply first 9 digits by 10..2, then mod 11
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += numbers[i] * (10 - i);
  }
  const first = getRemaining(sum);
  if (numbers[9] !== first) return false;

  // Second check digit: multiply first 10 digits by 11..2, then mod 11
  sum = 0;
  for (let i = 0; i < 10; i++) {
    sum += numbers[i] * (11 - i);
  }
  const second = getRemaining(sum);
  return numbers[10] === second;
}

export const brazil: Country = {
  name: 'Brazil',
  codes: ['BR', 'BRA', '076'],
  calcFn: (vat: string): boolean => {
    if (vat.length === 11) return validateCPF(vat);
    return validateCNPJ(vat);
  },
  rules: {
    multipliers: {},
    regex: [/^(BR)?(\d{14}|\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}|\d{11}|\d{3}\.\d{3}\.\d{3}-\d{2})$/]
  }
};
