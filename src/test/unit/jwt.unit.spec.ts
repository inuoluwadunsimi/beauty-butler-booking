import { JwtHelper } from "../../helpers/jwt/jwt.helper";
import { IExpressRequest, userRole } from "../../interfaces";
import * as jwt from "jsonwebtoken";
import { Response } from "express";

describe("JwtHelper", () => {
  const configOption = {
    privateKey: "base64PrivateKey",
    handleJsonResponse: jest.fn(),
    UserTokenDb: { findOne: jest.fn() },
  };

  const jwtHelper = new JwtHelper(configOption);

  it("generates a token with specified payload", () => {
    const token = jwtHelper.generateToken({
      email: "test@example.com",
      userId: "123",
      role: userRole.USER,
    });
    expect(token).toEqual(expect.any(String));
  });
});
