import { userRole } from "../models/user.interfaces";

export interface SignupRequest {
  email: string;
  fullName: string;
  password: string;
  role: userRole;
}

export interface VerifyEmailRequest {
  email: string;
  otp: string;
}
