export interface IRequestParamsAI {
  ticketId: string;
  userTaskId: string;
}

export interface IRequestBodyAI extends IRequestParamsAI {
  question: string;
  conversationId: string;
}

export interface IAIResponse {
  id?: number;
  conversationId?: string;
  message?: string;
  reply?: string;
  sequence?: number;
  pushNotify?: boolean;
  status?: any;
  userId?: any;
  custId?: number;
  orgIn?: string;
  createdDate?: string;
  createdBy?: string;
  lastModifiedDate?: string;
  lastModifiedBy?: string;
  feedback?: boolean;
  voteValue?: any;
  idResponseAi?: any;
}
