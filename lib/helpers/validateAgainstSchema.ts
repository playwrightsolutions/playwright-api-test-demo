import * as fs from "fs";
import { expect, test } from "@playwright/test";
import { removeItemsFromArray } from "@helpers/arrayFunctions";
import { capitalizeString } from "@helpers/capitalizeString";
import { fail } from "assert";
import { addWarning } from "@helpers/warnings";
import { authSchemaExpectedResponseParamsCount } from "@helpers/schemaData/Auth";
import { bookingSchemaExpectedResponseParamsCount } from "@helpers/schemaData/Booking";
import { brandingSchemaExpectedResponseParamsCount } from "@helpers/schemaData/Branding";
import { messageSchemaExpectedResponseParamsCount } from "@helpers/schemaData/Message";
import { reportSchemaExpectedResponseParamsCount } from "@helpers/schemaData/Report";
import { roomSchemaExpectedResponseParamsCount } from "@helpers/schemaData/Room";
import { stringDateByDays } from "@helpers/date";

/**
 * `Definition:` Validates an **object** against a specified **schema object**
 * @param object - The object to check schemaObject against.
 * @param schemaObject - The schema object name as documented in *_spec3.json.
 * @param docs - The type of docs (e.g. `public`, `internal` or `admin`).
 * @param notReturnedButInSchema - Any defined properties in schema but not returned by Falcon.
 * @param extraParamsReturned - Any undefined properties returned by Falcon; **_create a bug if there are any._**
 */
export async function validateAgainstSchema(
  object: object,
  schemaObject: string,
  docs: string,
  notReturnedButInSchema = [],
  extraParamsReturned = []
) {
  // get keys from the object
  let responseObjectKeys = Object.keys(object);

  // get keys from the docs
  const schema = await schemaParameters(schemaObject, docs);
  let docsObjectKeys = Object.keys(schema);

  /*
    if used - workaround around a bug
    this should not be ok when we have more params in a response than in docs 
    
    filter out extra params from the response params array if any
  */
  if (extraParamsReturned.length > 0) {
    responseObjectKeys = removeItemsFromArray(responseObjectKeys, extraParamsReturned);
  }

  // filter out hidden params from the schema params array if any
  if (notReturnedButInSchema.length > 0) {
    docsObjectKeys = removeItemsFromArray(docsObjectKeys, notReturnedButInSchema);
  }

  // compare object keys (need to be sorted since order differs)
  expect(docsObjectKeys.sort()).toEqual(responseObjectKeys.sort());

  // add a warning if schema object length has been changed based on doc types
  let recordedSchemaResponseParamsCount;
  if (docs === "auth") {
    recordedSchemaResponseParamsCount = authSchemaExpectedResponseParamsCount;
  } else if (docs === "booking") {
    recordedSchemaResponseParamsCount = bookingSchemaExpectedResponseParamsCount;
  } else if (docs === "branding") {
    recordedSchemaResponseParamsCount = brandingSchemaExpectedResponseParamsCount;
  } else if (docs === "message") {
    recordedSchemaResponseParamsCount = messageSchemaExpectedResponseParamsCount;
  } else if (docs === "report") {
    recordedSchemaResponseParamsCount = reportSchemaExpectedResponseParamsCount;
  } else if (docs === "room") {
    recordedSchemaResponseParamsCount = roomSchemaExpectedResponseParamsCount;
  }

  if (docsObjectKeys.length !== recordedSchemaResponseParamsCount[schemaObject] - notReturnedButInSchema.length) {
    addWarning(
      `'${schemaObject}' schema object in '${docs}' docs has been updated. Please, do the following: \n` +
        `- Check if the change is expected \n` +
        `- Update "${test.info().title}" test with appropriate assertions \n` +
        `- Re-run the test from terminal with 'GENERATE_SCHEMA_TRACKING_DATA=true', commit and push generated files \n\n`
    );
  }
}

export async function schemaParameters(schema: string, docs: string) {
  try {
    const apiDocs = JSON.parse(fs.readFileSync(`./${docs}_spec3.json`).toString("utf-8"));

    return apiDocs.components.schemas[schema].properties;
  } catch (e) {
    fail(`The '${schema}' object you passed does not exist in '${docs}' documentation`);
  }
}

export async function updateDocsSchemasParamsCount() {
  const allDocs = ["auth", "booking", "branding", "message", "report", "room"];

  allDocs.forEach((docs) => {
    const apiDocs = JSON.parse(fs.readFileSync(`./${docs}_spec3.json`).toString("utf-8"));
    const schemas = apiDocs.components.schemas;
    const schemaObjects = Object.keys(schemas);

    let data = "";
    data += "// updated on " + stringDateByDays() + "\n\n";
    data += `export const ${docs}SchemaExpectedResponseParamsCount = {\n`;
    schemaObjects.forEach((schema) => {
      data += `  ${schema}: ${Object.keys(schemas[schema].properties).length},\n`;
    });
    data += "};\n";

    try {
      fs.writeFileSync(`./lib/helpers/schemaData/${capitalizeString(docs)}.ts`, data);
    } catch (err) {
      console.error(err);
    }
  });
}
