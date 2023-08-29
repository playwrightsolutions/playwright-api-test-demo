//COVERAGE_TAG: GET /room/
//COVERAGE_TAG: GET /room/{id}

import { createRoom, defaultRoom } from "@datafactory/room";
import { createAssertions } from "@helpers/createAssertions"; // eslint-disable-line
import { validateAgainstSchema } from "@helpers/validateAgainstSchema.ts";
import { validateJsonSchema } from "@helpers/validateJsonSchema";
import { test, expect } from "@playwright/test";

test.describe("room/ GET requests", async () => {
  let room;
  let roomId;

  test.beforeEach(async () => {
    room = await createRoom("GET", 50);
    roomId = room.roomid;
  });

  test("GET all rooms", async ({ request }) => {
    const response = await request.get("/room/");

    expect(response.status()).toBe(200);
    const body = await response.json();

    // Find the room object with created RoomId out if array of rooms to run deeper assertions against
    let roomToAssertAgainst;

    for (const room of body.rooms) {
      if (room.roomid === roomId) {
        roomToAssertAgainst = room;
        break;
      }
    }

    expect(roomToAssertAgainst).toMatchObject(room);

    // get first room in the array and assert against the default room information
    const firstRoom = body.rooms[0];
    expect(firstRoom).toMatchObject(defaultRoom);

    // this set of assertions is doing the same thing as the expect above
    expect(firstRoom.roomid).toBe(1);
    expect(firstRoom.roomName).toBe("101");
    expect(firstRoom.type).toBe("single");
    expect(firstRoom.image).toBe("https://www.mwtestconsultancy.co.uk/img/testim/room2.jpg");
    expect(firstRoom.description).toBe(
      "Aenean porttitor mauris sit amet lacinia molestie. In posuere accumsan aliquet. Maecenas sit amet nisl massa. Interdum et malesuada fames ac ante."
    );
    expect(firstRoom.features).toEqual(["TV", "WiFi", "Safe"]);
    expect(firstRoom.roomPrice).toBe(100);

    // We loop through each room in the array and assert against the type of each property
    body.rooms.forEach((room) => {
      expect(typeof room.roomid).toBe("number");
      expect(typeof room.roomName).toBe("string");
      expect(typeof room.type).toBe("string");
      expect(typeof room.image).toBe("string");
      expect(typeof room.description).toBe("string");
      expect(typeof room.features).toBe("object");
      expect(typeof room.roomPrice).toBe("number");
    });

    await validateJsonSchema("GET_room", "room", body);
    await validateAgainstSchema(body, "Rooms", "room");
  });

  test("GET a room by id", async ({ request }) => {
    const response = await request.get(`/room/${roomId}`);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body).toEqual(room);

    await validateJsonSchema("GET_room_id", "room", body);
    await validateAgainstSchema(body, "Room", "room");
  });
});
