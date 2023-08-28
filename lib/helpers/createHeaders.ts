import { createCookies } from "../datafactory/auth";
import Env from "@helpers/env";

const username = Env.ADMIN_NAME;
const password = Env.ADMIN_PASSWORD;

/**
 * 
 * @param token a valid token to be used in the request if one is not provided cookies will be created from default username and password
 * @returns a header object with the token set as a cookie
 * 
 * @example 
 * import { createHeaders } from "../lib/helpers/createHeaders";
 * 
 * const headers = await createHeaders(token);
 *     const response = await request.delete(`booking/${bookingId}`, {
      headers: headers,
    });
 * 
 */
export async function createHeaders(token?) {
  let requestHeaders;

  if (token) {
    requestHeaders = {
      cookie: `token=${token}`,
    };
  } else {
    // Authenticate and get cookies
    const cookies = await createCookies(username, password);
    requestHeaders = {
      cookie: cookies,
    };
  }

  return requestHeaders;
}

/**
 * 
 * @returns a header object with an invalid cookie used to test negative scenarios
 * 
 * @example 
 * import { createInvalidHeaders } from "../lib/helpers/createHeaders";
 * 
 * const invalidHeader = await createInvalidHeaders();
 *     const response = await request.delete(`booking/${bookingId}`, {
      headers: invalidHeader,
    });
 * 
 */
export async function createInvalidHeaders() {
  const requestHeaders = {
    cookie: "cookie=invalid",
  };

  return requestHeaders;
}
