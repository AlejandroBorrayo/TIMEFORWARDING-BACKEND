import type { RoleTypeEnum } from '../../../user/domain/enum/role_type.enum';

/**
 * Represents the base structure of a decoded JWT.
 * @property {string} sub - A unique identifier for the user (subject).
 * @property {number} iat - Token issue time (Unix timestamp).
 * @property {number} exp - Token expiration time (Unix timestamp).
 */
export type BaseDecoded = {
  sub: string;
  iat: number;
  exp: number;
};

/**
 * Represents decoded JWT user information.
 * @property {string} role - The user's role.
 * @property {RoleTypeEnum} roleType - The user's role type.
 * @property {string[]} entities - The user's entities.
 */
type RoleDecoded = {
  role?: string;
  roleType: RoleTypeEnum;
  entities: string[];
};

/**
 * Represents decoded JWT user information.
 * @property {string} username - The user's username.
 * @property {string} sub - A unique identifier for the user (subject).
 * @property {number} iat - Token issue time (Unix timestamp).
 * @property {number} exp - Token expiration time (Unix timestamp).
 * @property {string} email - The user's email address.
 * @property {RoleDecoded[]} roles - The user's roles.
 */
export type DecodedUser = BaseDecoded & {
  name: string;
  email: string;
  balance: number;
  role: string;
};

/**
 * Represents decoded user information from an external service.
 * @property {string} id - The unique identifier for the user in the external service.
 * @property {string} name - The name of the user.
 * @property {string} email - The email address of the user.
 * @property {string} sub - A unique identifier for the user (subject).
 * @property {number} iat - Timestamp indicating when the token was issued (in seconds since Unix epoch).
 * @property {number} exp - Timestamp indicating when the token expires.
 */
export type DecodedExternalUser = BaseDecoded & {
  id: string;
  name: string;
  email: string;
  balance: number;
};

/**
 * Represents decoded user information from an invite token.
 * @property {string} email - The email address of the invited user.
 * @property {string} sub - A unique identifier for the invited user.
 * @property {number} iat - Timestamp indicating when the token was issued (in seconds since Unix epoch).
 * @property {number} exp - Timestamp indicating when the token expires.
 * @property {string} token - The invite token.
 */
export type InviteDecodedUser = BaseDecoded & {
  email: string;
  token: string;
};

/**
 * Represents the decoded user information for a forgot password.
 * @property {string} email - The email address of the invited user.
 * @property {string} sub - A unique identifier for the invited user.
 * @property {number} iat - Timestamp indicating when the token was issued (in seconds since Unix epoch).
 * @property {number} exp - Timestamp indicating when the token expires.
 */
export type ForgotPasswordDecodedUser = BaseDecoded & {
  email: string;
};

/**
 * Represents the decoded user information for a change email.
 * @property {string} email - The new email address of the user.
 * @property {string} sub - A unique identifier for the invited user.
 * @property {number} iat - Timestamp indicating when the token was issued (in seconds since Unix epoch).
 * @property {number} exp - Timestamp indicating when the token expires.
 */
export type ChangeEmailDecodedUser = BaseDecoded & {
  email: string;
};

/**
 * Represents the decoded user information for a public invite.
 * @property {RoleTypeEnum} invite_type - The type of invite.
 * @property {RoleTypeEnum} invited_entity_type - The type of entity the user is invited to.
 * @property {string} invited_by_entityid - The entity ID of the user who invited the new user.
 * @property {string} invited_to_entityid - The entity ID of the user being invited.
 */
export type PublicInviteDecodedUser = BaseDecoded & {
  invite_to_entityid?: string;
  invite_type: RoleTypeEnum;
  invited_entity_type: RoleTypeEnum;
  invited_by_entityid?: string;
};
