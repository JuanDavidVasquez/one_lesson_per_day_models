import { 
  Column, 
  Entity, 
  ManyToOne, 
  JoinColumn,
  CreateDateColumn,
  UpdateDateColumn,
  PrimaryGeneratedColumn,
  Index,
  BeforeInsert,
  BeforeUpdate
} from "typeorm";
import { User } from "./user.model";

/**
 * Entidad Session para manejar sesiones de usuario
 * Solo permite una sesión activa por usuario para seguridad
 */
@Entity({ name: "sessions" })
@Index('idx_session_entity', ['authEntity'])
@Index('idx_session_entity_email', ['authEntity', 'userEmail'])
@Index('idx_session_active_by_entity', ['authEntity', 'userEmail', 'isActive'])
@Index('idx_session_active', ['isActive'])
@Index('idx_session_activity', ['lastActivity'])
@Index('idx_session_expires', ['expiresAt'])
export class Session {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  // ===== RELACIÓN CON USUARIO =====
  @Column({ name: 'user_id' })
  userId!: string;

  @Column({ 
    name: 'auth_entity',
    length: 50,
    comment: 'Nombre de la entidad/API desde donde se autenticó (user, admin, vendor, etc.)'
  })
  authEntity!: string;

  @Column({
    name: 'user_email',
    comment: 'Email del usuario para validaciones cruzadas'
  })
  userEmail!: string;

  // Relación polimórfica - no definimos ManyToOne específico aquí
  // ya que puede ser User, Admin, Vendor, etc.

  // ===== TOKENS Y AUTENTICACIÓN =====
  @Column({
    type: 'text',
    name: 'access_token',
    comment: 'JWT access token'
  })
  accessToken!: string;

  @Column({
    type: 'varchar',
    length: 500,
    name: 'refresh_token',
    nullable: true,
    comment: 'JWT refresh token'
  })
  refreshToken?: string;

  @Column({
    type: 'datetime',
    name: 'access_token_expires',
    comment: 'Cuándo expira el access token'
  })
  accessTokenExpires!: Date;

  @Column({
    type: 'datetime',
    name: 'refresh_token_expires',
    nullable: true,
    comment: 'Cuándo expira el refresh token'
  })
  refreshTokenExpires?: Date;

  // ===== ESTADO DE LA SESIÓN =====
  @Column({
    name: 'is_active',
    default: true,
    comment: 'Si la sesión está activa - solo una por usuario'
  })
  isActive!: boolean;

  @Column({
    type: 'datetime',
    nullable: true,
    name: 'last_activity',
    comment: 'Última actividad registrada'
  })
  lastActivity?: Date;

  // ===== INFORMACIÓN DEL DISPOSITIVO/NAVEGADOR =====
  @Column({
    type: 'varchar',
    length: 45,
    nullable: true,
    name: 'ip_address',
    comment: 'Dirección IP de donde se creó la sesión'
  })
  ipAddress?: string;

  @Column({
    type: 'text',
    nullable: true,
    name: 'user_agent',
    comment: 'User agent del navegador/dispositivo'
  })
  userAgent?: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
    name: 'device_name',
    comment: 'Nombre del dispositivo (ej: "iPhone 15", "Chrome on Windows")'
  })
  deviceName?: string;

  @Column({
    type: 'varchar',
    length: 50,
    nullable: true,
    name: 'device_type',
    comment: 'Tipo de dispositivo (mobile, desktop, tablet)'
  })
  deviceType?: string;

  // ===== METADATA =====
  @Column({
    type: 'json',
    nullable: true,
    comment: 'Información adicional de la sesión (ubicación, etc.)'
  })
  metadata?: Record<string, any>;

  // ===== TIMESTAMPS =====
  @CreateDateColumn({ name: 'created_at' })
  createdAt!: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt!: Date;

  @Column({
    type: 'datetime',
    nullable: true,
    name: 'expires_at',
    comment: 'Cuándo expira toda la sesión (para limpieza automática)'
  })
  expiresAt?: Date;

  // ===== HOOKS =====
  
  @BeforeInsert()
  @BeforeUpdate()
  updateLastActivity(): void {
    this.lastActivity = new Date();
  }

  // ===== MÉTODOS =====

  /**
   * Verificar si la sesión está activa y no ha expirado
   */
  isValidSession(): boolean {
    if (!this.isActive) return false;
    if (this.expiresAt && this.expiresAt < new Date()) return false;
    if (this.accessTokenExpires && this.accessTokenExpires < new Date()) return false;
    return true;
  }

  /**
   * Verificar si el refresh token es válido
   */
  isRefreshTokenValid(): boolean {
    if (!this.refreshToken) return false;
    if (!this.refreshTokenExpires) return false;
    return this.refreshTokenExpires > new Date();
  }

  /**
   * Marcar sesión como inactiva (logout)
   */
  deactivate(): void {
    this.isActive = false;
    this.lastActivity = new Date();
  }

  /**
   * Actualizar tokens de la sesión
   */
  updateTokens(accessToken: string, refreshToken?: string, accessTokenExpires?: Date, refreshTokenExpires?: Date): void {
    this.accessToken = accessToken;
    this.accessTokenExpires = accessTokenExpires || new Date(Date.now() + 3600000); // 1 hora por defecto
    
    if (refreshToken) {
      this.refreshToken = refreshToken;
      this.refreshTokenExpires = refreshTokenExpires || new Date(Date.now() + 7 * 24 * 3600000); // 7 días por defecto
    }
    
    this.lastActivity = new Date();
  }

  /**
   * Actualizar actividad de la sesión
   */
  updateActivity(ipAddress?: string, userAgent?: string): void {
    this.lastActivity = new Date();
    if (ipAddress) this.ipAddress = ipAddress;
    if (userAgent) this.userAgent = userAgent;
  }

  /**
   * Verificar si la sesión necesita renovación de token
   * @param minutesBeforeExpiry - Minutos antes de la expiración para considerar renovación
   */
  needsTokenRefresh(minutesBeforeExpiry: number = 15): boolean {
    if (!this.accessTokenExpires) return true;
    const refreshThreshold = new Date(this.accessTokenExpires.getTime() - (minutesBeforeExpiry * 60 * 1000));
    return new Date() > refreshThreshold;
  }

  /**
   * Obtener información de la sesión para logs
   */
  getSessionInfo(): object {
    return {
      sessionId: this.id,
      userId: this.userId,
      authEntity: this.authEntity,
      userEmail: this.userEmail,
      deviceName: this.deviceName,
      deviceType: this.deviceType,
      ipAddress: this.ipAddress,
      isActive: this.isActive,
      lastActivity: this.lastActivity,
      createdAt: this.createdAt
    };
  }

  /**
   * Convertir a objeto seguro (sin tokens sensibles)
   */
  toSafeObject(): Partial<Session> {
    return {
      id: this.id,
      userId: this.userId,
      authEntity: this.authEntity,
      userEmail: this.userEmail,
      isActive: this.isActive,
      lastActivity: this.lastActivity,
      deviceName: this.deviceName,
      deviceType: this.deviceType,
      createdAt: this.createdAt,
      expiresAt: this.expiresAt
    };
  }
}