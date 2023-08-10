import { createJsonSchema } from "./schemaHelperFunctions";
import { expect } from "@playwright/test";
import Ajv from "ajv";

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
