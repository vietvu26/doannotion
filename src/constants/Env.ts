export const dataEnv = {
  kyta: {
    prod: {
      BASE_URL: 'https://etask.kyta.fpt.com',
      BASE_URL_FORM: 'https://eform.kyta.fpt.com/preview-template/',
      BASE_URL_TICKET: 'https://etask.kyta.fpt.com/p-ticket-detail/',
      BASE_URL_EKYC: 'https://eid.kyta.fpt.com',
      BASE_URL_ECOLLABO: 'https://ecollaboration.kyta.fpt.com',
      BASE_URL_EACCOUNT: 'https://eaccount.kyta.fpt.com',
    },
    demo: {
      BASE_URL: 'https://demo.etask.kyta.fpt.com',
      BASE_URL_FORM: 'https://demo.eform.kyta.fpt.com/preview-template/',
      BASE_URL_TICKET: 'https://demo.etask.kyta.fpt.com/p-ticket-detail/',
      BASE_URL_EKYC: 'https://demo.eid.kyta.fpt.com',
      BASE_URL_ECOLLABO: 'https://demo.ecollaboration.kyta.fpt.com',
      BASE_URL_EACCOUNT: 'https://demo.eaccount.kyta.fpt.com',
    },
    dev: {
      BASE_URL: 'http://10.14.121.10/etask',
      BASE_URL_FORM: 'http://10.14.121.10/eform/preview-template/',
      BASE_URL_TICKET: 'http://10.14.121.10/etask/p-ticket-detail/',
      BASE_URL_EKYC: 'http://10.14.121.10/eid',
      BASE_URL_ECOLLABO: 'http://10.14.121.10/ecollaboration',
      BASE_URL_EACCOUNT: 'http://10.14.121.10/eaccount',
    },
  },
};

export type TypeOfDataEnv = keyof typeof dataEnv;
