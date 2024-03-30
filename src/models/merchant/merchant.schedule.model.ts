import * as mongoose from "mongoose";
import { Schema } from "mongoose";
import { config } from "../../constants/settings";
import { v4 as uuidv4 } from "uuid";
import { ScheduleStatus } from "../../interfaces";

const scheduleSchema = new Schema({
  _id: {
    type: String,
    default: function genUUID() {
      return uuidv4();
    },
  },
  merchant: {
    type: String,
    required: true,
    ref: config.mongodb.collections.users,
  },
  date: {
    type: Date,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
  },
  status: {
    type: String,
    default: ScheduleStatus.AVAILABLE,
    enum: Object.values(ScheduleStatus),
  },
});

export const ScheduleDb = mongoose.model(
  config.mongodb.collections.schedule,
  scheduleSchema
);
