export class HttpCodes {
  public static HTTP_RESPONSE_OK = 200;
  public static HTTP_RESPONSE_CREATED_OK = 201;
  public static HTTP_PUT_OK = 202;
  public static HTTP_RESPONSE_DELETE_OK = 204;
  public static HTTP_RESPONSE_RESET_CONTENT_OK = 205;
  public static HTTP_RESPONSE_DELETE_CREATE_OK = 206;

  public static HTTP_RESPONSE_CLIENT_ERROR = 400;
  public static HTTP_RESPONSE_ERROR_UN_AUTHERIZED = 401;
  public static HTTP_RESPONSE_ERROR_FORBIDDEN = 403;
  public static HTTP_RESPONSE_RESOURCE_NOT_FOUND = 404;

  public static HTTP_RESPONSE_SERVER_INTERNAL_ERROR = 500;
}

export class RequestTimeouts {
  public static HTTP_RESPONSE_TIMEOUT = 1000;
}
