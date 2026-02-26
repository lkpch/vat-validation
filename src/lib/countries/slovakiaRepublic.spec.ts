import { slovakiaRepublic } from './slovakiaRepublic';
import { codes, invalid, name, valid, validOnlyByFormat } from './slovakiaRepublic.vat';
import { addCharsToString, checkInvalidVat, checkOnlyValidFormatVat, checkValidVat } from '../../test-utils';

describe('Slovakia Republic', () => {
  it('should return "true" result for valid VATs', () => {
    valid.forEach((vat) => checkValidVat(vat, [slovakiaRepublic], codes, name));
  });

  it('should return "true" for "isSupportedCountry" and "isValidFormat" fields, but "false" for "isValid" for VATs that match format but still invalid', () => {
    validOnlyByFormat.forEach((vat) => checkOnlyValidFormatVat(vat, [slovakiaRepublic], codes, name));
  });

  it('should return "true" result for valid VATs with extra dash characters', () => {
    valid
      .map((vat) => addCharsToString(vat, '-'))
      .forEach((vat) => checkValidVat(vat, [slovakiaRepublic], codes, name));
  });

  it('should return "true" result for valid VATs with extra space characters', () => {
    valid
      .map((vat) => addCharsToString(vat, ' '))
      .forEach((vat) => checkValidVat(vat, [slovakiaRepublic], codes, name));
  });

  it('should return "false" result for invalid VATs', () => {
    invalid.forEach((vat) => checkInvalidVat(vat, [slovakiaRepublic]));
  });
});
