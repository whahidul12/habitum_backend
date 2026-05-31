import { Document, Model } from "mongoose";

export interface IUser {
  name: string;
  email: string;
  password: string;
  avatar?: string;
  morningMotivation: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserMethods {
  matchPassword(plainPass: string): Promise<boolean>;
}

export type UserDocument = Document & IUser & IUserMethods;

export type UserModel = Model<IUser, {}, IUserMethods>;
