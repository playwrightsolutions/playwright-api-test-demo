//COVERAGE_TAG: GET /report/
//COVERAGE_TAG: GET /report/room/{id}

import { createFutureBooking } from "@datafactory/booking";
import { createRoom } from "@datafactory/room";
import { createHeaders } from "@helpers/createHeaders";
import { isValidDate } from "@helpers/date";
import { validateAgainstSchema } from "@helpers/validateAgainstSchema.ts";
import { validateJsonSchema } from "@helpers/validateJsonSchema";
import { test, expect } from "@playwright/test";

test.describe("report/ GET requests", async () => {
  let headers;
  let room;

  test.beforeEach(async () => {
    headers = await createHeaders();
    room = await createRoom();
    await createFutureBooking(room.roomid);
  });

  test("GET a report", async ({ request }) => {
    const response = await request.get("/report/", {
      headers: headers,
    });

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.report.length).toBeGreaterThanOrEqual(1);

    // Leaving this here for demo purposes
    // createAssertions(body, "body");

    // I am asserting on each booking in the report array
    body.report.forEach((booking) => {
      expect(isValidDate(booking.start)).toBe(true);
      expect(isValidDate(booking.end)).toBe(true);
      expect(typeof booking.title).toBe("string");
    });

    await validateJsonSchema("GET_report", "report", body);
    await validateAgainstSchema(body, "Report", "report");
  });

  test("GET room report by id", async ({ request }) => {
    const response = await request.get(`/report/room/${room.roomid}`);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.report.length).toBeGreaterThan(0);
    expect(isValidDate(body.report[0].start)).toBe(true);
    expect(isValidDate(body.report[0].end)).toBe(true);
    expect(body.report[0].title).toBe("Unavailable");

    await validateJsonSchema("GET_report_room_id", "report", body);
    await validateAgainstSchema(body, "Report", "report");
    await validateAgainstSchema(body.report[0], "Entry", "report"); //redundant but helpful as an example
  });
});
