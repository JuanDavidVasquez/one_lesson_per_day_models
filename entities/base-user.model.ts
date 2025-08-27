import { 
  Column, 
  CreateDateColumn, 
  DeleteDateColumn, 
  PrimaryGeneratedColumn, 
  UpdateDateColumn,
  AfterLoad,
  BeforeInsert,
  BeforeUpdate,
  Index
} from "typeorm";

// Importar desde tu submodule
import { USER_CONSTANTS } from '../shared/constants/user.constants';
import { UserStatus, UserProvider } from '../shared/enums/user.enums';
import * as UserHelpers from '../shared/helpers/base-user.helpers';

/**
 * Entidad base para todos los tipos de usuarios
 * Contiene los campos comunes que necesita el sistema de autenticación
 */
export abstract class BaseUser {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // ===== INFORMACIÓN BÁSICA =====
  @Column({ unique: true })
  @Index('idx_user_email')
  email!: string;

  @Column({ unique: true, nullable: true })
  @Index('idx_user_username')
  username?: string;

  @Column({ select: false })
  password!: string;

  @Column({ name: 'first_name' })
  firstName!: string;

  @Column({ name: 'last_name' })
  lastName!: string;

  // ===== ESTADO Y CONFIGURACIÓN =====
  @Column({
    type: 'enum',
    enum: UserStatus,
    default: UserStatus.ACTIVE
  })
  status!: UserStatus;

  @Column({ 
    name: 'is_email_verified',
    default: false 
  })
  isEmailVerified!: boolean;

  @Column({
    type: 'enum',
    enum: UserProvider,
    default: UserProvider.LOCAL
  })
  provider!: UserProvider;

  @Column({ 
    name: 'provider_id',
    nullable: true 
  })
  providerId?: string;

