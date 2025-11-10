export interface Task {
  id: string;
  parentId: string;
  taskIn: any;
  name: string;
  tags: any;
  listTaskId: string;
  description: any;
  status: string;
  statusType: any;
  attr: any;
  priority: string;
  fields: any;
  startDate: string;
  dueDate: string;
  remindDate: any;
  remindDateAsDate: any;
  custId: number;
  orgIn: string;
  createdBy: string;
  createdDate: string;
  lastModifiedBy: any;
  lastModifiedDate: any;
  template: boolean;
  privateLt: boolean;
  rating: any;
  rateDetails: any;
  checkListDtoList: any[];
  assignTaskList: any;
  listAttachmentId: any[];
  subTaskDtoList: any;
  assignReviewList: any;
  assignOrgList: any;
  assignGroupList: any;
  ownerList: any;
  configRemind: any;
  taskShareInternalList: any;
  listTask: any;
  paramEntry: any;
  userId: any;
  numberAttachments: any;
  numberSubtasks: any;
  numberComments: any;
  numberChecklists: any;
  taskShare: any;
  userIdCoordinators: any;
  arrayOfListUser: any;
  missDuration: any;
  scheduleType: any;
  scheduleTime: any;
  param: any;
  scheduleStartAt: any;
  scheduleEndAt: any;
  completedDate: string;
  originalTaskId: any;
  percent: number;
  percentChecklist: any;
}

export interface TaskGroup {
  listTaskId: string;
  listTaskName: string;
  task: Task[];
}

export interface Organization {
  orgIn: string;
  name: string;
  taskCountOrg: number;
}

export interface RatingTaskCount {
  rating: number;
  count: number;
}

export interface Rating {
  userId: number;
  name: string;
  email: string;
  ratingTaskCounts: RatingTaskCount[];
  avatar?: string | null;
}

export interface Assignee {
  userId: number;
  name: string;
  email: string;
  taskCount: number;
  avatar?: string | null;
}

export interface TaskHistoryEntry {
  id: string;
  taskId: string;
  content: string;
  actionCode: string;
  param: {
    [key: string]: any;
  };
  createdBy: string;
  lastModifiedBy: any;
  lastModifiedDate: any;
  createdDate: string;
  listTask: string;
  custId: number;
  orgIn: string;
  userId: number;
  parentTaskId: string;
  taskName: string;
  priority: any;
}

export interface TaskHistory {
  taskName: string;
  priority: any;
  taskHistory: TaskHistoryEntry[];
}

export interface TaskCountStatus {
  status: string;
  taskCount: number;
}

export interface PriorityGroup {
  priority: '1' | '2' | '3' | '4' | null;
  taskCountStatus: TaskCountStatus[];
}

export interface StatusGroup {
  status: string;
  taskCount: number;
}

export interface ITaskData {
  missedCount: number;
  missed: TaskGroup[];
  processingCount: number;
  organization: Organization[];
  rating: Rating[];
  completed: TaskGroup[];
  assignee: Assignee[];
  history: TaskHistory[];
  totalCount: number;
  priority: PriorityGroup[];
  status: StatusGroup[];
}

export interface TaskCountRespon {
  [key: string]: number;
  missedCount: number;
  processingCount: number;
  totalCount: number;
}

export interface Role {
  id: number;
  name: string;
  description: string;
  positionNumber: number;
  code: string;
  isReviewer: boolean | null;
  isSigner: boolean | null;
  custId: number;
  level: number;
  active: boolean;
  createdBy: string;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
  addUsers: any | null;
  deleteUsers: any | null;
  usersInRole: any | null;
  usersNotInRole: any | null;
  totalUsers: number | null;
  usersInRoleRetired: any | null;
  usersInRoleWorking: any | null;
  totalBlocked: number | null;
  totalUnBlocked: number | null;
  levelAdd: number;
}
export interface User {
  id: string;
  email: string;
  phone: string | null;
  personalName: string;
  orgIn: string;
  orgName: string;
  custId: number;
  status: string;
  role: string | null;
  position: string | null;
  description: string | null;
  resource: string;
  type: string;
  avatar: string | null;
  imageUrl: string | null;
  acOrgName: string | null;
  roles: Role[];
  roleIds: number[];
  resourceId: number;
  author: string | null;
  createdDate: string;
  lastModifiedDate: string;
  userAuthor: string | null;
  roleLevel: string[];
  priority: number;
  attrs: Record<string, any>;
}
