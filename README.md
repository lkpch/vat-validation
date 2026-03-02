[![npm version](https://badge.fury.io/js/vat-validation.svg)](http://badge.fury.io/js/vat-validation)

## vat-validation

Check the validity of a VAT number. No dependencies.

Fork of [jsvat](https://se-panfilov.github.io/jsvat/).

## What is it?

Small library to check validity of VAT numbers (European + some other countries). ([learn more][1] about VAT)

- No dependencies;
- No http calls;
- 2-step checks: math + regexp;
- Tree-shakeable;
- Extendable;
- Separate checks for valid VAT and valid VAT format;
- Dynamically add/remove countries with which you want to check the VAT;
- Detecting possible country before you finish;
- Typescript;

## Installation

Installation:

```bash
npm i vat-validation --save
```

(or `yarn add vat-validation`)

## Getting Started

```javascript
import { checkVAT, belgium, austria } from 'vat-validation';

checkVAT('BE0411905847', [belgium]); // true: accept only Belgium VATs
checkVAT('BE0411905847', [belgium, austria]); // true: accept only Belgium or Austria VATs
checkVAT('BE0411905847', [austria]); // false: accept only Austria VATs
```

or

```javascript
import { checkVAT, countries } from 'vat-validation';
checkVAT('BE0411905847', countries); // check against all supported countries
```

to check against all supported countries

## Return value

`checkVAT()` returns `VatCheckResult` object:

```typescript
export interface VatCheckResult {
  value?: string; // 'BE0411905847': your VAT without extra characters (like '-', spaces, etc)
  isValid: boolean; // The main result. Indicates if VAT is correct against provided countries or not
  isValidFormat: boolean; // Indicates the validation of the format of VAT only. E.g. "BE0411905847" is a valid VAT, and "BE0897221791" is not. But they both has valid format, so "isValidFormat" will return "true"
  isSupportedCountry: boolean; // Indicates if "vat-validation" could recognize the VAT. Sometimes you want to understand - if it's an invalid VAT from supported country or from an unknown one
  country?: {
    // VAT's country (null if not found). By "supported" I mean imported.
    name: string; // ISO country name of VAT
    isoCode: {
      // Country ISO codes
      short: string;
      long: string;
      numeric: string;
    };
  };
}
```

## Strict mode

By default, `checkVAT` is lenient — it strips spaces, dashes, dots, and slashes before validating. If you want to validate the raw input as-is (only uppercasing is applied), pass the `strict` option:

```javascript
checkVAT('BE 0411.905.847', [belgium]); // isValid: true (lenient, extra chars stripped)
checkVAT('BE 0411.905.847', [belgium], { strict: true }); // isValid: false (spaces and dots not stripped)
checkVAT('BE0411905847', [belgium], { strict: true }); // isValid: true
```

## List of supported countries:

- Andorra
- Australia
- Austria
- Belgium
- Brazil
- Bulgaria
- Croatia
- Cyprus
- Czech Republic
- Denmark
- Estonia
- Europe (EU MOSS scheme)
- Finland
- France
- Germany
- Greece
- Hungary
- Ireland
- Italy
- Latvia
- Lithuania
- Luxembourg
- Malta
- Netherlands
- Norway
- Poland
- Portugal
- Romania
- Russia Federation
- Serbia
- Singapore
- Slovakia Republic
- Slovenia
- Spain
- Sweden
- Switzerland
- United Kingdom (incl. Northern Ireland XI prefix)

## How to import all countries at once?

```javascript
import { checkVAT, countries } from 'vat-validation';
// const { checkVAT, countries } = require('vat-validation');

checkVAT('WD12345678', countries);
```

## Extend countries list - add your own country:

You can add your own country.
In general `Country` should implement following structure:

```typescript
interface Country {
  name: string;
  codes: ReadonlyArray<string>;
  calcFn: (vat: string, options?: object) => boolean; //options - isn't a mandatory param
  rules: {
    multipliers: {}; // you can leave it empty
    regex: ReadonlyArray<RegExp>;
  };
}
```

Example:

```javascript
import { checkVAT } from 'vat-validation';

export const wonderland = {
  name: 'Wonderland',
  codes: ['WD', 'WDR', '999'], // This codes should follow ISO standards (short, long and numeric), but it's your own business
  calcFn: (vat) => {
    return vat.length === 10;
  },
  rules: {
    regex: [/^(WD)(\d{8})$/]
  }
};

checkVAT('WD12345678', [wonderland]); // true
```

## Module formats

vat-validation ships both ESM and CommonJS builds:

```javascript
// ESM
import { checkVAT, belgium, austria } from 'vat-validation';

// CommonJS
const { checkVAT, belgium, austria } = require('vat-validation');
```

## How vat-validation checks validity?

There is a 2-step check:

1. **Format validation** — compare against a list of regular expressions.

For example, the regexp for Austria is `/^(AT)U(\d{8})$/`.
`ATU99999999` satisfies the regexp, but it should actually be invalid.

2. **Check digit validation** — verify the number's built-in check digit(s).

Most VAT numbers contain one or more check digits calculated using a country-specific algorithm (weighted sums, modular arithmetic, etc.). This step catches numbers that look right but are mathematically invalid.
After this step we can be sure that `ATU99999999` and `ATV66889218` are invalid, while `ATU12011204` is valid.

NOTE:
VAT numbers of some countries should ends up with special characters. Like '01' for Sweden or "L" for Cyprus.
If 100% real VAT doesn't fit, try to add proper appendix.

## Browser Support

Evergreen browsers only.
