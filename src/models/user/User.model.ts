import { Schema, model } from "mongoose";
import bcrypt from "bcryptjs";
import { IUser, IUserMethods, UserDocument, UserModel } from "./user.types.js";

const UserSchema = new Schema<IUser, UserModel, IUserMethods>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      unique: true,
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Please use a valid email address"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      trim: true,
      select: false,
    },
    avatar: {
      type: String,
      default: "",
    },
    morningMotivation: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret) => {
        const { password, __v, ...sanitized } = ret;
        return sanitized;
      },
    },
  },
);

UserSchema.pre("save", async function (this: UserDocument) {
  if (!this.isModified("password")) return;

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
});

UserSchema.methods.matchPassword = async function (
  this: UserDocument,
  plainPass: string,
): Promise<boolean> {
  return bcrypt.compare(plainPass, this.password);
};

const User = model<IUser, UserModel>("User", UserSchema);
export default User;
