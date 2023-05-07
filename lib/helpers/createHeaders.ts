import { auth } from "../datafactory/auth";

let username = process.env.ADMIN_NAME;
let password = process.env.ADMIN_PASSWORD;

export async function createHeaders(token?) {
  let requestHeaders;

  if (token) {
    requestHeaders = {
      cookie: `token=${token}`,
    };
  } else {
    // Authenticate and get cookies
    let cookies = await auth(username, password);
    requestHeaders = {
      cookie: cookies,
    };
  }

  return requestHeaders;
}

export async function createInvalidHeaders() {
  let requestHeaders = {
    cookie: "cookie=invalid",
  };

  return requestHeaders;
}
