//COVERAGE_TAG: GET /report/
//COVERAGE_TAG: GET /report/room/{id}

import { createFutureBooking } from "@datafactory/booking";
import { createRoom } from "@datafactory/room";
import { createHeaders } from "@helpers/createHeaders";
import { validateAgainstSchema } from "@helpers/validateAgainstSchema";
import { validateJsonSchema } from "@helpers/validateJsonSchema";
import { test, expect } from "@fixtures/fixtures";

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
      expect(booking.start).toBeValidDate();
      expect(booking.end).toBeValidDate();
      expect(booking.title).toBeString();
    });

    await validateJsonSchema("GET_report", "report", body);
    await validateAgainstSchema(body, "Report", "report");
  });

  test("GET room report by id", async ({ request }) => {
    const response = await request.get(`/report/room/${room.roomid}`);

    expect(response.status()).toBe(200);
    const body = await response.json();
    expect(body.report.length).toBeGreaterThan(0);
    expect(body.report[0].start).toBeValidDate();
    expect(body.report[0].end).toBeValidDate();
    expect(body.report[0].title).toBe("Unavailable");

    await validateJsonSchema("GET_report_room_id", "report", body);
    await validateAgainstSchema(body, "Report", "report");
    await validateAgainstSchema(body.report[0], "Entry", "report"); //redundant but helpful as an example
  });
});
