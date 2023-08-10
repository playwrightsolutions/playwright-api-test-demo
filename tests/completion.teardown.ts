import { warningsFile } from "@helpers/warnings";
import { test as teardown } from "@playwright/test";
import * as fs from "fs";

teardown("Print warnings", async () => {
  // read the file and console.log the result
  try {
    const data = fs.readFileSync(warningsFile, "utf8");
    console.log(data);
  } catch (err) {
    null;
  }
});
