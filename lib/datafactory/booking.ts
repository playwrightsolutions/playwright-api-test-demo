import { expect, request } from "@playwright/test";
import { stringDateByDays } from "../helpers/date";
import { faker } from "@faker-js/faker";
import { createHeaders } from "../helpers/createHeaders";

const url = process.env.URL || "https://automationintesting.online/";
let bookingBody;
let checkOutArray;

export async function createRandomBookingBody(
  roomId: number,
  checkInString: string,
  checkOutString: string
) {
  const bookingBody = {
    roomid: roomId,
    firstname: faker.person.firstName(),
    lastname: faker.person.lastName(),
    depositpaid: Math.random() < 0.5, //returns true or false
    email: faker.internet.email(),
    phone: faker.phone.number("###########"),
    bookingdates: {
      checkin: checkInString,
      checkout: checkOutString,
    },
  };
  return bookingBody;
}

/**
 * This function will create a booking with provided roomId and a checkinDate
 * A checkout date will be randomly generated between 1 and 4 days after the checkinDate
 *
 * @param roomId: number for the room to create a booking for
 * @returns the body of the booking just created
 *
 * This code is wrapped in an assert retry details can be found
 * https://playwright.dev/docs/test-assertions#retrying
 */
export async function createFutureBooking(roomId: number) {
  let body;
  await expect(async () => {
    const headers = await createHeaders();

    const futureCheckinDate = await futureOpenCheckinDate(roomId);
    const randBookingLength = faker.number.int({ min: 1, max: 4 });

    const checkInString = futureCheckinDate.toISOString().split("T")[0];
    const checkOutString = stringDateByDays(futureCheckinDate, randBookingLength);

    // console.log("booking length: " + randBookingLength);
    // console.log("checkin string: " + checkInString);
    // console.log("checkout string: " + checkOutString);

    bookingBody = {
      roomid: roomId,
      firstname: faker.person.firstName(),
      lastname: faker.person.lastName(),
      depositpaid: Math.random() < 0.5, //returns true or false
      email: faker.internet.email(),
      phone: faker.phone.number("###########"),
      bookingdates: {
        checkin: checkInString,
        checkout: checkOutString,
      },
    };

    const createRequestContext = await request.newContext();
    const response = await createRequestContext.post(url + "booking/", {
      headers: headers,
      data: bookingBody,
    });

    expect(response.status()).toBe(201);
    body = await response.json();
  }).toPass({
    intervals: [1_000, 2_000, 5_000],
    timeout: 20_000,
  });

  return body;
}

/**
 * This function will return all the bookings for a roomId
 *
 * @param roomId: number for the room you want to get the bookings for
 * @returns the body of the bookings for the room
 */
export async function getBookings(roomId: number) {
  const headers = await createHeaders();

  const createRequestContext = await request.newContext();
  const response = await createRequestContext.get(
    url + "booking/?roomid=" + roomId,
    {
      headers: headers,
    }
  );

  expect(response.status()).toBe(200);
  const body = await response.json();
  // console.log(JSON.stringify(body));
  return body;
}

/**
 *
 * @param bookingId: number for the booking you want to see the summary of
 * @returns the body of the booking/summary?roomid=${bookingId} endpoint
 */
export async function getBookingSummary(bookingId: number) {
  const createRequestContext = await request.newContext();
  const response = await createRequestContext.get(
    url + `booking/summary?roomid=${bookingId}`
  );

  expect(response.status()).toBe(200);
  const body = await response.json();
  return body;
}

/**
 *
 * @param bookingId number for the booking you want to see the details of
 * @returns the body of the booking/${bookingId} endpoint
 */
export async function getBookingById(bookingId: number) {
  const headers = await createHeaders();

  const createRequestContext = await request.newContext();
  const response = await createRequestContext.get(
    url + `booking/${bookingId}`,
    {
      headers: headers,
    }
  );

  expect(response.status()).toBe(200);
  const body = await response.json();
  return body;
}

/**
 *
 * @param roomId
 * @returns the most future checkout date for a room
 * @example
 *
 *  let futureCheckinDate = await futureOpenCheckinDate(roomId);        // "2023-03-31T00:00:00.000Z"
 *  let checkInString = futureCheckinDate.toISOString().split("T")[0];  // "2023-03-31"
 *  let checkOutString = stringDateByDays(futureCheckinDate, 2);        // "2023-04-02"
 */
export async function futureOpenCheckinDate(roomId: number) {
  const currentBookings = await getBookings(roomId);

  checkOutArray = [];

  // Iterate through current bookings and get checkout dates
  for (let i = 0; i < (await currentBookings.bookings.length); i++) {
    const today = new Date();
    const checkOut = new Date(currentBookings.bookings[i].bookingdates.checkout);

    if (today < checkOut) {
      // pushing the checkout date into an array
      checkOutArray.push(checkOut);
    }
  }

  // Find the most future checkout date and return it if no future dates exist return today
  const mostFutureDate =
    checkOutArray
      .sort(function (a, b) {
        return a - b;
      })
      .pop() || new Date();

  // console.log("Last Checkout Date: " + mostFutureDate);
  return mostFutureDate;
}
