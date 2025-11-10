export enum Propity {
  low = 'low',
  medium = 'medium',
  high = 'high',
}

export enum Status {
  pending = 'pending',
  processing = 'processing',
  completed = 'completed',
  draft = 'draft',
  voided = 'voided',
  rejected = 'rejected',
  accepted = 'accepted',
  overdue = 'overdue',
}

export enum ReviewTicket {
  processing = 'processing',
  accepted = 'accepted',
  rejected = 'rejected',
}

export enum TypeTicketNotionStatus {
  processing = 'processing',
  accepted = 'accepted',
  rejected = 'rejected',
}

const ListRoleAuthorization = [
  'ROLE_USER',
  'ROLE_ORG_CHAMELEON',
  'ROLE_CUST_DOC',
  'ROLE_ORG_ADMIN',
  'ROLE_CUST_STAFF',
  'ROLE_CUST_VIEWER',
] as const;

export type TypeRoleAuthorization = keyof typeof ListRoleAuthorization;

export enum AccountSystem {
  CUSTOMER = 'P',
  ORGANIZATION = 'O',
}

export enum ServiceIdApp {
  EACCOUNT = 1,
  EFORM = 2,
  EDRIVE = 3,
  ERIGISTRY = 4,
  EFLOW = 5,
  CECA = 6,
  ECONTRACT = 7,
  EWRITER = 8,
  EID = 9,
  EREQUEST = 10,
  ETASK = 11,
  ECATALOGUE = 12,
  EREPORT = 13,
  EVERIFY = 14,
  ENOTARY = 15,
  EPROCESS = 16,
  // missing 17, 18
  ELMS = 19,
  VCS = 20,
  ECOLLABORATION = 21,
  WIKI = 22,
  OPERATOR = 23,
  EANALYSIS = 24,
  EINTELLIGENT = 25,
  ECLM = 26,
  EWORKSPACE = 27,
  EGSM = 28,
  EREPOSITORY = 29,
}
