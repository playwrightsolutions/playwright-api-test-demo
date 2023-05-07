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
  use: {
    baseURL: process.env.URL,
    ignoreHTTPSErrors: true,
    trace: "retain-on-failure",
  },
  retries: 0,
  reporter: [["list"], ["html"]],
});
