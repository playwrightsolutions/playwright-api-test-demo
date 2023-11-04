//COVERAGE_TAG: POST /auth/logout

import { test, expect } from "@playwright/test";
import { createToken } from "@datafactory/auth";

test.describe("auth/logout POST requests @auth", async () => {
  let token;

  test.beforeEach(async () => {
    token = await createToken();
  });

  test("POST with valid token @happy", async ({ request }) => {
    const response = await request.post(`auth/logout`, {
      data: { token: token },
    });

    expect(response.status()).toBe(200);

    const body = await response.text();
    expect(body).toBe("");
  });

  test("POST with token that doesn't exist", async ({ request }) => {
    const response = await request.post(`auth/logout`, {
      data: { token: "doesntexist" },
    });

    expect(response.status()).toBe(404);

    const body = await response.text();
    expect(body).toBe("");
  });

  test("POST with valid token then attempt to validate @happy", async ({ request }) => {
    const response = await request.post(`auth/logout`, {
      data: { token: token },
    });

    expect(response.status()).toBe(200);

    const body = await response.text();
    expect(body).toBe("");

    const validateResponse = await request.post(`auth/validate`, {
      data: { token: token },
    });

    expect(validateResponse.status()).toBe(403);

    const validateBody = await validateResponse.text();
    expect(validateBody).toBe("");
  });
});
