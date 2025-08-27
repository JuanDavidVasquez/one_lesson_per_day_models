export interface TokenUserLike {
  resetPasswordToken?: string | null;
  resetPasswordExpires?: Date | null;
  verificationCode?: string | null;
  verificationCodeExpires?: Date | null;
}
