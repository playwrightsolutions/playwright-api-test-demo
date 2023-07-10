//COVERAGE_TAG: POST /auth/login

import { test, expect } from "@playwright/test";
import { isValidDate } from "@helpers/date";

test.describe("auth/login POST requests", async () => {
  let username = process.env.ADMIN_NAME;
  let password = process.env.ADMIN_PASSWORD;

  test("POST with valid credentials", async ({ request }) => {
    const response = await request.post(`auth/login`, {
      data: {
        username: username,
        password: password,
      },
    });

    expect(response.status()).toBe(200);

    const body = await response.text();
    expect(body).toBe("");
    expect(response.headers()["set-cookie"]).toContain("token=");
  });

  test("POST with invalid username and password", async ({ request }) => {
    const response = await request.post(`auth/login`, {
      data: {
        username: "invalidUsername",
        password: "invalidPassword",
      },
    });

    expect(response.status()).toBe(403);

    const body = await response.text();
    expect(body).toBe("");
  });

  test("POST with valid username and invalid password", async ({ request }) => {
    const response = await request.post(`auth/login`, {
      data: {
        username: username,
        password: "invalidPassword",
      },
    });

    expect(response.status()).toBe(403);

    const body = await response.text();
    expect(body).toBe("");
  });

  test("POST with invalid username and valid password", async ({ request }) => {
    const response = await request.post(`auth/login`, {
      data: {
        username: "invalidUsername",
        password: password,
      },
    });

    expect(response.status()).toBe(403);

    const body = await response.text();
    expect(body).toBe("");
  });

  test("POST with no username and valid password", async ({ request }) => {
    const response = await request.post(`auth/login`, {
      data: {
        password: password,
      },
    });

    expect(response.status()).toBe(403);

    const body = await response.text();
    expect(body).toBe("");
  });

  test("POST with empty body", async ({ request }) => {
    const response = await request.post(`auth/login`, {
      data: {},
    });

    expect(response.status()).toBe(403);

    const body = await response.text();
    expect(body).toBe("");
  });

  test("POST with no body", async ({ request }) => {
    const response = await request.post(`auth/login`, {});

    expect(response.status()).toBe(400);

    const body = await response.json();
    expect(isValidDate(body.timestamp)).toBe(true);
    expect(body.status).toBe(400);
    expect(body.error).toBe("Bad Request");
    expect(body.path).toBe(`/auth/login`);
  });

  test("POST with valid credentials then validate with token", async ({
    request,
  }) => {
    const response = await request.post(`auth/login`, {
      data: {
        username: username,
        password: password,
      },
    });

    expect(response.status()).toBe(200);

    const body = await response.text();
    expect(body).toBe("");
    const headers = response.headers();
    let tokenString = headers["set-cookie"].split(";")[0];
    let token = tokenString.split("=")[1];

    const validateResponse = await request.post(`auth/validate`, {
      data: { token: token },
    });

    expect(validateResponse.status()).toBe(200);

    const validateBody = await validateResponse.text();
    expect(validateBody).toBe("");
  });
});