  // ===== VERIFICACIÓN Y TOKENS =====
  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    name: 'verification_code'
  })
  verificationCode?: string | null;

  @Column({
    type: 'datetime',
    nullable: true,
    name: 'verification_code_expires'
  })
  verificationCodeExpires?: Date | null;

  @Column({
    type: 'varchar',
    length: 255,
    nullable: true,
    name: 'reset_password_token'
  })
  resetPasswordToken?: string | null;

  @Column({
    type: 'datetime',
    nullable: true,
    name: 'reset_password_expires'
  })
  resetPasswordExpires?: Date | null;

  // ===== PERFIL =====
  @Column({
    type: 'varchar',
    length: 500,
    nullable: true,
    name: 'avatar_path'
  })
  avatarPath?: string | null;

  // Campo calculado
  avatarUrl?: string;

  @Column({
    type: 'varchar',
    length: 20,
    nullable: true
  })
  phone?: string;

  @Column({
    type: 'date',
    nullable: true,
    name: 'date_of_birth'
  })
  dateOfBirth?: Date;

  @Column({
    type: 'varchar',
    length: 50,
    default: USER_CONSTANTS.DEFAULT_TIMEZONE
  })
  timezone!: string;

  @Column({
    type: 'varchar',
    length: 5,
    default: USER_CONSTANTS.DEFAULT_LOCALE
  })
  locale!: string;

  // ===== SEGURIDAD Y TRACKING =====
  @Column({
    type: 'datetime',
    nullable: true,
    name: 'last_login_at'
  })
  @Index('idx_user_last_login')
  lastLoginAt?: Date | null;

  @Column({
    default: 0,
    name: 'login_count'
  })
  loginCount!: number;

  @Column({
    default: 0,
    name: 'login_attempts'
  })
  loginAttempts!: number;

  @Column({
    type: 'datetime',
    nullable: true,
    name: 'locked_until'
  })
  lockedUntil?: Date | null;

  @Column({
    type: 'varchar',
    length: 45,
    nullable: true,
    name: 'last_login_ip'
  })
  lastLoginIp?: string;

  @Column({
    type: 'text',
    nullable: true,
    name: 'last_user_agent'
  })
  lastUserAgent?: string;

  // ===== TIMESTAMPS =====
  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt?: Date | null;

  // ===== HOOKS =====
  
  @AfterLoad()
  generateAvatarUrl(): void {
    this.avatarUrl = UserHelpers.generateAvatarUrl(this.avatarPath, this);
  }

  @BeforeInsert()
  @BeforeUpdate()
  validateAndNormalize(): void {
    const normalized = UserHelpers.normalizeUserData({
      email: this.email,
      username: this.username,
      firstName: this.firstName,
      lastName: this.lastName
    });
    
    Object.assign(this, normalized);

    // Validar timezone y locale
    if (!this.timezone) {
      this.timezone = USER_CONSTANTS.DEFAULT_TIMEZONE;
    }

    if (!this.locale) {
      this.locale = USER_CONSTANTS.DEFAULT_LOCALE;
    }
  }

  // ===== MÉTODOS HELPERS (DELEGADOS) =====

  /**
   * Obtener nombre completo
   */
  getFullName(): string {
    return UserHelpers.getFullName(this);
  }

  /**
   * Obtener iniciales
   */
  getInitials(): string {
    return UserHelpers.getInitials(this);
  }

  /**
   * Obtener nombre de display
   */
  getDisplayName(): string {
    return UserHelpers.getDisplayName(this);
  }

  /**
   * Verificar si está eliminado
   */
  isDeleted(): boolean {
    return UserHelpers.isDeleted(this);
  }

  /**
   * Verificar si está activo
   */
  isActive(): boolean {
    return UserHelpers.isActive(this);
  }

  /**
   * Verificar si está bloqueado
   */
  isLocked(): boolean {
    return UserHelpers.isLocked(this);
  }

  /**
   * Verificar si puede iniciar sesión
   */
  canLogin(): boolean {
    return UserHelpers.canLogin(this);
  }

  /**
   * Incrementar intentos de login
   */
  incrementLoginAttempts(): void {
    const result = UserHelpers.incrementLoginAttempts(this.loginAttempts);
    this.loginAttempts = result.loginAttempts;
    this.lockedUntil = result.lockedUntil;
  }

  /**
   * Reset intentos de login exitoso
   */
  resetLoginAttempts(): void {
    this.loginAttempts = 0;
    this.lockedUntil = null;
    this.loginCount += 1;
    this.lastLoginAt = new Date();
  }

  /**
   * Verificar si el token de reset es válido
   */
  isResetTokenValid(token: string): boolean {
    return UserHelpers.isResetTokenValid(this, token);
  }

  /**
   * Verificar si el código de verificación es válido
   */
  isVerificationCodeValid(code: string): boolean {
    return UserHelpers.isVerificationCodeValid(this, code);
  }

  /**
   * Actualizar información de login
   */
  updateLoginInfo(ip?: string, userAgent?: string): void {
    const updateData = UserHelpers.generateLoginUpdateData(ip, userAgent);
    Object.assign(this, updateData);
    this.loginCount += 1;
  }

  /**
   * Convertir a objeto público
   */
  toPublic(): Partial<BaseUser> {
    return UserHelpers.sanitizeUserData(this);
  }

  /**
   * Limpiar datos de verificación
   */
  clearVerificationData(): void {
    this.verificationCode = null;
    this.verificationCodeExpires = null;
  }

  /**
   * Limpiar datos de reset de password
   */
  clearResetPasswordData(): void {
    this.resetPasswordToken = null;
    this.resetPasswordExpires = null;
  }

  /**
   * Establecer código de verificación
   */
  setVerificationCode(): void {
    this.verificationCode = UserHelpers.generateVerificationCode();
    this.verificationCodeExpires = UserHelpers.generateVerificationExpiry();
  }

  /**
   * Establecer token de reset de password
   */
  setResetPasswordToken(): void {
    this.resetPasswordToken = UserHelpers.generateRandomToken();
    this.resetPasswordExpires = UserHelpers.generateResetTokenExpiry();
  }
}