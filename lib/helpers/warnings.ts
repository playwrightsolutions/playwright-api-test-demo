import * as fs from "fs";

export const warningsFile = "./warnings.log";

export async function addWarning(warning: string, warningsFileToUse = warningsFile) {
  fs.appendFile(warningsFileToUse, "WARNING: " + warning + "\n", (err) => {
    if (err) {
      console.error(err);
    }
  });
}
