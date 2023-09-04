import { createJsonSchema, writeJsonFile } from "@helpers/schemaHelperFunctions";
import * as fs from "fs/promises";
import { Schema, createSchema } from "genson-js";

jest.mock("fs/promises");
jest.mock("genson-js");

describe("schemaHelperFunctions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  describe("writeJsonFile", () => {
    test("should call fs.writeFile with given filePath and Data", async () => {
      const inputFile = "mocked/input/path.json";
      const mockedData = JSON.stringify({ someMocked: "MockedField" });

      await writeJsonFile(inputFile, mockedData);

      expect(fs.writeFile).toBeCalledWith(inputFile, mockedData);
    });
  });
  describe("createJsonSchema", () => {
    const createSchemaMock = jest.mocked(createSchema);
    test("should create schema using createSchema from genson-js and write file using fs/promises", async () => {
      const endpointPath = "mocked_endpoint";
      const schemaFile = "get_mocked";
      const expectedFullPath = ".api/mocked_endpoint/get_mocked_schema.json";
      const mockedData = { someMocked: "MockedField" };
      const mockedSchema = {
        type: "object",
        properties: {
          someMocked: {
            type: "string",
          },
        },
        required: ["someMocked"],
      } as Schema;
      createSchemaMock.mockReturnValueOnce(mockedSchema);
      const expectedSchemaJsonContent = JSON.stringify(mockedSchema, null, 2);

      await createJsonSchema(schemaFile, endpointPath, mockedData);

      expect(createSchema).toBeCalledWith(mockedData);
      expect(fs.writeFile).toBeCalledWith(expectedFullPath, expectedSchemaJsonContent);
    });
  });
});
