import { createJsonSchema } from "@helpers/schemaHelperFunctions";
import { expect } from "@playwright/test";
import Ajv from "ajv";

/**
 * Validates an object against a JSON schema.
 *
 * @param {string} fileName - The first part of the name of the JSON schema file. The full name will be `${fileName}_schema.json`.
 * @param {string} filePath - The path to the directory containing the JSON schema file.
 * @param {object} body - The object to validate against the JSON schema.
 * @param {boolean} [createSchema=false] - Whether to create the JSON schema if it doesn't exist.
 *
 * @example
 *    const body = await response.json();
 *
 *    // This will run the assertion against the existing schema file
 *    await validateJsonSchema("POST_booking", "booking", body);
 *
 *    // This will create or overwrite the schema file
 *    await validateJsonSchema("POST_booking", "booking", body, true);
 */
export async function validateJsonSchema(fileName: string, filePath: string, body: object, createSchema = false) {
  const jsonName = fileName;
  const path = filePath;

  if (createSchema) {
    await createJsonSchema(jsonName, path, body);
  }

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const existingSchema = require(`../../.api/${path}/${jsonName}_schema.json`);

  const ajv = new Ajv({ allErrors: false });
  const validate = ajv.compile(existingSchema);
  const validRes = validate(body);

  if (!validRes) {
    console.log("SCHEMA ERRORS:", JSON.stringify(validate.errors), "\nRESPONSE BODY:", JSON.stringify(body));
  }

  expect(validRes).toBe(true);
}
