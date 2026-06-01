import type { IUser } from "../models/user/user.types.ts";

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export {};
