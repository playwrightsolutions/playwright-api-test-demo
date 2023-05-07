//COVERAGE_TAG: POST /auth/validate

import { test, expect } from "@playwright/test";
import { createToken } from "../../lib/datafactory/auth";
import { isValidDate } from "../../lib/helpers/date";

test.describe("auth/validate POST requests", async () => {
  let token;

  test.beforeEach(async () => {
    token = await createToken();
  });

  test("POST with valid token", async ({ request }) => {
    const response = await request.post(`auth/validate`, {
      data: { token: token },
    });

    expect(response.status()).toBe(200);

    const body = await response.text();
    expect(body).toBe("");
  });

  test("POST with token that doesn't exist", async ({ request }) => {
    const response = await request.post(`auth/validate`, {
      data: { token: "doesntexist" },
    });

    expect(response.status()).toBe(403);

    const body = await response.text();
    expect(body).toBe("");
  });

  test("POST with empty token", async ({ request }) => {
    const response = await request.post(`auth/validate`, {
      data: { token: "" },
    });

    expect(response.status()).toBe(403);

    const body = await response.text();
    expect(body).toBe("");
  });

  test("POST with empty body", async ({ request }) => {
    const response = await request.post(`auth/validate`, {});

    expect(response.status()).toBe(400);

    const body = await response.json();
    expect(isValidDate(body.timestamp)).toBe(true);
    expect(body.status).toBe(400);
    expect(body.error).toBe("Bad Request");
    expect(body.path).toBe(`/auth/validate`);
  });
});
