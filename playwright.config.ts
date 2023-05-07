import { defineConfig, devices } from "@playwright/test";
import { config } from "dotenv";

config();

export default defineConfig({
  // Keeping this section commented out due to using storage state will make all api calls succeed (even the negative test scenarios)
  // projects: [
  //   { name: "setup", testMatch: /.*\.setup\.ts/ },
  //   {
  //     name: "api-checks",
  //     use: {
  //       storageState: ".auth/admin.json",
  //     },
  //     dependencies: ["setup"],
  //   },
  // ],
  projects: [
    { name: "setup", testMatch: /.*\overage.setup\.ts/ },
    {
      name: "api-checks",
      dependencies: ["setup"],
    },
  ],

  use: {
    extraHTTPHeaders: {
      "playwright-solutions": "true",
    },
    baseURL: process.env.URL,
    ignoreHTTPSErrors: true,
    trace: "on",
  },
  retries: 0,
  reporter: [["list"], ["html"]],
});
