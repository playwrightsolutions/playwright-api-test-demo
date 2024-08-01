import { test, expect } from "@fixtures/fixtures";
import BaseAuthTests from "./BaseAuthTest";

class AuthLoginTests extends BaseAuthTests{
  username: string;
  password: string;
  baseUrl: string;

  constructor(baseUrl: string) {
    super(baseUrl)
  }

  async postWithValidCredentials(request: any) {
    const start = Date.now();

    const response = await request.post(this.baseUrl, {
      data: {
        username: this.username,
        password: this.password,
      },
    });

    const end = Date.now();
    const duration = end - start;

    expect(duration).toBeLessThan(1000);
    expect(response.status()).toBe(200);

    const body = await response.text();
    expect(body).toBe("");
    expect(response.headers()["set-cookie"]).toContain("token=");
  }

  async postWithInvalidUsernameAndPassword(request: any) {
    const response = await request.post(`auth/login`, {
      data: {
        username: "invalidUsername",
        password: "invalidPassword",
      },
    });

    expect(response.status()).toBe(403);

    const body = await response.text();
    expect(body).toBe("");
  }

  async postWithValidUsernameAndInvalidPassword(request: any) {
    const response = await request.post(`auth/login`, {
      data: {
        username: this.username,
        password: "invalidPassword",
      },
    });

    expect(response.status()).toBe(403);

    const body = await response.text();
    expect(body).toBe("");
  }

  async postWithInvalidUsernameAndValidPassword(request: any) {
    const response = await request.post(`auth/login`, {
      data: {
        username: "invalidUsername",
        password: this.password,
      },
    });

    expect(response.status()).toBe(403);

    const body = await response.text();
    expect(body).toBe("");
  }

  async postWithNoUsernameAndValidPassword(request: any) {
    const response = await request.post(`auth/login`, {
      data: {
        password: this.password,
      },
    });

    expect(response.status()).toBe(403);

    const body = await response.text();
    expect(body).toBe("");
  }

  async postWithEmptyBody(request: any) {
    const response = await request.post(`auth/login`, {
      data: {},
    });

    expect(response.status()).toBe(403);

    const body = await response.text();
    expect(body).toBe("");
  }

  async postWithNoBody(request: any) {
    const response = await request.post(`auth/login`, {});

    expect(response.status()).toBe(400);

    const body = await response.json();
    //expect(body.timestamp).toBeValidDate();
    expect(body.status).toBe(400);
    expect(body.error).toBe("Bad Request");
    expect(body.path).toBe(`/auth/login`);
  }

  async postWithValidCredentialsThenValidateWithToken(request: any) {
    const response = await request.post(`auth/login`, {
      data: {
        username: this.username,
        password: this.password,
      },
    });

    expect(response.status()).toBe(200);

    const body = await response.text();
    expect(body).toBe("");
    const headers = response.headers();
    const tokenString = headers["set-cookie"].split(";")[0];
    const token = tokenString.split("=")[1];

    const validateResponse = await request.post(`auth/validate`, {
      data: { token: token },
    });

    expect(validateResponse.status()).toBe(200);

    const validateBody = await validateResponse.text();
    expect(validateBody).toBe("");
  }
}

const authLoginTests = new AuthLoginTests(`auth/login`);

test.describe("auth/login POST requests @auth", async () => {
  test("POST with valid credentials @happy", async ({ request }) => {
    await authLoginTests.postWithValidCredentials(request);
  });

  test("POST with invalid username and password", async ({ request }) => {
    await authLoginTests.postWithInvalidUsernameAndPassword(request);
  });

  test("POST with valid username and invalid password", async ({ request }) => {
    await authLoginTests.postWithValidUsernameAndInvalidPassword(request);
  });

  test("POST with invalid username and valid password", async ({ request }) => {
    await authLoginTests.postWithInvalidUsernameAndValidPassword(request);
  });

  test("POST with no username and valid password", async ({ request }) => {
    await authLoginTests.postWithNoUsernameAndValidPassword(request);
  });

  test("POST with empty body", async ({ request }) => {
    await authLoginTests.postWithEmptyBody(request);
  });

  test("POST with no body", async ({ request }) => {
    await authLoginTests.postWithNoBody(request);
  });

  test("POST with valid credentials then validate with token @happy", async ({ request }) => {
    await authLoginTests.postWithValidCredentialsThenValidateWithToken(request);
  });
});
