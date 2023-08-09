//COVERAGE_TAG: GET /branding/
//COVERAGE_TAG: PUT /branding/

import { test, expect } from "@playwright/test";
import { defaultBranding, updatedBranding } from "@helpers/branding";
import { createHeaders } from "@helpers/createHeaders";

test.describe("branding/ GET requests", async () => {
  const defaultBody = defaultBranding;

  test("GET website branding", async ({ request }) => {
    const response = await request.get("branding");

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toEqual(defaultBody);
  });
});

// This test has the potential to cause other UI tests to fail as this branding endpoint is a critical part of the entire UI of the website
test.describe("branding/ PUT requests", async () => {
  const defaultBody = defaultBranding;
  const updatedBody = updatedBranding;
  let headers;

  test.beforeAll(async ({ request }) => {
    headers = await createHeaders();
  });

  test.afterEach(async ({ request }) => {
    await request.put("branding/", {
      headers: headers,
      data: defaultBody,
    });
  });

  test("PUT website branding", async ({ request }) => {
    const response = await request.put("branding/", {
      headers: headers,
      data: updatedBody,
    });

    expect(response.status()).toBe(202);
    const body = await response.json();
    expect(body).toEqual(updatedBody);
  });
});
