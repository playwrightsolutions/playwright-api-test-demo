//COVERAGE_TAG: GET /message/
//COVERAGE_TAG: GET /message/{id}
//COVERAGE_TAG: GET /message/count

import { test, expect } from "@playwright/test";
import { createMessage, message1 } from "@datafactory/message";

test.describe("message/ GET requests", async () => {
  let message;

  test.beforeEach(async ({}) => {
    message = await createMessage();
  });

  test("GET all messages", async ({ request }) => {
    const response = await request.get("/message/");

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.messages[0]).toMatchObject({
      id: 1,
      name: "James Dean",
      subject: "Booking enquiry",
      read: false,
    });
  });

  test("GET a message by id", async ({ request }) => {
    const response = await request.get(`/message/${message.messageid}`);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toEqual(message);
  });

  test("GET current message count", async ({ request }) => {
    const response = await request.get("/message/count");

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(typeof body.count).toBe("number");
    expect(body.count).toBeGreaterThanOrEqual(1);
    // add json schema validation
  });
});
