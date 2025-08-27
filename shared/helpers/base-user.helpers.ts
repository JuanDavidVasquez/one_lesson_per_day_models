import { USER_CONSTANTS } from '../constants/user.constants';
import { UserStatus, UserProvider } from '../enums/user.enums';
import { AuthUserLike } from '../interfaces/authUserLike.interface';
import { TokenUserLike } from '../interfaces/tokenUserLike.interface';
import { UserLike } from '../interfaces/userLike.interface';
/**
 * Generar nombre completo
 */
export const getFullName = (user: Pick<UserLike, 'firstName' | 'lastName'>): string => {
  if (!user.firstName || !user.lastName) {
    return '';
  }
  return `${user.firstName.trim()} ${user.lastName.trim()}`.trim();
};

/**
 * Generar iniciales
 */
export const getInitials = (user: Pick<UserLike, 'firstName' | 'lastName'>): string => {
  if (!user.firstName || !user.lastName) {
    return '';
  }
  
  const firstInitial = user.firstName.charAt(0).toUpperCase();
  const lastInitial = user.lastName.charAt(0).toUpperCase();
  
  return `${firstInitial}${lastInitial}`;
};

/**
 * Generar nombre de display
 */
export const getDisplayName = (user: Pick<UserLike, 'username' | 'firstName' | 'lastName'>): string => {
  if (user.username?.trim()) {
    return user.username.trim();
  }
  
  return getFullName(user) || 'Usuario';
};

// ===== HELPERS DE AVATAR =====

/**
 * Generar URL de avatar por defecto usando DiceBear
 */
export const getDefaultAvatarUrl = (user: Pick<UserLike, 'firstName' | 'lastName' | 'email'>): string => {
  const initials = getInitials(user);
  
  if (initials) {
    return `https://api.dicebear.com/7.x/initials/svg?seed=${initials}&backgroundColor=random&fontSize=40`;
  }
  
  // Fallback usando email hash
  return `https://api.dicebear.com/7.x/identicon/svg?seed=${user.email}&backgroundColor=random`;
};

/**
 * Generar URL de Gravatar
 */
export const getGravatarUrl = (email: string, size: number = 200, defaultType: string = 'identicon'): string => {
  if (!email) {
    return getDefaultAvatarUrl({ firstName: '', lastName: '', email: '' });
  }
  
  // En un proyecto real, usarías crypto.createHash('md5')
  // Por simplicidad, aquí usamos una función básica
  const hash = simpleEmailHash(email.toLowerCase().trim());
  return `https://www.gravatar.com/avatar/${hash}?d=${defaultType}&s=${size}`;
};

/**
 * Generar URL completa del avatar
 */
export const generateAvatarUrl = (
  avatarPath?: string | null,
  user?: Pick<UserLike, 'firstName' | 'lastName' | 'email'>,
  baseUrl?: string
): string => {
  const fileBaseUrl = baseUrl || process.env.FILE_BASE_URL || 'http://localhost:3000';
  
  if (avatarPath?.trim()) {
    return `${fileBaseUrl}/uploads/avatars/${avatarPath}`;
  }
  
  if (user) {
    return getDefaultAvatarUrl(user);
  }
  
  return `${fileBaseUrl}/assets/default-avatar.png`;
};

// ===== HELPERS DE ESTADO Y VALIDACIÓN =====

/**
 * Verificar si está eliminado (soft delete)
 */
export const isDeleted = (user: Pick<AuthUserLike, 'deletedAt'>): boolean => {
  return user.deletedAt !== null && user.deletedAt !== undefined;
};

/**
 * Verificar si está activo
 */
export const isActive = (user: Pick<AuthUserLike, 'status' | 'deletedAt'>): boolean => {
  return user.status === UserStatus.ACTIVE && !isDeleted(user);
};

/**
 * Verificar si está bloqueado por intentos de login
 */
export const isLocked = (user: Pick<AuthUserLike, 'lockedUntil'>): boolean => {
  return user.lockedUntil !== null && 
         user.lockedUntil !== undefined && 
         user.lockedUntil > new Date();
};

/**
 * Verificar si puede iniciar sesión
 */
export const canLogin = (user: AuthUserLike): boolean => {
  return isActive(user) && !isLocked(user);
};

/**
 * Verificar si necesita ser bloqueado por intentos
 */
export const shouldBeLocked = (user: Pick<AuthUserLike, 'loginAttempts'>): boolean => {
  return user.loginAttempts >= USER_CONSTANTS.MAX_LOGIN_ATTEMPTS;
};

// ===== HELPERS DE TOKENS Y CÓDIGOS =====

/**
 * Verificar si el token de reset de password es válido
 */
export const isResetTokenValid = (
  user: Pick<TokenUserLike, 'resetPasswordToken' | 'resetPasswordExpires'>,
  token: string
): boolean => {
  return user.resetPasswordToken === token && 
         user.resetPasswordExpires !== null && 
         user.resetPasswordExpires !== undefined &&
         user.resetPasswordExpires > new Date();
};

