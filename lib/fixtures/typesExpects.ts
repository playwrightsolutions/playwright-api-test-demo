import { expect as baseExpect } from "@playwright/test";

export { test } from "@playwright/test";

export const expect = baseExpect.extend({
  toBeOneOfTypes(received: any, array: string[]) {
    const pass = array.includes(typeof received) || (array.includes(null) && received == null);

    if (pass) {
      return {
        message: () => "passed",
        pass: true,
      };
    } else {
      return {
        message: () =>
          `toBeOneOfTypes() assertion failed.\nYou expected '${
            received == null ? "null" : typeof received
          }' type to be one of [${array}] types\n${
            array.includes(null)
              ? `WARNING: [${array}] array contains 'null' type which is not printed in the error\n`
              : null
          }`,
        pass: false,
      };
    }
  },

  toBeNumber(received: any) {
    const pass = typeof received == "number";
    if (pass) {
      return {
        message: () => "passed",
        pass: true,
      };
    } else {
      return {
        message: () =>
          `toBeNumber() assertion failed.\nYou expected '${received}' to be a number but it's a ${typeof received}\n`,
        pass: false,
      };
    }
  },

  toBeString(received: any) {
    const pass = typeof received == "string";
    if (pass) {
      return {
        message: () => "passed",
        pass: true,
      };
    } else {
      return {
        message: () =>
          `toBeString() assertion failed.\nYou expected '${received}' to be a string but it's a ${typeof received}\n`,
        pass: false,
      };
    }
  },

  toBeBoolean(received: any) {
    const pass = typeof received == "boolean";
    if (pass) {
      return {
        message: () => "passed",
        pass: true,
      };
    } else {
      return {
        message: () =>
          `toBeBoolean() assertion failed.\nYou expected '${received}' to be a boolean but it's a ${typeof received}\n`,
        pass: false,
      };
    }
  },

  toBeObject(received: any) {
    const pass = typeof received == "object";
    if (pass) {
      return {
        message: () => "passed",
        pass: true,
      };
    } else {
      return {
        message: () =>
          `toBeObject() assertion failed.\nYou expected '${received}' to be an object but it's a ${typeof received}\n`,
        pass: false,
      };
    }
  },
});
