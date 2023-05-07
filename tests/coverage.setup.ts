import {
  fetchOpenApi,
  getEndpoints,
  getCoverage,
} from "../lib/helpers/coverage";
import { test as coverage } from "@playwright/test";

coverage("calculate coverage", async () => {
  // Auth Endpoints
  console.log("=== Coverage for Auth Endpoints ===");
  let auth = await fetchOpenApi("auth");
  let coverageArrayAuth = getEndpoints(auth);
  getCoverage(coverageArrayAuth);

  // Booking Endpoints
  console.log("=== Coverage for Booking Endpoints ===");
  let booking = await fetchOpenApi("booking");
  let coverageArrayBooking = getEndpoints(booking);
  getCoverage(coverageArrayBooking);

  // Room Endpoints
  console.log("=== Coverage for Room Endpoints ===");
  let room = await fetchOpenApi("room");
  let coverageArrayRoom = getEndpoints(room);
  getCoverage(coverageArrayRoom);

  // Branding Endpoints
  console.log("=== Coverage for Branding Endpoints ===");
  let branding = await fetchOpenApi("branding");
  let coverageArrayBranding = getEndpoints(branding);
  getCoverage(coverageArrayBranding);

  // Report Endpoints
  console.log("=== Coverage for Report Endpoints ===");
  let report = await fetchOpenApi("report");
  let coverageArrayReport = getEndpoints(report);
  getCoverage(coverageArrayReport);

  // Message Endpoints
  console.log("=== Coverage for Message Endpoints ===");
  let message = await fetchOpenApi("message");
  let coverageArrayMessage = getEndpoints(message);
  getCoverage(coverageArrayMessage);
});
