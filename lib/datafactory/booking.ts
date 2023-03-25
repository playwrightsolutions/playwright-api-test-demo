import { expect, request } from "@playwright/test";
import { auth } from "../datafactory/auth";
import { stringDateByDays } from "../helpers/date";
import { faker } from "@faker-js/faker";

let url = process.env.URL || "https://automationintesting.online/";
let bookingBody;
let checkOutArray;

export async function createRandomBookingBody(
  roomId: number,
  checkInString: string,
  checkOutString: string
) {
  let bookingBody = {
    roomid: roomId,
    firstname: faker.name.firstName(),
    lastname: faker.name.lastName(),
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
    let cookies = await auth("admin", "password");

    let futureCheckinDate = await futureOpenCheckinDate(roomId);
    let randBookingLength = faker.datatype.number({ min: 1, max: 4 });

    let checkInString = futureCheckinDate.toISOString().split("T")[0];
    let checkOutString = stringDateByDays(futureCheckinDate, randBookingLength);

    // console.log("booking length: " + randBookingLength);
    // console.log("checkin string: " + checkInString);
    // console.log("checkout string: " + checkOutString);

    bookingBody = {
      roomid: roomId,
      firstname: faker.name.firstName(),
      lastname: faker.name.lastName(),
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
      headers: { cookie: cookies },
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
  let cookies = await auth("admin", "password");

  const createRequestContext = await request.newContext();
  const response = await createRequestContext.get(
    url + "booking/?roomid=" + roomId,
    {
      headers: { Cookie: cookies },
    }
  );

  expect(response.status()).toBe(200);
  const body = await response.json();
  // console.log(JSON.stringify(body));
  return body;
}

/**
 * This function will return the summary of as specific bookingId
 *
 * @param bookingId: number for the booking you want to see the summary of
 * @returns the body of the bookingId
 */
export async function getBookingSummary(bookingId: number) {
  const createRequestContext = await request.newContext();
  const response = await createRequestContext.get(
    url + `booking/summary?roomid=${bookingId}`
  );

  expect(response.status()).toBe(200);
  const body = await response.json();
  //  console.log(JSON.stringify(body));
  return body;
}

export async function futureOpenCheckinDate(roomId: number) {
  let currentBookings = await getBookings(roomId);

  checkOutArray = new Array();

  // Iterate through current bookings and get checkout dates
  for (let i = 0; i < (await currentBookings.bookings.length); i++) {
    let today = new Date();
    let checkOut = new Date(currentBookings.bookings[i].bookingdates.checkout);

    if (today < checkOut) {
      // pushing the checkout date into an array
      checkOutArray.push(checkOut);
    }
  }

  // Find the most future checkout date and return it if no future dates exist return today
  let mostFutureDate =
    checkOutArray
      .sort(function (a, b) {
        return a - b;
      })
      .pop() || new Date();

  // console.log("Last Checkout Date: " + mostFutureDate);
  return mostFutureDate;
}
