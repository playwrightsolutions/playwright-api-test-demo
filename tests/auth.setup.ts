// auth.setup.ts
// This is currently not active but can be made active through the playwright.config.ts
// The below is an example of how you can save your storage state to a file in the .auth directory

import { test as setup } from "@playwright/test";

let username = process.env.ADMIN_NAME;
let password = process.env.ADMIN_PASSWORD;
const authFile = ".auth/admin.json";

setup("authenticate", async ({ request, baseURL }) => {
  await request.post(baseURL + "auth/login", {
    data: {
      username: username,
      password: password,
    },
  });
  await request.storageState({ path: authFile });
});
