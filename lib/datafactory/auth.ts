import { expect, request } from "@playwright/test";

let url = process.env.URL || "https://automationintesting.online/";
let cookies;

/**
   * Returns valid cookies for the given username and password.
   * If a username and password aren't provided "admin" and "password" will be used
   *
   * @example
   * import { createCookies } from "../datafactory/auth";
   *  
   * const cookies = createCookies("Happy", "Mcpassword")
   * 
   * const response = await request.put(`booking/${bookingId}`, {
      headers: { cookie: cookies },
      data: body,
    });
   */
export async function createCookies(username?: string, password?: string) {
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
  const headers = response.headers();
  cookies = headers["set-cookie"];
  return cookies;
}

/**
   * Returns valid token for the given username and password.
   * If a username and password aren't provided "admin" and "password" will be used
   *
   * @example
   * import { createToken } from "../datafactory/auth";
   *  
   * const token = createToken("Happy", "Mcpassword")
   * 
   * const response = await request.post("auth/validate", {
      data: { token: token },
    });
   */
export async function createToken(username?: string, password?: string) {
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
  const headers = response.headers();
  let tokenString = headers["set-cookie"].split(";")[0];
  let token = tokenString.split("=")[1];
  return token;
}
