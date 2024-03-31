import { CreateSchedule, Schedule } from "../interfaces";
import { ScheduleDb } from "../models";

export async function createSchedule(
  user: string,
  body: CreateSchedule[]
): Promise<void> {
  /* save multiple schedule details ay once for a single merchant*/
  const schedules = body.map((schedule) => ({
    ...schedule,
    merchant: user,
  }));

  await ScheduleDb.create(schedules);
}

export async function viewMerchantSchedule(user: string): Promise<Schedule[]> {
  return await ScheduleDb.find<Schedule>({ merchant: user });
}
