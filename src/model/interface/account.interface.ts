export interface IAccount {
  id?: number;
  activated?: boolean;
  authorities?: string[];
  email?: string;
  firstName?: string;
  langKey?: string;
  lastName?: string;
  login?: string;
  imageUrl?: string;
  phone?: string;
  dob?: any;
  gender?: string;
  address?: string;
  avatar?: string;
  custType?: string;
  custId?: number;
  orgIn?: string;
  orgId?: number;
  orgName?: string;
  parentOrgName?: string;
  taxCodeOrg?: string;
  acNameOrg?: string;
  signature?: string;
  orgCode?: string;
  digitalSignature?: any;
  organization?: any;
  subOrganizations?: any;
  createdBy?: string;
  emailCustomer?: any;
  existedIdCard?: any;
  step?: any;
  legalType?: any;
  roles?: any;
  personalName?: any;
}

export interface IResponseLogin {
  access_token: string;
  expires_in: number;
  refresh_token: string;
}

export interface IUser {
  id: string;
  email: string;
  phone: any;
  personalName: string;
  orgIn: string;
  orgName: string;
  custId: number;
  status: string;
  role: any;
  position: any;
  description: any;
  resource: string;
  type: string;
  avatar: any;
  imageUrl: string;
  acOrgName: any;
  roles: any[];
  roleIds: any[];
  resourceId: number;
  author: any;
  createdDate: string;
  lastModifiedDate: string;
  userAuthor: any;
  roleLevel: any[];
  priority: number;
  attrs: Attrs;
}

export interface Attrs {}

export interface IOrgIn {
  id: number;
  name: string;
  acName: string;
  custId: number;
  folderName: string;
  folderPath: string;
  orgCode: string;
  parentId: any;
  type: string;
  orgIn: string;
  idOwner: any;
  folderId: string;
  createdBy: string;
  activated: boolean;
  blocked: any;
  userOwner: any;
  taxCode: string;
  firstNameOwner: any;
  lastNameOwner: any;
  emailOwner: any;
  statusOwner: any;
  globalName: string;
  mainJob: string;
  issuedDate: any;
  authorizedCapital: string;
  address: string;
  storageId: any;
  avatar: any;
  businessLicense: any;
  authorizationLetter: any;
  existUsers: boolean;
  createdDate: string;
  lastModifiedBy: any;
  lastModifiedDate: any;
}

export interface IUserGroup {
  id: number;
  name: string;
  custId: number;
  orgIn: string;
  active: boolean;
  createdBy: string;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
  activityLogName: any;
  users: any;
  listUsersAddIn: any;
}
