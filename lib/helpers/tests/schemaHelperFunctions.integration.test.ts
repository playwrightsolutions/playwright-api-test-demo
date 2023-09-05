import { createJsonSchema, writeJsonFile } from "@helpers/schemaHelperFunctions";
import * as fs from "fs/promises";

describe("schemaHelperFunctions Integration Tests", () => {
  describe("writeJsonFile", () => {
    const inputFile = "lib/helpers/tests/fake.json";

    afterAll(() => {
      fs.unlink(inputFile);
    });

    test("writeJsonFile should write data properly to the given path", async () => {
      const mockedData = JSON.stringify({ some: "MockedField" });

      await writeJsonFile(inputFile, mockedData);

      const data = await fs.readFile(inputFile, { encoding: "utf8" });
      expect(data).toBe(mockedData);
    });
  });
  describe("createJsonSchema", () => {
    const endpointDir = "mocked_endpoint";
    const endpointFullPath = `.api/${endpointDir}`;
    const schemaName = "get_mocked";

    beforeAll(() => {
      fs.mkdir(endpointFullPath);
    });

    afterAll(() => {
      fs.rm(endpointFullPath, { recursive: true, force: true });
    });

    test("should create and write a new schema file to the endpoints directory", async () => {
      const endpointSchemaExpectedPath = `${endpointFullPath}/${schemaName}_schema.json`;
      const mockedData = { some: "MockedField" };
      const expected = {
        type: "object",
        properties: {
          some: {
            type: "string",
          },
        },
        required: ["some"],
      };

      await createJsonSchema(schemaName, endpointDir, mockedData);

      const data = await fs.readFile(endpointSchemaExpectedPath, { encoding: "utf8" });

      expect(JSON.parse(data)).toEqual(expected);
    });
  });
});
