export type OrgProfileAuthenticated = {
  authorizedUser: any;
  legal: LegalRepresentative;
  organization: OrganizationDetailProfile;
};

export type LegalRepresentative = {
  name: string;
  jobTitle: string | null;
  gender: string;
  ethnic: string;
  nationality: string;
  dob: string;
  typeOfDocuments: string;
  idNumber: number | null;
  licenseDate: string;
  personalId: number;
  provideAddress: string;
  homeTown: string;
  permanentAddress: string;
  orgIn: string;
  active: boolean;
  custId: string;
  documents: any;
  personalKycId: number;
  type: number;
  expiredDate: string;
  identifyingCharacteristics?: string;
};

export interface OrganizationDetailProfile {
  orgIn: string;
  businessLicenseIds: any[];
  authorizationLetterIds: any[];
  activated: boolean;
  ekycContent: any;
  name: string;
  globalName: string;
  acName: string;
  taxCode: string;
  issuedDate: string;
  authorizedCapital: number;
  mainJob: string;
  address: string;
  active: boolean;
  taxAuthority?: string;
  businessStatus?: string;
  custId: string;
  createdDate?: string;
}

export type OrgLegalRepresentative = LegalRepresentative & {
  id: string;
  createdBy: any;
  createdDate: any;
  lastModifiedBy: string;
  lastModifiedDate: string;
  photoBackSideIDCard: string;
  photoFrontSideIDCard: string;
  photoIDCard: any;
  photo: any;
  documents: any;
};

export type PayloadPersonalProfileEkyc = {
  userId: string;
  agreementUUID: string | null;
  personalName: string;
  email: string;

  telephoneNumber: string;
  address: string;
  country: string;
  personalID: string;
  provideDate: string;
  provideAddress: string;
  messageType: string;
  applicationForm: string | null;
  requestForm: string | null;
  authorizeLetter: string | null;
  photoFrontSideIDCard: string | null;
  photoBackSideIDCard: string | null;
  photoActivityDeclaration: string | null;
  photoAuthorizeDelegate: string | null;
  ekycContent: any;
  resourceType: string;
  staffId: string | null;
  photoIDCardContentType: string;
  hashTag: any[];
  taxID?: string;
  createdDate?: string;
};
