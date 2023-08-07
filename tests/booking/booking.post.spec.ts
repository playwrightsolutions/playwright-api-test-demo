//COVERAGE_TAG: POST /booking/

import { test, expect } from "@playwright/test";
import {
  createRandomBookingBody,
  futureOpenCheckinDate,
} from "@datafactory/booking";
import { stringDateByDays } from "@helpers/date";
import { createRoom } from "@datafactory/room";

test.describe("booking/ POST requests", async () => {
  let requestBody;
  let roomId;

  test.beforeEach(async () => {
    const room = await createRoom();
    roomId = room.roomid;

    const futureCheckinDate = await futureOpenCheckinDate(roomId);
    const checkInString = futureCheckinDate.toISOString().split("T")[0];
    const checkOutString = stringDateByDays(futureCheckinDate, 2);

    requestBody = await createRandomBookingBody(
      roomId,
      checkInString,
      checkOutString
    );
  });

  test("POST new booking with full body", async ({ request }) => {
    const response = await request.post("booking/", {
      data: requestBody,
    });

    // if 409 is returned, it means the room is already booked for the dates, will refactor to create a new room to book so we don't get these conflicts
    expect(response.status()).toBe(201);

    const body = await response.json();
    expect(body.bookingid).toBeGreaterThan(1);

    const booking = body.booking;
    expect(booking.bookingid).toBe(body.bookingid);
    expect(booking.roomid).toBe(requestBody.roomid);
    expect(booking.firstname).toBe(requestBody.firstname);
    expect(booking.lastname).toBe(requestBody.lastname);
    expect(booking.depositpaid).toBe(requestBody.depositpaid);

    const bookingdates = booking.bookingdates;
    expect(bookingdates.checkin).toBe(requestBody.bookingdates.checkin);
    expect(bookingdates.checkout).toBe(requestBody.bookingdates.checkout);
  });
});
