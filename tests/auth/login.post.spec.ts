import { test, expect } from "@fixtures/fixtures";
import BaseAuthTests from "./BaseAuthTest";
import { APIRequestContext } from "@playwright/test";
import { HttpCodes, RequestTimeouts } from "../../data/global-constans";

class AuthLoginTests extends BaseAuthTests {
  constructor(baseUrl: string, requestContext: APIRequestContext) {
    super(baseUrl, requestContext);
  }

  async postWithValidCredentials() {
    const start = Date.now();

    const response = await this.requestContext.post(this.baseUrl, {
      data: {
        username: this.username,
        password: this.password,
      },
    });

    const end = Date.now();
    const duration = end - start;

    expect(duration).toBeLessThan(RequestTimeouts.HTTP_RESPONSE_TIMEOUT);
    expect(response.status()).toBe(HttpCodes.HTTP_RESPONSE_OK);

    const body = await response.text();
    expect(body).toBe("");
    expect(response.headers()["set-cookie"]).toContain("token=");
  }

  async postWithInvalidUsernameAndPassword() {
    const response = await this.requestContext.post(`auth/login`, {
      data: {
        username: "invalidUsername",
        password: "invalidPassword",
      },
    });

    expect(response.status()).toBe(HttpCodes.HTTP_RESPONSE_ERROR_FORBIDDEN);

    const body = await response.text();
    expect(body).toBe("");
  }

  async postWithValidUsernameAndInvalidPassword() {
    const response = await this.requestContext.post(`auth/login`, {
      data: {
        username: this.username,
        password: "invalidPassword",
      },
    });

    expect(response.status()).toBe(HttpCodes.HTTP_RESPONSE_ERROR_FORBIDDEN);

    const body = await response.text();
    expect(body).toBe("");
  }

  async postWithInvalidUsernameAndValidPassword() {
    const response = await this.requestContext.post(`auth/login`, {
      data: {
        username: "invalidUsername",
        password: this.password,
      },
    });

    expect(response.status()).toBe(HttpCodes.HTTP_RESPONSE_ERROR_FORBIDDEN);

    const body = await response.text();
    expect(body).toBe("");
  }

  async postWithNoUsernameAndValidPassword() {
    const response = await this.requestContext.post(`auth/login`, {
      data: {
        password: this.password,
      },
    });

    expect(response.status()).toBe(HttpCodes.HTTP_RESPONSE_ERROR_FORBIDDEN);

    const body = await response.text();
    expect(body).toBe("");
  }

  async postWithEmptyBody() {
    const response = await this.requestContext.post(`auth/login`, {
      data: {},
    });

    expect(response.status()).toBe(HttpCodes.HTTP_RESPONSE_ERROR_FORBIDDEN);

    const body = await response.text();
    expect(body).toBe("");
  }

  async postWithNoBody() {
    const response = await this.requestContext.post(`auth/login`, {});

    expect(response.status()).toBe(HttpCodes.HTTP_RESPONSE_CLIENT_ERROR);

    const body = await response.json();
    //expect(body.timestamp).toBeValidDate();
    expect(body.status).toBe(HttpCodes.HTTP_RESPONSE_CLIENT_ERROR);
    expect(body.error).toBe("Bad Request");
    expect(body.path).toBe(`/auth/login`);
  }

  async postWithValidCredentialsThenValidateWithToken() {
    const response = await this.requestContext.post(`auth/login`, {
      data: {
        username: this.username,
        password: this.password,
      },
    });

    expect(response.status()).toBe(HttpCodes.HTTP_RESPONSE_OK);

    const body = await response.text();
    expect(body).toBe("");
    const headers = response.headers();
    const tokenString = headers["set-cookie"].split(";")[0];
    const token = tokenString.split("=")[1];

    const validateResponse = await this.requestContext.post(`auth/validate`, {
      data: { token: token },
    });

    expect(validateResponse.status()).toBe(HttpCodes.HTTP_RESPONSE_OK);

    const validateBody = await validateResponse.text();
    expect(validateBody).toBe("");
  }
}

let authLoginTests: AuthLoginTests;

test.describe("auth/login POST requests @auth", async () => {
  test.beforeEach(async ({ request }) => {
    authLoginTests = new AuthLoginTests(`auth/login`, request);
  });

  test("POST with valid credentials @happy", async () => {
    await authLoginTests.postWithValidCredentials();
  });

  test("POST with invalid username and password", async () => {
    await authLoginTests.postWithInvalidUsernameAndPassword();
  });

  test("POST with valid username and invalid password", async () => {
    await authLoginTests.postWithValidUsernameAndInvalidPassword();
  });

  test("POST with invalid username and valid password", async () => {
    await authLoginTests.postWithInvalidUsernameAndValidPassword();
  });

  test("POST with no username and valid password", async () => {
    await authLoginTests.postWithNoUsernameAndValidPassword();
  });

  test("POST with empty body", async () => {
    await authLoginTests.postWithEmptyBody();
  });

  test("POST with no body", async () => {
    await authLoginTests.postWithNoBody();
  });

  test("POST with valid credentials then validate with token @happy", async () => {
    await authLoginTests.postWithValidCredentialsThenValidateWithToken();
  });
});
