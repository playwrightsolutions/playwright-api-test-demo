import { createHeaders, createInvalidHeaders } from "@helpers/createHeaders";
import { createCookies } from "@datafactory/auth";
import Env from "@helpers/env";

jest.mock("@helpers/env", () => ({
  __esModule: true,
  default: {
    URL: "MockedUrl",
    ADMIN_NAME: "MockedAdminName",
    ADMIN_PASSWORD: "MockedAdminPassword",
    SECRET_API_KEY: "MockedSecretApiKey",
  },
  namedExport: jest.fn(),
}));
jest.mock("@datafactory/auth");

describe("createHeaders", () => {
  test("createHeaders return header with given token", async () => {
    const input = "mockedToken";
    const expected = {
      cookie: `token=${input}`,
    };

    const actual = await createHeaders(input);

    expect(actual).toEqual(expected);
  });
  test("createHeaders call createCookies with credentials from Env when token is not given", async () => {
    const createCookiesMock = jest.mocked(createCookies);
    createCookiesMock.mockResolvedValue("token=mockedToken");

    const expected = {
      cookie: `token=${"mockedToken"}`,
    };

    const actual = await createHeaders();

    expect(createCookies).toHaveBeenCalledWith(Env.ADMIN_NAME, Env.ADMIN_PASSWORD);
    expect(actual).toEqual(expected);
  });

  describe("createInvalidHeaders", () => {
    test("should return header with invalid cookie", async () => {
      const expected = {
        cookie: "cookie=invalid",
      };

      const actual = await createInvalidHeaders();

      expect(actual).toEqual(expected);
    });
  });
});
