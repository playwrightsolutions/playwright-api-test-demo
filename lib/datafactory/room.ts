import { expect, request } from "@playwright/test";
import { faker } from "@faker-js/faker";
import { createHeaders } from "../helpers/createHeaders";

let url = process.env.URL || "https://automationintesting.online/";

export async function createRandomRoomBody(
  roomName?: string,
  roomPrice?: number
) {
  let roomType = ["Single", "Double", "Twin"];
  let features = ["TV", "WiFi", "Safe", "Mini Bar", "Tea/Coffee", "Balcony"];

  let roomBody = {
    roomName: roomName || faker.random.numeric(3),
    type: roomType[Math.floor(Math.random() * roomType.length)], // returns a random value from the array
    accessible: Math.random() < 0.5, //returns true or false
    image: faker.image.imageUrl(500, 500, "cat", true),
    description: faker.hacker.phrase(),
    features: features.sort(() => 0.5 - Math.random()).slice(0, 3), // returns 3 random values from the array
    roomPrice: roomPrice || faker.random.numeric(3),
  };

  return roomBody;
}

/**
 * This function will create a room with provided name and a price
 *
 * @param roomName: string for the room to create
 * @param roomPrice: number for the price of the room
 * @returns the body of the room just created with a unique roomid in the response
 *
 * @example
 * let room = await createRoom("My Room", 100);
 * let roomId = room.roomid;
 */
export async function createRoom(roomName?: string, roomPrice?: number) {
  let body;
  let headers = await createHeaders();

  let roomBody = await createRandomRoomBody(roomName, roomPrice);

  const createRequestContext = await request.newContext();
  const response = await createRequestContext.post(url + "room/", {
    headers: headers,
    data: roomBody,
  });

  expect(response.status()).toBe(201);
  body = await response.json();

  return body;
}
