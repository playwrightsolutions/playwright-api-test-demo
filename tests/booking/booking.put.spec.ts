import { test, expect } from "@playwright/test";
import { auth } from "../../lib/datafactory/auth";
import {
  getBookingById,
  futureOpenCheckinDate,
  createFutureBooking,
} from "../../lib/datafactory/booking";
import { isValidDate, stringDateByDays } from "../../lib/helpers/date";

test.describe("booking/{id} PUT requests", async () => {
  let cookies;
  let bookingId;
  let roomId = 1;
  let firstname = "Happy";
  let lastname = "McPathy";
  let depositpaid = false;
  let email = "testy@mcpathyson.com";
  let phone = "5555555555555";
  let futureBooking;
  let futureCheckinDate;

  test.beforeAll(async () => {
    cookies = await auth("admin", "password");
  });

  test.beforeEach(async ({ request }) => {
    futureBooking = await createFutureBooking(roomId);
    bookingId = futureBooking.bookingid;
    futureCheckinDate = await futureOpenCheckinDate(roomId);
  });

  test(`PUT booking with specific room id`, async ({ request }) => {
    let putBody = {
      bookingid: bookingId,
      roomid: roomId,
      firstname: firstname,
      lastname: lastname,
      depositpaid: depositpaid,
      email: email,
      phone: phone,
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

    await test.step("Verify booking was updated", async () => {
      const getBookingBody = await getBookingById(bookingId);
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
  });

  test("PUT booking without firstname in putBody", async ({ request }) => {
    let putBody = {
      bookingid: bookingId,
      roomid: roomId,
      lastname: lastname,
      depositpaid: depositpaid,
      email: email,
      phone: phone,
      bookingdates: {
        checkin: stringDateByDays(futureCheckinDate, 0),
        checkout: stringDateByDays(futureCheckinDate, 1),
      },
    };
    const response = await request.put(`booking/${bookingId}`, {
      headers: { cookie: cookies },
      data: putBody,
    });

    expect(response.status()).toBe(400);

    const body = await response.json();
    expect(body.error).toBe("BAD_REQUEST");
    expect(body.errorCode).toBe(400);
    expect(body.errorMessage).toContain(
      "Validation failed for argument [0] in public org.springframework.http.ResponseEntity"
    );
    expect(body.fieldErrors[0]).toBe("Firstname should not be blank");
  });

  test("PUT booking with an id that doesn't exist", async ({ request }) => {
    let putBody = {
      bookingid: bookingId,
      roomid: roomId,
      firstname: firstname,
      lastname: lastname,
      depositpaid: depositpaid,
      email: email,
      phone: phone,
      bookingdates: {
        checkin: stringDateByDays(futureCheckinDate, 0),
        checkout: stringDateByDays(futureCheckinDate, 1),
      },
    };

    const response = await request.delete("booking/999999", {
      headers: { cookie: cookies },
      data: putBody,
    });

    expect(response.status()).toBe(404);

    const body = await response.text();
    expect(body).toBe("");
  });

  test(`PUT booking id that is text`, async ({ request }) => {
    let putBody = {
      bookingid: bookingId,
      roomid: roomId,
      firstname: firstname,
      lastname: lastname,
      depositpaid: depositpaid,
      email: email,
      phone: phone,
      bookingdates: {
        checkin: stringDateByDays(futureCheckinDate, 0),
        checkout: stringDateByDays(futureCheckinDate, 1),
      },
    };

    const response = await request.put(`booking/asdf`, {
      headers: { cookie: cookies },
      data: putBody,
    });

    expect(response.status()).toBe(404);

    const body = await response.json();
    expect(isValidDate(body.timestamp)).toBe(true);
    expect(body.status).toBe(404);
    expect(body.error).toBe("Not Found");
    expect(body.path).toBe("/booking/asdf");
  });

  test("PUT booking id with invalid authentication", async ({ request }) => {
    let putBody = {
      bookingid: bookingId,
      roomid: roomId,
      firstname: firstname,
      lastname: lastname,
      depositpaid: depositpaid,
      email: email,
      phone: phone,
      bookingdates: {
        checkin: stringDateByDays(futureCheckinDate, 0),
        checkout: stringDateByDays(futureCheckinDate, 1),
      },
    };

    const response = await request.put(`booking/${bookingId}`, {
      headers: { cookie: "test" },
      data: putBody,
    });

    expect(response.status()).toBe(403);

    const body = await response.text();
    expect(body).toBe("");
  });

  test("PUT booking id without authentication", async ({ request }) => {
    let putBody = {
      bookingid: bookingId,
      roomid: roomId,
      firstname: firstname,
      lastname: lastname,
      depositpaid: depositpaid,
      email: email,
      phone: phone,
      bookingdates: {
        checkin: stringDateByDays(futureCheckinDate, 0),
        checkout: stringDateByDays(futureCheckinDate, 1),
      },
    };

    const response = await request.put(`booking/${bookingId}`, {
      data: putBody,
    });

    expect(response.status()).toBe(403);

    const body = await response.text();
    expect(body).toBe("");
  });

  test("PUT booking id without put body", async ({ request }) => {
    const response = await request.put(`booking/${bookingId}`, {
      headers: { cookie: cookies },
    });

    expect(response.status()).toBe(400);

    const body = await response.json();
    expect(isValidDate(body.timestamp)).toBe(true);
    expect(body.status).toBe(400);
    expect(body.error).toBe("Bad Request");
    expect(body.path).toBe(`/booking/${bookingId}`);
  });
});
