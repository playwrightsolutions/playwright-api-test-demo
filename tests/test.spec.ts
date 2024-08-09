import { test, expect } from "@fixtures/fixtures";
import { expect as arrayExpect1 } from "@playwright/test";
import {expect as arrayExpect2} from "../expects/customMatchers"

import { HttpCodes } from "../data/global-constans"; // Import the custom matchers definition

test.describe("Custom Assertions", async () => {
  test("with fixtures", async ({ request }) => {
    const response = await request.post(`auth/login`, {});

    expect(response.status()).toBe(HttpCodes.HTTP_RESPONSE_CLIENT_ERROR);

    const body = await response.json();
    expect(String(body.timestamp)).toBeValidDate();

    const dateStr = "2021-01-01";
    expect(dateStr).toBeValidDate();

    const number = 123;
    expect(number).toBeNumber();

    const boolean = true;
    expect(boolean).toBeBoolean();

    const string = "string";
    expect(string).toBeString();

    arrayExpect1([
      HttpCodes.HTTP_RESPONSE_CLIENT_ERROR,
      HttpCodes.HTTP_RESPONSE_ERROR_UN_AUTHERIZED,
      HttpCodes.HTTP_RESPONSE_ERROR_FORBIDDEN,
    ]).toContainEqual(body.status);


    arrayExpect2(body.status).toBeOneOf([
      HttpCodes.HTTP_RESPONSE_CLIENT_ERROR,
      HttpCodes.HTTP_RESPONSE_ERROR_UN_AUTHERIZED,
      HttpCodes.HTTP_RESPONSE_ERROR_FORBIDDEN,
     ]);
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
