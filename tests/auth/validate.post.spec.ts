//COVERAGE_TAG: POST /auth/validate

import { test, expect } from "@fixtures/fixtures";
import { createToken } from "@datafactory/auth";
import { HttpCodes } from "../../data/global-constans";

test.describe("auth/validate POST requests @auth", async () => {
  let token;

  test.beforeEach(async () => {
    token = await createToken();
  });

  test("POST with valid token @happy", async ({ request }) => {
    const response = await request.post(`auth/validate`, {
      data: { token: token },
    });

    expect(response.status()).toBe(HttpCodes.HTTP_RESPONSE_OK);

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

    expect(body.timestamp).toBeValidDate();
    expect(body.status).toBe(400);
    expect(body.error).toBe("Bad Request");
    expect(body.path).toBe(`/auth/validate`);
  });
});
