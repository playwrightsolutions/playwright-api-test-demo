//COVERAGE_TAG: POST /booking/

import { test, expect } from "@playwright/test";
import {
  createRandomBookingBody,
  futureOpenCheckinDate,
} from "../../lib/datafactory/booking";
import { stringDateByDays } from "../../lib/helpers/date";

test.describe("booking/ POST requests", async () => {
  let requestBody;
  let roomId = 1;

  test.beforeEach(async ({ request }) => {
    let futureCheckinDate = await futureOpenCheckinDate(roomId);
    let checkInString = futureCheckinDate.toISOString().split("T")[0];
    let checkOutString = stringDateByDays(futureCheckinDate, 2);

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
