import { User } from "../models/user.interfaces";

export interface AuthResponse {
  accessToken: string;
  user: User;
}
