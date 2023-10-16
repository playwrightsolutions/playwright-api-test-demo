import { test, expect } from "@fixtures/fixtures"; // Import the custom matchers definition

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

    expect(body.status).toBeOneOfValues([400, 401, 403]);
    expect(body.status).toBeOneOfTypes(["number", "null"]);
  });
});
