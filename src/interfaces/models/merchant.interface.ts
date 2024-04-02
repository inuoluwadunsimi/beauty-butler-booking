import { BaseModel } from "./baseModel";

//merchant related model interfaces
export interface Schedule extends BaseModel {
  merchant: string;
  date: Date;
  startTime: string;
  endTime: string;
  status: ScheduleStatus;
}

export interface Appointment extends BaseModel {
  schedule: string;
  customer: string;
  merchant: string;
  status: AppointmentStatus;
}

export enum AppointmentStatus {
  COMPLETED = "completed",
  CANCELED = "cancelled",
  PENDING = "pending",
}

export enum ScheduleStatus {
  BOOKED = "booked",
  AVAILABLE = "available",
}
