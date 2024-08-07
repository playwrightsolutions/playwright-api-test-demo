import { test, expect } from "@fixtures/fixtures";
import { HttpCodes } from "../data/global-constans"; // Import the custom matchers definition

test.describe("Custom Assertions", async () => {
  test("with fixtures", async ({ request }) => {
    const response = await request.post(`auth/login`, {});

    expect(response.status()).toBe(400);

    const body = await response.json();
    expect(body.timestamp).toBeValidDate();

    const dateStr = "2021-01-01";
    expect(dateStr).toBeValidDate();

    const number = 123;
    expect(number).toBeNumber();

    const boolean = true;
    expect(boolean).toBeBoolean();

    const string = "string";
    expect(string).toBeString();

    expect(body.status).toBe([
      HttpCodes.HTTP_RESPONSE_CLIENT_ERROR,
      HttpCodes.HTTP_RESPONSE_ERROR_UN_AUTHERIZED,
      HttpCodes.HTTP_RESPONSE_ERROR_FORBIDDEN,
    ]);
    expect(body.status).toBeOneOfTypes(["number", "null"]);
  });

  test("flake test @unsatisfactory", async ({ request }) => {
    await request.post(`auth/login`, {});

    const randomBoolean = Math.random() > 0.5;
    expect(randomBoolean).toBe(true);
  });

  test("1 flake test @happy @unsatisfactory", async ({ request }) => {
    await request.post(`auth/login`, {});

    const randomBoolean = Math.random() > 0.5;
    expect(randomBoolean).toBe(true);
  });

  test("2 flakey test @unsatisfactory", async ({ request }) => {
    await request.post(`auth/login`, {});

    const randomBoolean = Math.random() > 0.5;
    expect(randomBoolean).toBe(true);
  });

  test("3 flakey test @unsatisfactory", async ({ request }) => {
    await request.post(`auth/login`, {});

    const randomBoolean = Math.random() > 0.5;
    expect(randomBoolean).toBe(true);
  });

  test("4 flakey test @unsatisfactory", async ({ request }) => {
    await request.post(`auth/login`, {});

    const randomBoolean = Math.random() > 0.5;
    expect(randomBoolean).toBe(true);
  });
});
