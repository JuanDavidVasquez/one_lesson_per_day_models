import { Column, Entity, OneToMany } from "typeorm";
import { BaseUser } from "./base-user.model";
import { UserRole } from "../shared/enums/user.enums";



/**
 * Entidad User extends BaseUser
 * 
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

  // ===== RELACIONES =====
  
/*   @OneToMany(() => Session, (session) => session.user, {
    cascade: true,
  })
  sessions!: Session[]; */
  

  // ===== MÉTODOS ESPECÍFICOS =====

  /**
   * Verificar si el usuario tiene una sesión activa
   */
/*   hasActiveSession(): boolean {
    return this.sessions?.some((s) => s.isActive()) ?? false;
  }
 */
  /**
   * Convertir a objeto público sobrescribiendo BaseUser
   */
/*   override toPublic() {
    const baseData = super.toPublic();
    return {
      ...baseData,
      hasActiveSession: this.hasActiveSession(),
    };
  } */
}
