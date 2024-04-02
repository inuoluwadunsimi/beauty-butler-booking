import { type Document } from "mongoose";

// base mongoose model interfaces that extends mongoose documents and includes
// id and date created/ updated
export interface BaseModel extends Document {
  id: string;
  createdAt: string;
  updatedAt: string;
}
