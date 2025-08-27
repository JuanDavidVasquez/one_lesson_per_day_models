import { UserStatus } from "../enums/user.enums";

export interface AuthUserLike {
  loginAttempts: number;
  lockedUntil?: Date | null;
  status: UserStatus;
  deletedAt?: Date | null;
}