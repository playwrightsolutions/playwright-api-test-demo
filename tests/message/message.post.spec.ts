// COVERAGE_TAG: POST /message/

import { newMessageBody } from "@datafactory/message";
import { validateAgainstSchema } from "@helpers/validateAgainstSchema";
import { validateJsonSchema } from "@helpers/validateJsonSchema";
import { test, expect } from "@playwright/test";

test.describe("message/ POST requests @message", async () => {
  const message = await newMessageBody();

  test("POST a message @happy", async ({ request }) => {
    const response = await request.post("/message/", {
      data: message,
    });

    expect(response.status()).toBe(201);
    const body = await response.json();
    expect(body.messageid).toBeGreaterThan(1);
    expect(body.name).toBe(message.name);
    expect(body.email).toBe(message.email);
    expect(body.phone).toBe(message.phone);
    expect(body.subject).toBe(message.subject);
    expect(body.description).toBe(message.description);

    await validateJsonSchema("POST_message", "message", body);
    await validateAgainstSchema(body, "Message", "message");
  });
});
