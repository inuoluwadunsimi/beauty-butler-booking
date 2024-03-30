import { NotFoundError, User } from "../interfaces";
import { UserDb, UserTokenDb } from "../models";

export async function getUserProfle(user: string): Promise<User> {
  const userDetails = await UserDb.findById<User>(user);
  if (!userDetails) {
    throw new NotFoundError("user not found");
  }
  return userDetails;
}

export async function logout(user: string): Promise<void> {
  /* delete all exisiting tokens*/
  await UserTokenDb.deleteMany({ user });
}
