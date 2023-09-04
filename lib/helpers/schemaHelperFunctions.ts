import { createSchema } from "genson-js";
import * as fs from "fs/promises";

export async function createJsonSchema(name: string, path: string, json: object) {
  const filePath = `./.api/${path}`;

  try {
    await fs.mkdir(filePath, { recursive: true });

    const schema = createSchema(json);
    const schemaString = JSON.stringify(schema, null, 2);
    const schemaFilePath = `.api/${path}/${name}_schema.json`;

    await writeJsonFile(schemaFilePath, schemaString);

    console.log("JSON Schema created and saved.");
  } catch (err) {
    console.error(err);
  }
}

export async function writeJsonFile(location: string, data: string) {
  try {
    await fs.writeFile(location, data);
  } catch (err) {
    console.error(err);
  }
}
