import * as mongoose from "mongoose";
import { Schema } from "mongoose";
import { config } from "../../constants/settings";
import { v4 as uuidv4 } from "uuid";
import { Schedule, ScheduleStatus } from "../../interfaces";

const scheduleSchema = new Schema<Schedule>(
  {
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
  },
  {
    toObject: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        return ret;
      },
    },
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        return ret;
      },
    },
    timestamps: true,
    versionKey: false,
    //
  }
);

export const ScheduleDb = mongoose.model(
  config.mongodb.collections.schedule,
  scheduleSchema
);
