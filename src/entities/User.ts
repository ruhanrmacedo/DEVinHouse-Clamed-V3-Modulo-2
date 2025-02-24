import { Column, Entity } from "typeorm";
import { UserProfileEnum } from "./enums/UserProfileEnum";
import { BaseUser } from "./BaseUser";

@Entity("users")
export class User extends BaseUser {
  @Column({ type: "enum", enum: UserProfileEnum, nullable: false })
  profile: UserProfileEnum;
}
