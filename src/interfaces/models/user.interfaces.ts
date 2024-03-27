import { BaseModel } from "./baseModel";

export enum userRole {
  USER = "user",
  MERCHANT = "merchant",
}
export interface UserInterfaces extends BaseModel {
  email: string;
  fullName: string;
  role: string;
  phoneNumber: string;
  subscribed: boolean;
}

export interface UserAuth extends BaseModel {
  email: string;
  password: string;
  user: string;
  role: userRole;
  recognisedDevices: string[];
  verified: boolean;
}

export interface UserToken extends BaseModel {
  accessToken: string;
  email: string;
  user: string;
  deviceId: string;
}

export interface UserVerification extends BaseModel {
  email: string;
  otp: string;
  deviceId: string;
  type: OtpType;
  expiresAt: Date;
}

export enum OtpType {
  SIGN_UP = "SIGNUP",
  LOGIN = "LOGIN",
  FORGOT_PASSWORD = "FORGOT_PASSWORD",
}
