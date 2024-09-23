import { faker } from "@faker-js/faker";
import Env from "@helpers/env";
import { request, expect } from "@playwright/test";

const url = Env.URL || "https://automationintesting.online/";

export const message1Summary = {
  id: 1,
  name: "James Dean",
  subject: "Booking enquiry",
  read: false,
};

export const message1 = {
  messageid: 1,
  name: "James Dean",
  email: "james@email.com",
  phone: "01402 619211",
  subject: "Booking enquiry",
  description: "I would like to book a room at your place",
};

export const postMessage = {
  name: "string",
  email: "test@test.com",
  phone: "stringstringstring",
  subject: "string",
  description: "stringstringstringst",
};

export async function newMessageBody() {
  const message = {
    name: faker.person.firstName(),
    email: faker.internet.email(),
    phone: faker.phone.number(),
    subject: faker.company.buzzPhrase(),
    description: faker.company.catchPhrase(),
  };
  return message;
}

export async function createMessage() {
  const message = await newMessageBody();

  const contextRequest = await request.newContext();
  const response = await contextRequest.post(url + "message/", {
    data: message,
  });

  expect(response.status()).toBe(201);
  const body = await response.json();
  return body;
}