/**
 * Verificar si el código de verificación es válido
 */
export const isVerificationCodeValid = (
  user: Pick<TokenUserLike, 'verificationCode' | 'verificationCodeExpires'>,
  code: string
): boolean => {
  return user.verificationCode === code &&
         user.verificationCodeExpires !== null &&
         user.verificationCodeExpires !== undefined &&
         user.verificationCodeExpires > new Date();
};

/**
 * Generar fecha de expiración para tokens
 */
export const generateTokenExpiry = (hours: number = 1): Date => {
  return new Date(Date.now() + (hours * 60 * 60 * 1000));
};

/**
 * Generar fecha de expiración para códigos de verificación
 */
export const generateVerificationExpiry = (): Date => {
  return new Date(Date.now() + USER_CONSTANTS.VERIFICATION_CODE_EXPIRY);
};

/**
 * Generar fecha de expiración para reset de password
 */
export const generateResetTokenExpiry = (): Date => {
  return new Date(Date.now() + USER_CONSTANTS.RESET_TOKEN_EXPIRY);
};

// ===== HELPERS DE TRACKING DE LOGIN =====

/**
 * Generar datos de actualización de login
 */
export const generateLoginUpdateData = (ip?: string, userAgent?: string) => {
  return {
    lastLoginAt: new Date(),
    lastLoginIp: ip?.substring(0, 45) || null, // Limitar longitud
    lastUserAgent: userAgent?.substring(0, 1000) || null, // Limitar longitud
    loginAttempts: 0,
    lockedUntil: null,
  };
};

/**
 * Generar fecha de bloqueo
 */
export const generateLockUntil = (): Date => {
  return new Date(Date.now() + USER_CONSTANTS.LOCK_TIME);
};

/**
 * Incrementar contador de intentos de login
 */
export const incrementLoginAttempts = (currentAttempts: number): {
  loginAttempts: number;
  lockedUntil: Date | null;
} => {
  const newAttempts = currentAttempts + 1;
  
  return {
    loginAttempts: newAttempts,
    lockedUntil: newAttempts >= USER_CONSTANTS.MAX_LOGIN_ATTEMPTS 
      ? generateLockUntil() 
      : null,
  };
};

// ===== HELPERS DE NORMALIZACIÓN =====

/**
 * Normalizar email
 */
export const normalizeEmail = (email: string): string => {
  return email.toLowerCase().trim();
};

/**
 * Normalizar username
 */
export const normalizeUsername = (username: string): string => {
  return username.toLowerCase().trim();
};

/**
 * Normalizar datos de usuario antes de guardar
 */
export const normalizeUserData = (userData: {
  email?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
}) => {
  const normalized: any = {};
  
  if (userData.email) {
    normalized.email = normalizeEmail(userData.email);
  }
  
  if (userData.username) {
    normalized.username = normalizeUsername(userData.username);
  }
  
  if (userData.firstName) {
    normalized.firstName = userData.firstName.trim();
  }
  
  if (userData.lastName) {
    normalized.lastName = userData.lastName.trim();
  }
  
  return normalized;
};

// ===== HELPERS DE SEGURIDAD =====

/**
 * Limpiar datos sensibles de un objeto usuario
 */
export const sanitizeUserData = (user: any) => {
  const {
    password,
    resetPasswordToken,
    resetPasswordExpires,
    verificationCode,
    verificationCodeExpires,
    loginAttempts,
    lockedUntil,
    lastLoginIp,
    lastUserAgent,
    ...cleanUser
  } = user;
  
  return cleanUser;
};

/**
 * Generar código de verificación aleatorio
 */
export const generateVerificationCode = (length: number = 6): string => {
  return Math.random().toString(36).substring(2, 2 + length).toUpperCase();
};

/**
 * Generar token aleatorio
 */
export const generateRandomToken = (length: number = 32): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return result;
};

// ===== HELPER PRIVADO =====

/**
 * Hash simple para email (en producción usar crypto.createHash)
 */
function simpleEmailHash(email: string): string {
  let hash = 0;
  if (email.length === 0) return hash.toString();
  
  for (let i = 0; i < email.length; i++) {
    const char = email.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32bit integer
  }
  
  return Math.abs(hash).toString(16);
}

// ===== HELPERS DE VALIDACIÓN =====

/**
 * Validar email
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validar password (mínimo 8 caracteres, al menos una mayúscula, una minúscula y un número)
 */
export const isValidPassword = (password: string): boolean => {
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

/**
 * Validar username (3-20 caracteres, solo letras, números y guiones bajos)
 */
export const isValidUsername = (username: string): boolean => {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
};

/**
 * Validar phone (formato internacional básico)
 */
export const isValidPhone = (phone: string): boolean => {
  const phoneRegex = /^\+?[\d\s\-\(\)]{10,15}$/;
  return phoneRegex.test(phone);
};