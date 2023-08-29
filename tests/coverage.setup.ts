import { getEndpointCoverage } from "../lib/helpers/coverage";
import { test as coverage } from "@playwright/test";
import * as fs from "fs";
import { warningsFile } from "@helpers/warnings";
import { updateDocsSchemasParamsCount } from "@helpers/validateAgainstSchema.ts";

coverage("calculate coverage", async () => {
  await getEndpointCoverage("auth");
  await getEndpointCoverage("booking");
  await getEndpointCoverage("room");
  await getEndpointCoverage("branding");
  await getEndpointCoverage("report");
  await getEndpointCoverage("message");

  // delete a warnings file if exists
  if (fs.existsSync(warningsFile)) {
    try {
      await fs.promises.unlink(warningsFile);
    } catch (err) {
      console.error(err);
    }
  }

  // function to generate new files to track documentation objects and their parameters count
  const generateNewFiles = process.env.GENERATE_SCHEMA_TRACKING_DATA;
  if (generateNewFiles === "true") {
    await updateDocsSchemasParamsCount();
  }
});
