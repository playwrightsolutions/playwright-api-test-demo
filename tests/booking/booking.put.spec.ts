import { test, expect } from "@playwright/test";
import { auth } from "../../lib/datafactory/auth";
import {
  futureOpenCheckinDate,
  createBooking,
} from "../../lib/datafactory/booking";
import { isValidDate, stringDateByDays } from "../../lib/helpers/date";

test.describe("booking/{id} PUT requests", async () => {
  let cookies;
  let bookingId;
  let roomId = 1;
  let futureCheckinDate;

  test.beforeAll(async () => {
    cookies = await auth("admin", "password");
  });

  test.beforeEach(async ({ request }) => {
    // Get Future checkin Date, Create a booking with available checkin date, and save bookingId
    futureCheckinDate = await futureOpenCheckinDate(roomId);
    let newBooking = await createBooking(roomId, futureCheckinDate);

    bookingId = newBooking.bookingid;
    // console.log(bookingId);
  });

  test(`PUT booking with specific room id: ${bookingId}`, async ({
    request,
  }) => {
    let putBody = {
      bookingid: `${bookingId}`,
      roomid: roomId,
      firstname: "Happy",
      lastname: "McPathy",
      depositpaid: false,
      email: "testy@mcpathyson.com",
      phone: "5555555555555",
      bookingdates: {
        checkin: stringDateByDays(futureCheckinDate, 0),
        checkout: stringDateByDays(futureCheckinDate, 1),
      },
    };
    const response = await request.put(`booking/${bookingId}`, {
      headers: { cookie: cookies },
      data: putBody,
    });

    expect(response.status()).toBe(200);
    const body = await response.json();

    expect(body.bookingid).toBeGreaterThan(1);

    const booking = body.booking;
    expect(booking.bookingid).toBe(bookingId);
    expect(booking.roomid).toBe(putBody.roomid);
    expect(booking.firstname).toBe(putBody.firstname);
    expect(booking.lastname).toBe(putBody.lastname);
    expect(booking.depositpaid).toBe(putBody.depositpaid);

    const bookingdates = booking.bookingdates;
    expect(bookingdates.checkin).toBe(putBody.bookingdates.checkin);
    expect(bookingdates.checkout).toBe(putBody.bookingdates.checkout);

    // If we wanted to be double sure we can make another GET call and make assertions
    const getBookingResponse = await request.get(`booking/${bookingId}`, {
      headers: { cookie: cookies },
    });

    expect(getBookingResponse.status()).toBe(200);
    const getBookingBody = await getBookingResponse.json();

    expect(getBookingBody.bookingid).toBeGreaterThan(1);

    expect(getBookingBody.bookingid).toBe(bookingId);
    expect(getBookingBody.roomid).toBe(putBody.roomid);
    expect(getBookingBody.firstname).toBe(putBody.firstname);
    expect(getBookingBody.lastname).toBe(putBody.lastname);
    expect(getBookingBody.depositpaid).toBe(putBody.depositpaid);

    const getBookingDates = getBookingBody.bookingdates;
    expect(getBookingDates.checkin).toBe(putBody.bookingdates.checkin);
    expect(getBookingDates.checkout).toBe(putBody.bookingdates.checkout);
  });

  test("PUT booking with an id that doesn't exist", async ({ request }) => {
    const response = await request.delete("booking/999999", {
      headers: { cookie: cookies },
    });

    expect(response.status()).toBe(404);
    const body = await response.text();
    expect(body).toBe("");
  });

  test(`PUT booking id ${bookingId} without authentication`, async ({
    request,
  }) => {
    const response = await request.put(`booking/${bookingId}`, {
      headers: { cookie: "test" },
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    // console.log(body);
    expect(isValidDate(body.timestamp)).toBe(true);
    expect(body.status).toBe(400);
    expect(body.error).toBe("Bad Request");
    expect(body.path).toBe(`/booking/${bookingId}`);
  });

  test(`PUT booking id that is text`, async ({ request }) => {
    const response = await request.put(`booking/asdf`, {
      headers: { cookie: cookies },
    });

    expect(response.status()).toBe(404);
    const body = await response.json();
    expect(isValidDate(body.timestamp)).toBe(true);
    expect(body.status).toBe(404);
    expect(body.error).toBe("Not Found");
    expect(body.path).toBe("/booking/asdf");
  });
});
