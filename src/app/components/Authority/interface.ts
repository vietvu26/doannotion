export interface IAuthSelect {
  title?: string;
  subTitle?: string;
  key?: string;
  createdBy?: string;
  createdDate?: number;
  lastModifiedBy?: string;
  lastModifiedDate?: number;
  id?: string;
  name?: string;
  icon?: string;
}

export interface IUserAcl {
  aclId?: string;
  createdBy?: string;
  createdDate?: string;
  custId?: number;
  enable?: boolean;
  groupUserId?: number;
  id?: number;
  lastModifiedBy?: string;
  lastModifiedDate?: string;
  orgIn?: string;
  orgName?: string;
  resourceId?: string;
  template?: boolean;
  type?: 'L' | 'T' | 'C ';
  updateByListTask?: boolean;
  userId?: number;
  name?: string;
  email?: string;
  avatar?: string;
  haveAvatar?: boolean;
  typeGroup?: 'user' | 'group';
}
