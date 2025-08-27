export interface LoginTrackingUserLike {
  lastLoginAt?: Date | null;
  loginCount: number;
  lastLoginIp?: string;
  lastUserAgent?: string;
}
