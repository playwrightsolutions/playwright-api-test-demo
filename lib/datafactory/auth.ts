import { expect, request } from "@playwright/test";

let url = process.env.URL || "https://automationintesting.online/";
let cookies;

/**
   * Returns valid cookies for the given username and password.
   * If a username and password aren't provided "admin" and "password" will be used
   *
   * @example
   * import { auth } from "../datafactory/auth";
   *  
   * const cookies = auth("Happy", "Mcpassword")
   * 
   * const response = await request.put(`booking/${bookingId}`, {
      headers: { cookie: cookies },
      data: body,
    });
   */

export async function auth(username?: string, password?: string) {
  if (!username) {
    username = "admin";
  }
  if (!password) {
    password = "password";
  }

  const contextRequest = await request.newContext();
  const response = await contextRequest.post(url + "auth/login", {
    data: {
      username: username,
      password: password,
    },
  });

  expect(response.status()).toBe(200);
  const headers = await response.headers();
  cookies = headers["set-cookie"];
  return cookies;
}
