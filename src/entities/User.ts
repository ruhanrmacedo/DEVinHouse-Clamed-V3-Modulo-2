import { Column, Entity, OneToOne } from "typeorm";
import { UserProfileEnum } from "./enums/UserProfileEnum";
import { BaseUser } from "./BaseUser";
import { Driver } from "./Driver";
import { Branch } from "./Branch";

@Entity("users")
export class User extends BaseUser {
  @Column({ type: "enum", enum: UserProfileEnum, nullable: false })
  profile: UserProfileEnum;

  @OneToOne(() => Branch, (branch) => branch.user)
  branch?: Branch;

  @OneToOne(() => Driver, (driver) => driver.user)
  driver?: Driver;
}
