export interface IUser {
    userId: string;
    name: string;
    email: string;
    role: "USER" | "ADMIN" | "PREMIUM_USER";
    iat?: number;
    exp?: number;
  }
  