import jwt, { SignOptions } from "jsonwebtoken";
import { env } from "../../config/env.js";
import { ApiError } from "../../utils/ApiError.js";
import User from "../../models/user/User.model.js";
import type {
  RegisterDto,
  LoginDto,
  UpdateProfileDto,
  AuthResponse,
} from "./auth.types.js";

const signToken = (id: string): string => {
  return jwt.sign({ id }, env.JWT_SECRET, {
    expiresIn: (env.JWT_EXPIRES_IN as SignOptions["expiresIn"]) || "30d",
  });
};

export const register = async (data: RegisterDto): Promise<AuthResponse> => {
  const exists = await User.findOne({ email: data.email.toLowerCase() });
  if (exists) throw ApiError.badRequest("Email already registered");

  const user = await User.create({
    name: data.name,
    email: data.email.toLowerCase(),
    password: data.password,
    avatar: data.name.charAt(0).toUpperCase(),
  });

  const token = signToken(user._id.toString());

  return {
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      morningMotivation: user.morningMotivation,
    },
    token,
  };
};

export const login = async (data: LoginDto): Promise<AuthResponse> => {
  const user = await User.findOne({ email: data.email.toLowerCase() }).select(
    "+password",
  );

  if (!user || !(await user.matchPassword(data.password))) {
    throw ApiError.unauthorized("Invalid email or password");
  }

  const token = signToken(user._id.toString());

  return {
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      morningMotivation: user.morningMotivation,
    },
    token,
  };
};

export const updateProfile = async (
  userId: string,
  data: UpdateProfileDto,
): Promise<AuthResponse["user"]> => {
  const user = await User.findById(userId);
  if (!user) throw ApiError.notFound("User not found");

  if (data.name !== undefined) {
    user.name = data.name;
    user.avatar = data.name.charAt(0).toUpperCase();
  }

  if (data.morningMotivation !== undefined) {
    user.morningMotivation = data.morningMotivation;
  }

  await user.save();

  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    morningMotivation: user.morningMotivation,
  };
};
