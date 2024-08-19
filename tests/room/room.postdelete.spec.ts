//COVERAGE_TAG: POST /room/

import { createRoom } from "@datafactory/room";
import { createHeaders } from "@helpers/createHeaders";

import { test, expect } from "@fixtures/fixtures";
import { HttpCodes } from "../../data/global-constans";

let room;
let roomId;
let authHeaders;

test.beforeEach(async () => {
  room = await createRoom("DELETE", 100);
  roomId = room.roomid;
  authHeaders = await createHeaders();
});

test("DELETE a room", async ({ request }) => {
  const response = await request.delete(`/room/${roomId}`, {
    headers: authHeaders,
    data: "",
  });

  expect(response.status()).toBe(HttpCodes.HTTP_PUT_OK);
  const body = await response.text();
  expect(body).toEqual("");

  //check the message again and ensure it's not available
  const response2 = await request.get(`/room/${roomId}`);
  expect(response2.status()).toBe(HttpCodes.HTTP_RESPONSE_SERVER_INTERNAL_ERROR);
  const body2 = await response2.json();
  expect(body2.error).toEqual("Internal Server Error");
});
