# playwright-api-test-demo

This repository will serve as a place where I add API test Automation checks for articles written at <https://playwrightsolutions.com>

## Useful Swagger Links

- [Auth Swagger UI](https://automationintesting.online/auth/swagger-ui/index.html#/)
- [Booking Swagger UI](https://automationintesting.online/booking/swagger-ui/index.html#/)
- [Room Swagger UI](https://automationintesting.online/room/swagger-ui/index.html#/)
- [Branding Swagger UI](https://automationintesting.online/branding/swagger-ui/index.html#/)
- [Report Swagger UI](https://automationintesting.online/report/swagger-ui/index.html#/)
- [Message Swagger UI](https://automationintesting.online/message/swagger-ui/index.html#/)

## Contributing to playwright-api-test-demo

### Husky, ESLint, and Prettier

We use a mix of [Husky](https://github.com/typicode/husky), [ESLint](https://eslint.org/) and [Prettier](https://prettier.io/) within our repository to help enforce consistent coding practices. Husky is a tool that will install a pre-commit hook to run the linter any time before you attempt to make a commit. This replaces the old pre-commit hook that was used before. to install the pre-commit hook you will need to run

```bash
npm run prepare
```

```bash
npx husky install
```

You shouldn't have to run this command but for reference, the command used to generate the pre-commit file was

```bash
npx husky add .husky/pre-commit "npm run lint && npm run prettier"
```

You are still able to bypass the commit hook by passing in --no-verify to your git commit message if needed.
ESLint is a popular javascript/typescript linting tool. The configuration for ESLint can be found in `.eslintrc.cjs` file. Prettier, helps with styling (spaces, tabs, quotes, etc), config found in `.prettierrc`.

### Json Schema

We generate json schemas with a `POST, PUT, PATCH and GET` test but not with a delete. To generate a json schema. An example of a test that generates a schema is below. It's best to follow the similar naming conventions

```javascript
// Creates a snapshot of the schema and save to .api/booking/POST_booking_schema.json
await validateJsonSchema("POST_booking", "booking", body, true);

// Asserts that the body matches the snapshot found at .api/booking/POST_booking_schema.json
await validateJsonSchema("POST_booking", "booking", body);
```

Example of how this is used in a test:

```javascript
import { test, expect } from "@playwright/test";
import { validateJsonSchema } from "@helpers/validateJsonSchema";

test.describe("booking/ POST requests", async () => {
  test("POST new booking with full body", async ({ request }) => {
    const response = await request.post("booking/", {
      data: requestBody,
    });

    expect(response.status()).toBe(201);
    const body = await response.json();
    await validateJsonSchema("POST_booking", "booking", body);
  });
});
```

- To make sure that response body schema is what we should expect based on our documentation we use `validateAgainstSchema()` function which takes the following parameters:

  - `Definition:` Validates an **object** against a specified **schema object**
  - object - The object to check schemaObject against.
  - schemaObject - The schema object name as documented in \*\_spec3.json.
  - docs - The type of docs (e.g. `public`, `internal` or `admin`).
  - notReturnedButInSchema - Any defined properties in schema but not returned by Falcon.
  - extraParamsReturned - Any undefined properties returned by Falcon; **_create a bug if there are any._**

    ```bash
    await validateAgainstSchema(body.user, "User", "public", [
    "verification_code"]);
    ```

  This function will validate the object from response (1st param) against the object (2nd param) from the documentation (3rd param), ignoring the fact that docs have more parameters defined (4th params).
  It will count keys in the returned and docs objects and validate that they have the same names. IF there is a mismatch -> there is going to be a failure on `.toEqual` since we validating keys from response and docs objects placing them in sorted arrays

  ```bash
  // compare object keys (need to be sorted since order differs)
  expect(docsObjectKeys.sort()).toEqual(responseObjectKeys.sort());
  ```

  The only thing which is not achieved with this approach is the fact there is no way for us to know if a new parameter is added. We have to track on our side how many keys each object has.

  We use 3 files (for public, internal and admin docs) in `./lib/helpers/schemaData${docs}` which store objects and their parameter counts.
  When `validateAgainstSchema()` function finishes comparison of response and doc objects we then check docs object keys count vs what we store for that object. If there is a mismatch - a warning will be triggered at the end of run. Notice: test is not failing and just adds a warning which will give you directions what test needs to be updated (since there are possibly new params) and that you need to update our tracking files.

  To update tracking files you need to run any test with `GENERATE_SCHEMA_TRACKING_DATA=true`. It will overwrite existing 3 files BUT it's you who have to commit and push them to our repo.
