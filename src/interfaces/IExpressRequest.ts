import { Request } from "express";

// extenda the request interface to add details  extracted from decoded token
export interface IExpressRequest extends Request {
  userId?: string;
  email?: string;
  role?: string;
}
