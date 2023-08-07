//COVERAGE_TAG: PUT /room/{id}

import { createRoom, createRandomRoomBody } from "@datafactory/room";
import { createHeaders } from "@helpers/createHeaders";
import { randomRoomFeaturesCount } from "@helpers/roomFeatures";
import { test, expect } from "@playwright/test";

test.describe("room/ PUT requests", async () => {
  let room;
  let roomId;
  let authHeaders;
  let updateRoomBody;

  test.beforeEach(async () => {
    room = await createRoom("PUT", 50);
    roomId = room.roomid;
    authHeaders = await createHeaders();
    updateRoomBody = await createRandomRoomBody();
  });

  test("PUT /room to update values", async ({ request }) => {
    const response = await request.put(`/room/${roomId}`, {
      headers: authHeaders,
      data: updateRoomBody,
    });

    expect(response.status()).toBe(202);
    const body = await response.json();

    expect(body.roomid).toEqual(roomId);
    expect(body.name).toEqual(updateRoomBody.name);
    expect(body.accessible).toEqual(updateRoomBody.accessible);
    expect(body.description).toEqual(updateRoomBody.description);
    expect(body.features).toEqual(updateRoomBody.features);
    expect(body.image).toEqual(updateRoomBody.image);
    expect(body.roomName).toEqual(updateRoomBody.roomName);
    expect(body.type).toEqual(updateRoomBody.type);
  });

  test("PUT /room to update features", async ({ request }) => {
    const randomFeatures = randomRoomFeaturesCount(10);

    // Overwrites the features array with random features
    updateRoomBody.features = randomFeatures;

    const response = await request.put(`/room/${roomId}`, {
      headers: authHeaders,
      data: updateRoomBody,
    });

    expect(response.status()).toBe(202);
    const body = await response.json();

    expect(body.roomid).toEqual(roomId);
    expect(body.name).toEqual(updateRoomBody.name);
    expect(body.accessible).toEqual(updateRoomBody.accessible);
    expect(body.description).toEqual(updateRoomBody.description);
    expect(body.features).toEqual(randomFeatures);
    expect(body.image).toEqual(updateRoomBody.image);
    expect(body.roomName).toEqual(updateRoomBody.roomName);
    expect(body.type).toEqual(updateRoomBody.type);
  });
});
