import { CreateSchedule } from "../interfaces";
import { ScheduleDb } from "../models/merchant/merchant.schedule.model";

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
