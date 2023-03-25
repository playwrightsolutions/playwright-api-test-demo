import { test, expect } from "@playwright/test";
import { auth } from "../../lib/datafactory/auth";
import {
  getBookingSummary,
  createFutureBooking,
  futureOpenCheckinDate,
} from "../../lib/datafactory/booking";

test.describe("booking/{id} DELETE requests", async () => {
  let cookies;
  let bookingId;
  let roomId = 1;

  test.beforeEach(async () => {
    cookies = await auth("admin", "password");

    // Get Future checkin Date, Create a booking with available checkin date
    let futureBooking = await createFutureBooking(roomId);
    bookingId = futureBooking.bookingid;
  });

  test(`DELETE booking with specific room id: ${bookingId}`, async ({
    request,
  }) => {
    const response = await request.delete(`booking/${bookingId}`, {
      headers: { cookie: cookies },
    });

    expect(response.status()).toBe(202);
    const body = await response.text();
    expect(body).toBe("");

    // const getBooking = await request.get(`booking/summary?roomid=${bookingId}`);
    const getBooking = await getBookingSummary(bookingId);
    expect(getBooking.bookings.length).toBe(0);
  });

  test("DELETE booking with an id that doesn't exist", async ({ request }) => {
    const response = await request.delete("booking/999999", {
      headers: { cookie: cookies },
    });

    expect(response.status()).toBe(404);
    const body = await response.text();
    expect(body).toBe("");
  });

  test(`DELETE booking id ${bookingId} without authentication`, async ({
    request,
  }) => {
    const response = await request.delete(`booking/${bookingId}`);

    expect(response.status()).toBe(403);
    const body = await response.text();
    expect(body).toBe("");
  });
});
