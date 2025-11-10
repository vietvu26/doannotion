import {
  Propity,
  ReviewTicket,
  Status,
  TypeTicketNotionStatus,
} from '../enum/common.enum';

export interface IServices {
  id: string;
  serviceCode: any | null;
  serviceName: string;
  icon: any | null;
  iconBase64: string | null;
  status: string;
  description: string;
  displayOrder: number;
  color: string;
  orgIn: string;
  custId: number;
  createdDate: string;
  createdBy: string;
  lastModifiedDate: string;
  lastModifiedBy: string;
}

export interface IServicesDetail {
  id: string;
  serviceId: string;
  flowName: string;
  modelerId: string;
  groupModelerId: string | null;
  groupModelerName: string | null;
  createdDate: string;
  createdBy: string;
  lastModifiedDate: string;
  lastModifiedBy: string;
  custId: number;
  orgIn: string;
}

export interface IFormData {
  id?: string;
  ticketId?: string;
  userTaskId?: any;
  formData?: string;
  version: string;
  createdDate?: string;
  createdBy?: string;
  lastModifiedDate?: string;
  lastModifiedBy?: string;
  custId?: number;
  orgIn?: string;
  versionUserTask?: number;
  eformId?: any;
}

export interface IUserInfo {
  firstName: string;
  lastName: string;
  personalName: any;
  avatar?: string;
  imageUrl: any;
  orgName: string;
  email: string;
  haveAvatar?: boolean;
}

export interface ITicket {
  id: string;
  delayTime: string | null;
  resourceName?: string;
  owner?: string;
  workFlowId: number;
  title: string;
  priority: Propity;
  ticketStatus: Status;
  confirmStatus: ReviewTicket;
  estimateDate: string;
  finishDate: string;
  followerId: any;
  custId: number;
  createdDate: string;
  createdBy: string;
  lastModifiedDate: string;
  lastModifiedBy: string;
  startDate: any;
  endDate: any;
  isUpdate: any;
  rate: number;
  note: any;
  rateNote: any;
  org: any;
  listRelativeTicket: any;
  attachmentCount: number;
  commentCount: number;
  rateStatus: string;
  formData: IFormData[];
  listUserInfo: IUserInfo[];
  modelerId: string;
  orgName: string;
  resourceId?: string;
  implementId?: string;
  recipientId?: string;
  status?: string;
  serviceName?: string;
  orgIn?: string;
  recipients?: any[];
  remindTime: string;
  notionName: string;
  jsonXml?: string;
  sendFrom: any;
  resourceStatus?: string;
}

export interface IPayloadSearchTicket {
  confirmStatus?: ReviewTicket[];
  createdBy?: string;
  endDate?: string;
  estimateDateFrom?: string;
  estimateDateTo?: string;
  org?: string[];
  priority?: Propity[];
  rate?: string[];
  rateStatus?: string[];
  service?: string[];
  sla?: string[];
  startDate?: string;
  textSearch?: string;
  ticketStatus?: Status[] | TypeTicketNotionStatus[];
  workflow?: string[];
  from?: string[];
  to?: string[];
  types?: string[];
  reviews?: string[];
  priorities?: string[];
  dueDateTo?: string[];
  dueDateFrom?: string[];
  latedTo?: string[];
  latedFrom?: string[];
  idsSelected?: string[];
  myTicket?: boolean;
  language?: string;
}

export interface ISearch {
  createdBy?: string;
  textSearch?: string;
  myTicket?: boolean;
  ticketStatus?: Status[];
  service?: string[];
  priority?: Propity[];
  startDate?: string | null;
  endDate?: string | null;
  searchForSabeco?: boolean;
}

export interface IRecipientTicket {
  id: string;
  overrideid: string;
  implementerId: any;
  notionName: string;
  version: number;
  index: any;
  partyId: any;
  contact: IContact;
  role: string;
  order: any;
  password: any;
  ipContact: any;
  status: string;
  fromDate: any;
  dueDate: any;
  processDate: any;
  isSystemUser: boolean;
  isCustUser: boolean;
  agreementUUID: any;
  signDate: any;
  reason: any;
  risk: any;
  username: any;
  visibleSignature: boolean;
  signTypes: any;
  notifyTypes: any[];
  actionTypes: any;
  recipientsHistory: any;
  stepName: any;
  hash: any;
  stepId: any;
  optional: boolean;
  conditional: boolean;
  message: any;
  signStatus: any;
  primary: boolean;
  reminder: boolean;
  remindLater: number;
  hashAlgorithm: any;
  contactTrace: any;
  ekycProcess: boolean;
  ekycDetail: any;
}

export interface IContact {
  id: any;
  name: any;
  email: any;
  phone: any;
  orgIn: string;
  custId: number;
}

export interface IRecipientTicketImpl {
  id: string;
  ticketId: string;
  ticketRecipientId: string;
  userTaskId: string;
  implementerId: string;
  recipient: IRecipientTicket;
  status: string;
  type: string;
  isSystem: boolean;
  isCust: boolean;
  custId: number;
  orgIn: string;
  version: number;
  password: string;
  recipientStatus: string;
  createdBy: string;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
  versionFormId: string;
}

export interface IFormInfo {
  id: string;
  userTaskId: string;
  formId: string;
  modelerId: string;
  createdDate: string;
  createdBy: string;
  versionId: string;
  attachId: string;
}

export interface MenuViewItem {
  menuId: number;
  menuParentId: number;
  title: string;
  serviceId: number;
  serviceName: string;
  activated: number;
  nameId: string;
  type: 'button' | 'menu' | 'path';
  description: string;
  view: string;
  icon: string;
}