import fs from "fs";
import * as OpenApiValidator from "express-openapi-validator";

// documentation yaml file path
const specPath = "./spec/api.yaml";

if (!fs.existsSync(specPath)) {
  throw new Error("Api spec path is not defined");
}

// api validator to validate every incoming request according to defined specs
export const MainApiValidator = OpenApiValidator.middleware({
  apiSpec: specPath,
  validateRequests: true,
  validateResponses: false,
  validateSecurity: false,
  ignoreUndocumented: true,
  fileUploader: false,
  formats: [
    {
      name: "bytes",
      type: "string",
      validate: (a: any) => {
        return Buffer.from(a, "base64").length > 0;
      },
    },
  ],
});
