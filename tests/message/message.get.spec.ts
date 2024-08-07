//COVERAGE_TAG: GET /message/
//COVERAGE_TAG: GET /message/{id}
//COVERAGE_TAG: GET /message/count

import { test, expect } from "@fixtures/fixtures";
import { createMessage } from "@datafactory/message";
import { validateJsonSchema } from "@helpers/validateJsonSchema";
import { validateAgainstSchema } from "@helpers/validateAgainstSchema";
import { HttpCodes } from "../../data/global-constans";

test.describe("message/ GET requests @message", async () => {
  let message;

  test.beforeEach(async () => {
    message = await createMessage();
  });

  test("GET all messages @happy", async ({ request }) => {
    const response = await request.get("/message/");

    expect(response.status()).toBe(HttpCodes.HTTP_RESPONSE_OK);
    const body = await response.json();
    expect(body.messages[0]).toMatchObject({
      id: 1,
      name: "James Dean",
      subject: "Booking enquiry",
      read: false,
    });

    await validateJsonSchema("GET_message", "message", body);
    await validateAgainstSchema(body, "Messages", "message");
  });

  test("GET a message by id @happy", async ({ request }) => {
    const response = await request.get(`/message/${message.messageid}`);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toEqual(message);

    await validateJsonSchema("GET_message_id", "message", body);
    await validateAgainstSchema(body, "Message", "message");
  });

  test("GET current message count @happy", async ({ request }) => {
    const response = await request.get("/message/count");

    expect(response.status()).toBe(HttpCodes.HTTP_RESPONSE_OK);
    const body = await response.json();
    expect(body.count).toBeGreaterThan(0);
    expect(body.count).toBeGreaterThanOrEqual(1);

    await validateJsonSchema("GET_message_count", "message", body);
    await validateAgainstSchema(body, "Count", "message");
  });
});
