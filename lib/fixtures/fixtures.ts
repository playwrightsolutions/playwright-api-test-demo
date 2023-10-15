import { mergeExpects } from "@playwright/test";
import { expect as toBeOneOfValuesExpect } from "@fixtures/toBeOneOfValues";
import { expect as toBeValidDate } from "@fixtures/toBeValidDate";
import { expect as typesExpects } from "@fixtures/typesExpects";

export { test } from "@playwright/test";

export const expect = mergeExpects(toBeOneOfValuesExpect, toBeValidDate, typesExpects);
