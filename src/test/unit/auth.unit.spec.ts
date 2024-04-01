import * as authService from "../../services/auth.service";
import { UserAuthDb, UserDb, UserVerDb } from "../../models";
import { userRole } from "../../interfaces";
import { Mailer } from "../../services/email.service";
import * as OtpModule from "../../helpers/utils";

describe("auth service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
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
});
