import type { IUser } from "../models/user/user.types.js";
import { Types } from "mongoose";

declare global {
  namespace Express {
    interface User extends IUser {
      _id: Types.ObjectId | string;
    }

    interface Request {
      user?: User;
    }
  }
}

export {};
