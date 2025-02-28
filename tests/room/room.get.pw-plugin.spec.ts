import { test, expect } from "@playwright/test";
import { apiGet } from "pw-api-plugin";

test.describe("room/ GET requests with pw-plugin", () => {
  test("GET all rooms", async ({ request, page }, testInfo) => {
    testInfo.annotations.push({
      type: "implementation",
      description: "https://www.npmjs.com/package/pw-api-plugin",
    });

    const responseGet = await apiGet({ request, page }, `https://automationintesting.online/room/`);

    expect(responseGet.status()).toBe(200);
    const responseBodyGet = await responseGet.json();
    const firstRoom = responseBodyGet.rooms[0];
    expect(firstRoom.roomid).toBe(1);
    expect(firstRoom.roomName).toBe("101");
    expect(firstRoom.type).toBe("single");
    expect(firstRoom.image).toBe("/images/room2.jpg");
  });
});
