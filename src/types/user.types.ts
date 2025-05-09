import { TPost } from "./post.types";

export type TRole = "ADMIN" | "USER" | "PREMIUM_USER" | null;
export type TUser = {
  id: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
  userDetails?: UserDetail;
  authoredPosts?: TPost[];
};

export enum UserRole {
  USER = "USER",
  PREMIUM_USER = "PREMIUM_USER",
  ADMIN = "ADMIN"
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  BLOCKED = "BLOCKED"
}

export type UserDetail = {
  id: string;
  userId: string;
  name: string;
  profilePhoto?: string | null;
  contactNumber?: string | null;
  createdAt: Date;
  updatedAt: Date;
};
