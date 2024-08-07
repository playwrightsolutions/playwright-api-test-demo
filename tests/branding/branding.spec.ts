//COVERAGE_TAG: GET /branding/
//COVERAGE_TAG: PUT /branding/

import { test, expect } from "@playwright/test";
import { defaultBranding, defaultBrandingShortLogo, updatedBranding } from "@helpers/branding";
import { createHeaders } from "@helpers/createHeaders";
import { validateJsonSchema } from "@helpers/validateJsonSchema";
import { validateAgainstSchema } from "@helpers/validateAgainstSchema";
import { HttpCodes } from "../../data/global-constans";

test.describe("branding/ GET requests @branding", async () => {
  const defaultBodyShort = defaultBrandingShortLogo;

  test("GET website branding @happy", async ({ request }) => {
    const response = await request.get("branding");

    expect(response.status()).toBe(HttpCodes.HTTP_RESPONSE_OK);
    const body = await response.json();
    expect(body).toEqual(defaultBodyShort);

    await validateJsonSchema("GET_branding", "branding", body);
    await validateAgainstSchema(body, "Branding", "branding");
    await validateAgainstSchema(body.contact, "Contact", "branding");
    await validateAgainstSchema(body.map, "Map", "branding");
  });
});

// This test has the potential to cause other UI tests to fail as this branding endpoint is a critical part of the entire UI of the website
test.describe("branding/ PUT requests", async () => {
  const defaultBody = defaultBranding;
  const updatedBody = updatedBranding;
  let headers;

  test.beforeAll(async () => {
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

    expect(response.status()).toBe(HttpCodes.HTTP_PUT_OK);
    const body = await response.json();
    expect(body).toEqual(updatedBody);

    await validateJsonSchema("PUT_branding", "branding", body);
    await validateAgainstSchema(body, "Branding", "branding");
  });
});
