import mongoose from "mongoose";

require("dotenv").config();

import * as authService from "../../services/auth.service";
import { UserAuthDb, UserDb, UserVerDb } from "../../models";
import { userRole } from "../../interfaces";
import { Mailer } from "../../services/email.service";
import * as OtpModule from "../../helpers/utils";
import bcrypt from "bcrypt";
import { JwtHelper } from "../../helpers/jwt/jwt.helper";

describe("auth service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  beforeAll(async () => {
    await mongoose.connect(process.env.TEST_DB as string);
  });
  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  describe("Signup", () => {
    it("should throw an error if user exists", async () => {
      UserDb.findOne = jest.fn().mockResolvedValue(true);
      await expect(
        authService.Signup({
          email: "test@example.com",
          fullName: "Test User",
          password: "password123",
          role: userRole.USER,
        })
      ).rejects.toThrow("user exists, login instead");
    });
    it("should create a new user, hash password, and send OTP", async () => {
      UserDb.findOne = jest.fn().mockResolvedValue(null);
      UserDb.create = jest
        .fn()
        .mockResolvedValue({ id: "userId", email: "test@example.com" });
      UserAuthDb.create = jest.fn().mockResolvedValue({});
      UserVerDb.create = jest.fn().mockResolvedValue({});
      Mailer.sendSignupOtp = jest.fn().mockResolvedValue(true);
      jest.spyOn(OtpModule, "generateOtp").mockReturnValueOnce("123456");

      await authService.Signup({
        email: "test@example.com",
        fullName: "Test User",
        password: "password123",
        role: userRole.USER,
      });

      expect(UserDb.create).toHaveBeenCalledWith({
        email: "test@example.com",
        fullName: "Test User",
        role: "user",
      });
      expect(UserAuthDb.create).toHaveBeenCalled();
      expect(UserVerDb.create).toHaveBeenCalledWith({
        email: "test@example.com",
        otp: "123456",
        type: "SIGNUP",
        expiresAt: expect.any(Date),
      });
      expect(Mailer.sendSignupOtp).toHaveBeenCalledWith({
        otp: "123456",
        recipient: "test@example.com",
      });
    });
  });

  describe("VerifyEmail", () => {
    it("should throw an error if the OTP is incorrect", async () => {
      UserVerDb.findOne = jest.fn().mockResolvedValue(null); // Simulate OTP not found

      await expect(
        authService.VerifyEmail({
          email: "test@example.com",
          otp: "wrong_otp",
        })
      ).rejects.toThrow("Otp entered is incorrect");
    });

    it("should throw an error if the OTP has expired", async () => {
      const pastDate = new Date(Date.now() - 10000);
      UserVerDb.findOne = jest.fn().mockResolvedValue({
        email: "test@example.com",
        otp: "123456",
        expiresAt: pastDate,
      });

      await expect(
        authService.VerifyEmail({
          email: "test@example.com",
          otp: "123456",
        })
      ).rejects.toThrow("Otp has expired");
    });

    it("should verify email and return auth response on successful OTP verification", async () => {
      UserVerDb.findOne = jest.fn().mockResolvedValue({
        email: "test@example.com",
        otp: "123456",
        expiresAt: new Date(Date.now() + 10000),
      });
      UserAuthDb.findOneAndUpdate = jest
        .fn()
        .mockResolvedValue({ email: "test@example.com", verified: true });
      UserDb.findOne = jest.fn().mockResolvedValue({
        id: "userId",
        email: "test@example.com",
        role: "user",
      });

      const response = await authService.VerifyEmail({
        email: "test@example.com",
        otp: "123456",
      });

      expect(response).toHaveProperty("accessToken");
      expect(response).toHaveProperty("user");
      expect(response.user.email).toBe("test@example.com");
    });
  });

  describe("login", () => {
    it("should throw an error if the user does not exist", async () => {
      UserAuthDb.findOne = jest.fn().mockResolvedValue(null); // Simulate user not found in UserAuthDb

      await expect(
        authService.login({
          email: "nonexistent@example.com",
          password: "password123",
        })
      ).rejects.toThrow("invalid credentials");
    });

    it("should throw an error if password is incorrect", async () => {
      UserAuthDb.findOne = jest.fn().mockResolvedValue({
        email: "test@example.com",
        password: "$2b$12$...",
      });
      bcrypt.compare = jest.fn().mockResolvedValue(false); // Simulate password mismatch

      await expect(
        authService.login({
          email: "test@example.com",
          password: "wrongpassword",
        })
      ).rejects.toThrow("invalid credentials");
    });

    it("should return auth response on successful login", async () => {
      UserAuthDb.findOne = jest.fn().mockResolvedValue({
        email: "test@example.com",
        password: "$2b$12$...",
      });
      bcrypt.compare = jest.fn().mockResolvedValue(true); // Simulate password match
      UserDb.findOne = jest.fn().mockResolvedValue({
        id: "userId",
        email: "test@example.com",
        role: "user",
      });

      const response = await authService.login({
        email: "test@example.com",
        password: "correctpassword",
      });

      expect(response).toHaveProperty("accessToken");
      expect(response).toHaveProperty("user");
      expect(response.user.email).toBe("test@example.com");
    });
  });
});
