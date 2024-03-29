import { BaseModel } from "./baseModel";

export interface Merchant extends BaseModel {
  user: string;
  schedule: Schedule[];
}

interface Schedule {
  date: Date;
  startTime: string;
  ednTime: string;
}
