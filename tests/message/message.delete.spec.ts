//COVERAGE_TAG: DELETE /message/{id}

import { createMessage } from "@datafactory/message";
import { createHeaders } from "@helpers/createHeaders";
import { test, expect } from "@playwright/test";
import { HttpCodes } from "../../data/global-constans";

test.describe("message/ DELETE requests @message", async () => {
  let message;
  let authHeaders;

  test.beforeEach(async () => {
    message = await createMessage();
    authHeaders = await createHeaders();
  });

  test("DELETE a message", async ({ request }) => {
    const response = await request.delete(`/message/${message.messageid}`, {
      headers: authHeaders,
      data: "",
    });

    expect(response.status()).toBe(HttpCodes.HTTP_PUT_OK);
    const body = await response.text();
    expect(body).toEqual("");

    //check the message again and ensure it's not available
    const response2 = await request.get(`/message/${message.messageid}`);
    expect(response2.status()).toBe(HttpCodes.HTTP_RESPONSE_SERVER_INTERNAL_ERROR);
    const body2 = await response2.json();
    expect(body2.error).toEqual("Internal Server Error");
  });
});
