import type { RoleTypeEnum } from '../../../user/domain/enum/role_type.enum';

export const VERIFY_ROLE_SERVICE = Symbol('VerifyRoleServiceInterface');

export interface VerifyRoleServiceInterface {
  run(userid: string, roleType: RoleTypeEnum): Promise<boolean>;
}
