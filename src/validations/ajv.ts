import Ajv from 'ajv';
import addFormats from 'ajv-formats';

export const ajv = new Ajv({
  allErrors: true,
  removeAdditional: false,
  strict: false,
});

addFormats(ajv);
