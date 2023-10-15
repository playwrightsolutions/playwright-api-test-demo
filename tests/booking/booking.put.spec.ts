//COVERAGE_TAG: PUT /booking/{id}

import { test, expect } from "@fixtures/fixtures";
import { getBookingById, futureOpenCheckinDate, createFutureBooking } from "@datafactory/booking";
import { stringDateByDays } from "@helpers/date";
import { createHeaders, createInvalidHeaders } from "@helpers/createHeaders";
import { createRoom } from "@datafactory/room";
import { validateJsonSchema } from "@helpers/validateJsonSchema";
import { validateAgainstSchema } from "@helpers/validateAgainstSchema";

test.describe("booking/{id} PUT requests", async () => {
  let headers;
  let invalidHeader;
  let bookingId;
  let room;
  let roomId;
  const firstname = "Happy";
  const lastname = "McPathy";
  const depositpaid = false;
  const email = "testy@mcpathyson.com";
  const phone = "5555555555555";
  let futureBooking;
  let futureCheckinDate;

  test.beforeAll(async () => {
    headers = await createHeaders();
    invalidHeader = await createInvalidHeaders();
  });

  test.beforeEach(async () => {
    room = await createRoom("Flaky", 67);
    roomId = room.roomid;
    futureBooking = await createFutureBooking(roomId);
    bookingId = futureBooking.bookingid;
    futureCheckinDate = await futureOpenCheckinDate(roomId);
  });

  test(`PUT booking with specific room id`, async ({ request }) => {
    const putBody = {
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
      headers: headers,
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

    await validateJsonSchema("PUT_booking_id", "booking", body);
    await validateAgainstSchema(booking, "Booking", "booking", ["email", "phone"]);
    await validateAgainstSchema(booking.bookingdates, "BookingDates", "booking");

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
    const putBody = {
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
      headers: headers,
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
    const putBody = {
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
      headers: headers,
      data: putBody,
    });

    expect(response.status()).toBe(404);

    const body = await response.text();
    expect(body).toBe("");
  });

  test(`PUT booking id that is text`, async ({ request }) => {
    const putBody = {
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
      headers: headers,
      data: putBody,
    });

    expect(response.status()).toBe(404);

    const body = await response.json();
    expect(body.timestamp).toBeValidDate();
    expect(body.status).toBe(404);
    expect(body.error).toBe("Not Found");
    expect(body.path).toBe("/booking/asdf");
  });

  test("PUT booking id with invalid authentication", async ({ request }) => {
    const putBody = {
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
      headers: invalidHeader,
      data: putBody,
    });

    expect(response.status()).toBe(403);

    const body = await response.text();
    expect(body).toBe("");
  });

  test("PUT booking id without authentication", async ({ request }) => {
    const putBody = {
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
      headers: headers,
    });

    expect(response.status()).toBe(400);

    const body = await response.json();
    expect(body.timestamp).toBeValidDate();
    expect(body.status).toBe(400);
    expect(body.error).toBe("Bad Request");
    expect(body.path).toBe(`/booking/${bookingId}`);
  });
});
