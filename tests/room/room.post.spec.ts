//COVERAGE_TAG: POST /room/

import { createRandomRoomBody } from "@datafactory/room";
import { createHeaders } from "@helpers/createHeaders";
import { validateAgainstSchema } from "@helpers/validateAgainstSchema";
import { validateJsonSchema } from "@helpers/validateJsonSchema";
import { test, expect } from "@fixtures/fixtures";

test.describe("room/ POST requests @room", async () => {
  let authHeaders;
  let updateRoomBody;

  test.beforeEach(async () => {
    authHeaders = await createHeaders();
    updateRoomBody = await createRandomRoomBody();
  });

  test("POST /room to create a room @happy", async ({ request }) => {
    const response = await request.post(`/room/`, {
      headers: authHeaders,
      data: updateRoomBody,
    });

    expect(response.status()).toBe(201);
    const body = await response.json();

    expect(body.roomid).toBeNumber();
    expect(body.name).toEqual(updateRoomBody.name);
    expect(body.accessible).toEqual(updateRoomBody.accessible);
    expect(body.description).toEqual(updateRoomBody.description);
    expect(body.features).toEqual(updateRoomBody.features);
    expect(body.image).toEqual(updateRoomBody.image);
    expect(body.roomName).toEqual(updateRoomBody.roomName);
    expect(body.type).toEqual(updateRoomBody.type);

    await validateJsonSchema("POST_room", "room", body);
    await validateAgainstSchema(body, "Room", "room");
  });
});
