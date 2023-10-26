//COVERAGE_TAG: DELETE /room/{id}

import { createRoom } from "@datafactory/room";
import { createHeaders } from "@helpers/createHeaders";
import { test, expect } from "@playwright/test";

test.describe("room/ DELETE requests @room", async () => {
  let room;
  let roomId;
  let authHeaders;

  test.beforeEach(async () => {
    room = await createRoom("DELETE", 50);
    roomId = room.roomid;
    authHeaders = await createHeaders();
  });

  test("DELETE a room", async ({ request }) => {
    const response = await request.delete(`/room/${roomId}`, {
      headers: authHeaders,
      data: "",
    });

    expect(response.status()).toBe(202);
    const body = await response.text();
    expect(body).toEqual("");

    //check the message again and ensure it's not available
    const response2 = await request.get(`/room/${roomId}`);
    expect(response2.status()).toBe(500);
    const body2 = await response2.json();
    expect(body2.error).toEqual("Internal Server Error");
  });
});
