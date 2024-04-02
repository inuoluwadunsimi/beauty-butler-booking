import { User } from "../models/user.interfaces";

// auth response for login and email verification
export interface AuthResponse {
  accessToken: string;
  user: User;
}
