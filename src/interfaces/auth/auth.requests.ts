import { userRole } from "../models/user.interfaces";

//signup request body
export interface SignupRequest {
  email: string;
  fullName: string;
  password: string;
  role: userRole;
}

// verify email request body
export interface VerifyEmailRequest {
  email: string;
  otp: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}
