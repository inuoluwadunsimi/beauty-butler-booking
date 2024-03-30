import {
  NotFoundError,
  Schedule,
  ScheduleStatus,
  User,
  userRole,
} from "../interfaces";
import { ScheduleDb, UserDb, UserTokenDb } from "../models";

export async function getUserProfle(user: string): Promise<User> {
  const userDetails = await UserDb.findById<User>(user);
  if (!userDetails) {
    throw new NotFoundError("user not found");
  }
  return userDetails;
}

export async function getMerchants(): Promise<User[]> {
  return await UserDb.find<User>({ role: userRole.MERCHANT });
}

export async function getMerchantSchedule(
  merchantId: string
): Promise<Schedule[]> {
  /* find all schdules that match the merchant's ID and have not yet been booked*/
  return await ScheduleDb.find<Schedule>({
    merchant: merchantId,
    status: ScheduleStatus.AVAILABLE,
  });
}

export async function logout(user: string): Promise<void> {
  /* delete all exisiting tokens*/
  await UserTokenDb.deleteMany({ user });
}
