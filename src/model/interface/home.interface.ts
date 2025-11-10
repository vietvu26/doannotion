export interface WorkSpace {
  id: string;
  name: string;
  description: string;
  type: string;
  owner: string;
  createdBy: string;
  createdDate: string;
  lastModifiedBy: string;
  lastModifiedDate: string;
  lastAccessDate: string;
  totalTask: number;
  totalTaskCompleted: number;
  orgIn: string;
  custId: number;
  acls: any[];
}

export interface ListTaskResponse {
  data: ListTaskSpace[];
  page: PageInfo;
}

export interface ListTaskSpace {
  id: string;
  name: string;
  priority: string | null;
  description: string | null;
  privateLt: boolean;
  custId: number;
  orgIn: string;
  createdBy: string;
  lastModifiedBy: string | null;
  tags: string | null;
  modelerId: string | null;
  modeler: boolean;
  template: boolean;
  startDate: string | null;
  dueDate: string | null;
  createdDate: string;
  lastModifiedDate: string | null;
  userIdAssignedList: number[];
  userIdSharedList: number[];
  groupUserIdSharedList: number[];
  assignOrgList: AssignOrg[] | null;
  assignGroupList: AssignGroup[] | null;
  userIdCoordinators: number[] | null;
  groupTaskList: GroupTask[];
  ownerList: any[] | null;
  workSpaces: string[];
  assignTaskList: AssignTask[] | null;
}

export interface AssignOrg {
  id: string;
  resourceId: string;
  assignOrgIn: string;
  type: string;
  updateByListTask: boolean;
  updateBySubtask: boolean;
  custId: number;
  orgIn: string;
  createdBy: string;
  createdDate: string;
  lastModifiedBy: string | null;
  lastModifiedDate: string | null;
}

export interface AssignGroup {
  id: string;
  resourceId: string;
  groupId: number;
  type: string;
  updateByListTask: boolean;
  updateBySubtask: boolean;
  custId: number;
  orgIn: string;
  createdBy: string;
  createdDate: string;
  lastModifiedBy: string | null;
  lastModifiedDate: string | null;
}

export interface AssignTask {
  id: string;
  resourceId: string;
  userId: number;
  type: string;
  updateByListTask: boolean;
  updateBySubtask: boolean;
  custId: number;
  orgIn: string;
  createdBy: string;
  createdDate: string;
  lastModifiedBy: string | null;
  lastModifiedDate: string | null;
}

export interface GroupTask {
  id: string;
  listTaskId: string;
  name: string;
  attr: string; // JSON string like: {"type": "todo", "color": "#00A3FF", ...}
  type: string | null;
}

export interface PageInfo {
  totalRecords: number;
  totalPage: number;
  currentPage: number;
  pageSize: number;
  sorts: any[]; // Can define better type if needed
}

