//COVERAGE_TAG: POST /auth/logout

import { test, expect } from "@playwright/test";
import { createToken } from "@datafactory/auth";
import { HttpCodes } from "../../data/global-constans";

test.describe("auth/logout POST requests @auth", async () => {
  let token: string;

  test.beforeEach(async () => {
    token = await createToken();
  });

  test("POST with valid token @happy", async ({ request }) => {
    const response = await request.post(`auth/logout`, {
      data: { token: token },
    });

    expect(response.status()).toBe(HttpCodes.HTTP_RESPONSE_OK);

    const body = await response.text();
    expect(body).toBe("");
  });

  test("POST with token that doesn't exist", async ({ request }) => {
    const response = await request.post(`auth/logout`, {
      data: { token: "doesntexist" },
    });

    expect(response.status()).toBe(HttpCodes.HTTP_RESPONSE_RESOURCE_NOT_FOUND);

    const body = await response.text();
    expect(body).toBe("");
  });

  test("POST with valid token then attempt to validate @happy", async ({ request }) => {
    const response = await request.post(`auth/logout`, {
      data: { token: token },
    });

    expect(response.status()).toBe(HttpCodes.HTTP_RESPONSE_OK);

    const body = await response.text();
    expect(body).toBe("");

    const validateResponse = await request.post(`auth/validate`, {
      data: { token: token },
    });

    expect(validateResponse.status()).toBe(HttpCodes.HTTP_RESPONSE_ERROR_FORBIDDEN);

    const validateBody = await validateResponse.text();
    expect(validateBody).toBe("");
  });
});
