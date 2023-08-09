//COVERAGE_TAG: PUT /message/{id}/read

import { createMessage } from "@datafactory/message";
import { createHeaders } from "@helpers/createHeaders";
import { test, expect } from "@playwright/test";

test.describe("message/ PUT requests", async () => {
  let message;
  let authHeaders;

  test.beforeEach(async ({}) => {
    message = await createMessage();
    authHeaders = await createHeaders();
  });

  test("PUT a message as read", async ({ request }) => {
    const response = await request.put(`/message/${message.messageid}/read`, {
      headers: authHeaders,
      data: "",
    });

    expect(response.status()).toBe(202);
    const body = await response.text();
    expect(body).toEqual("");

    //get the message again and check it's read
    const response2 = await request.get("/message/");
    expect(response2.status()).toBe(200);
    const body2 = await response2.json();

    const match = body2.messages.find((item) => item.id === message.messageid);

    expect(match).toBeDefined();
    expect(match.read).toBe(true);
  });
});
