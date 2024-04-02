import * as randomString from "randomstring";

// function to generate 6 digit code for otp
export function generateOtp(): string {
  return randomString.generate({
    length: 6,
    charset: "numeric",
  });
}
