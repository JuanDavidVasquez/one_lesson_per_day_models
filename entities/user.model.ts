import { Column, Entity } from "typeorm";
import { BaseUser } from "./base-user.model";
import { UserRole } from "../shared/enums/user.enums";

/**
 * Entidad User extends BaseUser
 * 
 * NOTA: No tiene relación directa con Session por diseño.
 * Las sesiones se manejan independientemente usando userId + authEntity
 */
@Entity({ name: "users" })
export class User extends BaseUser {

  @Column({
    comment: 'Roles user',
    type: 'enum',
    enum: UserRole,
    nullable: true
  })
  roles?: UserRole;

  /**
   * Obtener authEntity para esta entidad
   */
  getAuthEntity(): string {
    return 'users';
  }

  /**
   * Obtener datos básicos para crear sesión
   */
  getSessionData(): { userId: string; userEmail: string; authEntity: string } {
    return {
      userId: this.id,
      userEmail: this.email,
      authEntity: this.getAuthEntity()
    };
  }

  /**
   * Convertir a objeto público
   */
  override toPublic() {
    const baseData = super.toPublic();
    return {
      ...baseData,
      authEntity: this.getAuthEntity()
    };
  }
}