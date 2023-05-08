import { getEndpointCoverage } from "../lib/helpers/coverage";
import { test as coverage } from "@playwright/test";

coverage("calculate coverage", async () => {
  await getEndpointCoverage("auth");
  await getEndpointCoverage("booking");
  await getEndpointCoverage("room");
  await getEndpointCoverage("branding");
  await getEndpointCoverage("report");
  await getEndpointCoverage("message");
});
