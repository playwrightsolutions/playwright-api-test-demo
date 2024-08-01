import Env from "@helpers/env";
import { APIRequestContext } from "@playwright/test";

class BaseAuthTests {
  protected username: string;
  protected password: string;
  protected baseUrl: string;
  protected requestContext: APIRequestContext;

  constructor(baseUrl: string, requestContext: APIRequestContext) {
    this.username = Env.ADMIN_NAME;
    this.password = Env.ADMIN_PASSWORD;
    this.baseUrl = baseUrl;
    this.requestContext = requestContext;
  }

  protected async postRequest(request: any, endpoint: string, data: any): Promise<any> {
    return await this.requestContext.post(endpoint, {
      data: data,
    });
  }
}

export default BaseAuthTests;
