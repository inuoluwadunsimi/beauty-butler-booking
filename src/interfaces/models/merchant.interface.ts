import { BaseModel } from "./baseModel";

export interface Merchant extends BaseModel {
  user: string;
  schedule: Schedules[];
}

export interface Schedule extends BaseModel {
  merchant: string;
  date: Date;
  startTime: string;
  endTime: string;
  status: ScheduleStatus;
}

export enum ScheduleStatus {
  BOOKED = "booked",
  AVAILABLE = "available",
}

interface Schedules {
  date: Date;
  startTime: string;
  ednTime: string;
}
