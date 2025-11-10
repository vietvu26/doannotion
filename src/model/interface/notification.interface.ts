export interface GroupTask {
  id: string;
  listTaskId: string | null;
  name: string;
  attr: string;
  type: string;
}

export interface TaskDTO {
  id: string;
  name: string;
  priority: string;
  description: string;
  custId: number;
  orgIn: string;
  startDate: string;
  dueDate: string;
  createdBy: string;
  lastModifiedBy: string | null;
  createdDate: string;
  lastModifiedDate: string | null;
  groupTaskList: GroupTask[];
}

export interface TaskDetailDTO {
  id: string;
  parentId: string;
  name: string;
  listTaskId: string;
  status: string;
  priority: string;
  startDate: string;
  dueDate: string;
  createdBy: string;
  createdDate: string;
  param: string;
  percent: number;
}

export interface ParamEntry {
  name?: any; // Cần xác định kiểu chính xác của name
}

export interface AssignTaskDto {
  assignName: string | null;
  coordinator: string | null;
  createdBy: string;
  createdDate: string;
  custId: number;
  hashIds: string | null;
  id: string;
  lastModifiedBy: string | null;
  lastModifiedDate: string | null;
  listTask: any | null; // Cần xác định kiểu chính xác của listTask
  orgIn: string;
  owner: string | null;
  parentTask: string | null;
  resourceId: string;
  review: string | null;
  task: string | null;
  taskAttribute: string | null;
  type: string;
  updateByListTask: boolean;
  updateBySubtask: boolean;
  userId: number;
}

export interface ListTaskDTO {
  assignGroupList: any | null; // Cần xác định kiểu chính xác
  assignOrgList: any | null; // Cần xác định kiểu chính xác
  assignTaskList: any | null; // Cần xác định kiểu chính xác
  createdBy: string;
  createdDate: string;
  custId: number;
  description: string;
  dueDate: string;
  groupTaskList: any[]; // Hoặc GroupTask[] nếu có export interface cụ thể
  id: string;
  lastModifiedBy: string | null;
  lastModifiedDate: string | null;
  modelerId: string | null;
  name: string;
  orgIn: string;
  ownerList: any | null; // Cần xác định kiểu chính xác
  paramEntry: ParamEntry | null;
  priority: string;
  privateLt: boolean;
  startDate: string;
  status: string | null;
  tags: any | null; // Cần xác định kiểu chính xác
  task: string | null;
  taskShareInternalList: any | null; // Cần xác định kiểu chính xác
  template: boolean;
  userId: number | null;
}
export interface ParamEntryValue {
  old?: any; // <-- Thay 'any' bằng kiểu cụ thể nếu biết
  new?: any; // <-- Thay 'any' bằng kiểu cụ thể nếu biết
}
export interface ParamEntry {
  [key: string]: ParamEntryValue | undefined;
  name?: any; // Cần xác định kiểu chính xác
  // new: string;
  // old: string;
}

export interface TaskDto {
  arrayOfListUser: any | null; // Cần xác định kiểu chính xác
  assignGroupList: any[]; // Cần xác định kiểu chính xác
  assignOrgList: any[]; // Cần xác định kiểu chính xác
  assignReviewList: any[]; // Cần xác định kiểu chính xác
  assignTaskList: any[]; // Hoặc AssignTask[] nếu có export interface cụ thể
  attr: any | null; // Cần xác định kiểu chính xác
  checkListDtoList: any[]; // Cần xác định kiểu chính xác
  completedDate: string | null;
  configRemind: any | null; // Cần xác định kiểu chính xác
  createdBy: string;
  createdDate: string;
  custId: number;
  description: string | null;
  dueDate: string | null;
  fields: any | null; // Cần xác định kiểu chính xác
  id: string;
  lastModifiedBy: string | null;
  lastModifiedDate: string | null;
  listAttachmentId: any[]; // Cần xác định kiểu chính xác
  listTask: any | null; // Cần xác định kiểu chính xác
  listTaskId: string;
  missDuration: string | null;
  name: string;
  numberAttachments: number | null;
  numberChecklists: number | null;
  numberComments: number | null;
  numberSubtasks: number | null;
  orgIn: string;
  originalTaskId: string | null;
  ownerList: any[]; // Cần xác định kiểu chính xác
  param: string | null;
  paramEntry: ParamEntry | null;
  parentId: string;
  percent: number | null;
  percentChecklist: number | null;
  priority: string | null;
  privateLt: boolean;
  rateDetails: any | null; // Cần xác định kiểu chính xác
  rating: number | null;
  remindDate: string | null;
  remindDateAsDate: string | null;
  scheduleEndAt: string | null;
  scheduleStartAt: string | null;
  scheduleTime: string | null;
  scheduleType: string | null;
  startDate: string;
  status: string;
  statusType: string | null;
  subTaskDtoList: any | null; // Cần xác định kiểu chính xác
  tags: any | null; // Cần xác định kiểu chính xác
  taskIn: string | null;
  taskShare: string | null;
  taskShareInternalList: any[]; // Hoặc TaskShareInternal[] nếu có export interface cụ thể
  template: boolean;
  userId: number | null;
  userIdCoordinators: any | null; // Cần xác định kiểu chính xác
}

export interface Content {
  approveNotifyDto: any | null;
  assignGroupDto: any | null;
  assignOrgDto: any | null;
  assignTaskDto: AssignTaskDto | null;
  commentNotifyDto: any | null;
  createdBy: string;
  createdDateNotify: string;
  listTaskDTO: ListTaskDTO;
  modelerName: string | null;
  parentTaskDto: any | null;
  taskDto: TaskDto;
  taskNotify: any | null;
  taskShareInternal: any | null;
  ticketName: string | null;
}
export interface INotification {
  createdBy: string;
  createdDate: number;
  lastModifiedBy: string;
  lastModifiedDate: number;
  custId: number;
  orgIn: string;
  id: number;
  userIdReceiver: number;
  emailReceiver: string | null;
  content: string | Content;
  type: string;
  system: string;
  status: string;
  fromSystem: string | null;
}
