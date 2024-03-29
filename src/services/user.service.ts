import { NotFoundError, User } from "../interfaces";
import { UserDb } from "../models";

export async function getUserProfle(user: string): Promise<User> {
  const userDetails = await UserDb.findById<User>(user);
  if (!userDetails) {
    throw new NotFoundError("user not found");
  }
  return userDetails;
}
