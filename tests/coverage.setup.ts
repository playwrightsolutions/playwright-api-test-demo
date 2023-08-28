import { getEndpointCoverage } from "../lib/helpers/coverage";
import { test as coverage } from "@playwright/test";
import * as fs from "fs";
import { warningsFile } from "@helpers/warnings";

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
});
