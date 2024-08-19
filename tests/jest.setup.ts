import { expect } from '@playwright/test';
expect.extend({
    toBeNumber(received) {
      const pass = typeof received === 'number';
      if (pass) {
        return {
          message: () => `expected ${received} not to be a number`,
          pass: true,
        };
      } else {
        return {
          message: () => `expected ${received} to be a number`,
          pass: false,
        };
      }
    },
    toBeString(received) {
      const pass = typeof received === 'string';
      if (pass) {
        return {
          message: () => `expected ${received} not to be a string`,
          pass: true,
        };
      } else {
        return {
          message: () => `expected ${received} to be a string`,
          pass: false,
        };
      }
    },
    toBeObject(received) {
      const pass = typeof received === 'object' && received !== null;
      if (pass) {
        return {
          message: () => `expected ${received} not to be an object`,
          pass: true,
        };
      } else {
        return {
          message: () => `expected ${received} to be an object`,
          pass: false,
        };
      }
    },
  });
  
  