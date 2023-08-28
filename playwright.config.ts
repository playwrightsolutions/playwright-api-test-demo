import { defineConfig } from "@playwright/test";
import { config } from "dotenv";
import Env from "@helpers/env";

/* This allows you to pass in a `test_env` environment variable 
to specify which environment you want to run the tests against */
if (process.env.test_env) {
  config({
    path: `.env.${process.env.test_env}`,
    override: true,
  });
} else {
  config();
}

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
    { name: "setup", testMatch: /coverage.setup.ts/ },
    {
      name: "api-checks",
      dependencies: ["setup"],
    },
    {
      name: "teardown",
      dependencies: ["setup", "api-checks"],
      testMatch: /completion.teardown.ts/,
    },
  ],

  use: {
    extraHTTPHeaders: {
      "playwright-solutions": "true",
    },
    baseURL: Env.URL,
    ignoreHTTPSErrors: true,
    trace: "on",
  },
  retries: 2,
  reporter: [["list"], ["html"]],
});
