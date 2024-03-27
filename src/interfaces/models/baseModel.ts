import { type Document } from "mongoose";

export interface BaseModel extends Document {
  id: string;
  createdAt: string;
  updatedAt: string;
}
