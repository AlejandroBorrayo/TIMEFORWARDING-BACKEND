import type { RoleTypeEnum } from './enum/role_type.enum';
import type { InviteStatusEnum } from './enum/invite-status.enum';

interface UrlCreateAccount {
  url_create_account?: string;
}

interface IsFromAssociation {
  name?: string;
  isToLeague?: boolean;
  isToClub?: boolean;
  isToTeam?: boolean;
}

interface IsFromLeague {
  name?: string;
  isToClub?: boolean;
  isToTeam?: boolean;
}

interface IsFromClub {
  name?: string;
  isToTeam?: boolean;
}

interface IsFromAdminEntity {
  name?: string;
}

export interface InviteTemplateModel {
  isFMF?: UrlCreateAccount;
  isDG?: UrlCreateAccount;
  isBox?: UrlCreateAccount;
  isFromAssociation?: IsFromAssociation;
  isFromLeague?: IsFromLeague;
  isFromClub?: IsFromClub;
  isToLeague: boolean;
  isToClub: boolean;
  isToTeam: boolean;
  invited_by_user: string;
  facebook_url: string;
  x_url: string;
  web_url: string;
  youtube_url: string;
}

export interface InviteAffiliationPlayerTemplateModel {
  isFMF?: UrlCreateAccount;
  isDG?: UrlCreateAccount;
  isBox?: UrlCreateAccount;
  isFromAssociation?: IsFromAdminEntity;
  isFromLeague?: IsFromAdminEntity;
  isFromClub?: IsFromAdminEntity;
  //isFromTeam?: IsFromAdminEntity;
  facebook_url: string;
  x_url: string;
  web_url: string;
  youtube_url: string;
}

export interface InviteAdminEntityTemplateModel
  extends InviteAffiliationPlayerTemplateModel {
  invited_by_user: string;
}

export interface FilterByEmailOrId {
  _id?: string;
}

export interface FilterInviteBy {
  inviteid?: string;
  email?: string;
  status?: InviteStatusEnum;
  invited_by_id?: string;
  invited_user_id?: string;
  invited_by_entityid?: string;
  invited_entity_type?: RoleTypeEnum;
  invite_type?: RoleTypeEnum;
  invite_to_entityid?: string;
  token?: string;
}
