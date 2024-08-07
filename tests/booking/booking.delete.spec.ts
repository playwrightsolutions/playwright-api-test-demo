//COVERAGE_TAG: DELETE /booking/{id}

import { test, expect } from "@playwright/test";
import { getBookingSummary, createFutureBooking } from "@datafactory/booking";
import { createRoom } from "@datafactory/room";
import { createHeaders } from "@helpers/createHeaders";
import { HttpCodes } from "../../data/global-constans";

test.describe("booking/{id} DELETE requests @booking", async () => {
  let headers;
  let bookingId;
  let roomId;

  test.beforeAll(async () => {
    headers = await createHeaders();
  });

  test.beforeEach(async () => {
    const room = await createRoom();
    roomId = room.roomid;
    const futureBooking = await createFutureBooking(roomId);
    bookingId = futureBooking.bookingid;
  });

  test("DELETE booking with specific room id: @happy", async ({ request }) => {
    const response = await request.delete(`booking/${bookingId}`, {
      headers: headers,
    });

    expect(response.status()).toBe(HttpCodes.HTTP_PUT_OK);

    const body = await response.text();
    expect(body).toBe("");

    const getBooking = await getBookingSummary(bookingId);
    expect(getBooking.bookings.length).toBe(0);
  });

  test("DELETE booking with an id that doesn't exist", async ({ request }) => {
    const response = await request.delete("booking/999999", {
      headers: headers,
    });

    expect(response.status()).toBe(HttpCodes.HTTP_RESPONSE_RESOURCE_NOT_FOUND);

    const body = await response.text();
    expect(body).toBe("");
  });

  test("DELETE booking id without authentication", async ({ request }) => {
    const response = await request.delete(`booking/${bookingId}`);

    expect(response.status()).toBe(HttpCodes.HTTP_RESPONSE_ERROR_FORBIDDEN);

    const body = await response.text();
    expect(body).toBe("");
  });
});
