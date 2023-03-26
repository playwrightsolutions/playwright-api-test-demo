import { test, expect } from "@playwright/test";
import { auth } from "../../lib/datafactory/auth";
import { isValidDate } from "../../lib/helpers/date";

test.describe("booking/ GET requests", async () => {
  let cookies;

  test.beforeAll(async ({ request }) => {
    cookies = await auth("admin", "password");
  });

  test("GET booking summary with specific room id", async ({ request }) => {
    const response = await request.get("booking/summary?roomid=1");

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.bookings.length).toBeGreaterThanOrEqual(1);
    expect(isValidDate(body.bookings[0].bookingDates.checkin)).toBe(true);
    expect(isValidDate(body.bookings[0].bookingDates.checkout)).toBe(true);
  });

  test("GET booking summary with specific room id that doesn't exist", async ({
    request,
  }) => {
    const response = await request.get("booking/summary?roomid=999999");

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.bookings.length).toBe(0);
  });

  test("GET booking summary with specific room id that is empty", async ({
    request,
  }) => {
    const response = await request.get("booking/summary?roomid=");

    expect(response.status()).toBe(500);

    const body = await response.json();
    expect(isValidDate(body.timestamp)).toBe(true);
    expect(body.status).toBe(500);
    expect(body.error).toBe("Internal Server Error");
    expect(body.path).toBe("/booking/summary");
  });

  test("GET all bookings with details", async ({ request }) => {
    const response = await request.get("booking/", {
      headers: { cookie: cookies },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.bookings.length).toBeGreaterThanOrEqual(1);
    expect(body.bookings[0].bookingid).toBe(1);
    expect(body.bookings[0].roomid).toBe(1);
    expect(body.bookings[0].firstname).toBe("James");
    expect(body.bookings[0].lastname).toBe("Dean");
    expect(body.bookings[0].depositpaid).toBe(true);
    expect(isValidDate(body.bookings[0].bookingdates.checkin)).toBe(true);
    expect(isValidDate(body.bookings[0].bookingdates.checkout)).toBe(true);
  });

  test("GET all bookings with details with no authentication", async ({
    request,
  }) => {
    const response = await request.get("booking/", {
      headers: { cookie: "test" },
    });

    expect(response.status()).toBe(403);

    const body = await response.text();
    expect(body).toBe("");
  });

  test("GET booking by id with details", async ({ request }) => {
    const response = await request.get("booking/1", {
      headers: { cookie: cookies },
    });

    expect(response.status()).toBe(200);

    const body = await response.json();
    expect(body.bookingid).toBe(1);
    expect(body.roomid).toBe(1);
    expect(body.firstname).toBe("James");
    expect(body.lastname).toBe("Dean");
    expect(body.depositpaid).toBe(true);
    expect(isValidDate(body.bookingdates.checkin)).toBe(true);
    expect(isValidDate(body.bookingdates.checkout)).toBe(true);
  });

  test("GET booking by id that doesn't exist", async ({ request }) => {
    const response = await request.get("booking/999999", {
      headers: { cookie: cookies },
    });

    expect(response.status()).toBe(404);

    const body = await response.text();
    expect(body).toBe("");
  });

  test("GET booking by id without authentication", async ({ request }) => {
    const response = await request.get("booking/1");

    expect(response.status()).toBe(403);

    const body = await response.text();
    expect(body).toBe("");
  });
});
