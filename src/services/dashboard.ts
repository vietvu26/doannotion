import {
  Assignee,
  ITaskData,
  Rating,
  TaskCountRespon,
  TaskHistory,
  User,
} from '../model/interface/dashboard.interface';
import {getConfig} from './httpClient';

export const createDashboardServices = (fetchRequest: any) => ({
  async countTaskStatus() {
    try {
      const endpoint = '/services/etask/api/dashboard_all/count_task';
      const data = await fetchRequest({
        url: getConfig().BASE_URL + endpoint,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return Promise.resolve(data.data as ITaskData);
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  },
  async searchTaskDetail(
    dateStart?: string,
    dateEnd?: string,
    dueDateStart?: string,
    dueDateEnd?: string,
    modelerId?: string,
    org?: string,
    myBoard?: boolean,
  ) {
    try {
      let params: any = {};
      if (dateStart) params.dateStart = dateStart;
      if (dateEnd) params.dateEnd = dateEnd;
      if (dueDateStart) params.dueDateStart = dueDateStart;
      if (dueDateEnd) params.dueDateEnd = dueDateEnd;
      if (modelerId) params.modelerId = modelerId;
      if (org) params.org = org;
      if (myBoard) params.type = 'my_board';
      const queryString = new URLSearchParams(params).toString();
      const endpoint = `/services/etask/api/dashboard_all/detail?${queryString}`;
      const data = await fetchRequest({
        url: getConfig().BASE_URL + endpoint,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return Promise.resolve(data.data as ITaskData);
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  },
  async searchTaskOrg(
    dateStart: string,
    dateEnd: string,
    dueDateStart: string,
    dueDateEnd: string,
    modelerId: string,
    org?: string,
  ) {
    try {
      let params: any = {};
      if (dateStart) params.dateStart = dateStart;
      if (dateEnd) params.dateEnd = dateEnd;
      if (dueDateStart) params.dueDateStart = dueDateStart;
      if (dueDateEnd) params.dueDateEnd = dueDateEnd;
      if (modelerId) params.modelerId = modelerId;
      if (org) params.org = org;
      const queryString = new URLSearchParams(params).toString();
      const endpoint = `/services/etask/api/dashboard_all/organization?${queryString}`;
      const data = await fetchRequest({
        url: getConfig().BASE_URL + endpoint,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return Promise.resolve(data.data as ITaskData);
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  },
  async searchTaskCount(
    dateStart: string,
    dateEnd: string,
    dueDateStart: string,
    dueDateEnd: string,
    modelerId: string,
    org?: string,
    myBoard?: boolean,
  ) {
    try {
      let params: any = {};
      if (dateStart) params.dateStart = dateStart;
      if (dateEnd) params.dateEnd = dateEnd;
      if (dueDateStart) params.dueDateStart = dueDateStart;
      if (dueDateEnd) params.dueDateEnd = dueDateEnd;
      if (modelerId) params.modelerId = modelerId;
      if (org) params.org = org;
      if (myBoard) params.type = 'my_board';
      const queryString = new URLSearchParams(params).toString();
      const endpoint = `/services/etask/api/dashboard_all/task_count?${queryString}`;
      const data = await fetchRequest({
        url: getConfig().BASE_URL + endpoint,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return Promise.resolve(data.data as TaskCountRespon);
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  },
  async searchTaskRatingAssignee(
    dateStart: string,
    dateEnd: string,
    dueDateStart: string,
    dueDateEnd: string,
    modelerId: string,
    org?: string,
  ) {
    try {
      let params: any = {};
      if (dateStart) params.dateStart = dateStart;
      if (dateEnd) params.dateEnd = dateEnd;
      if (dueDateStart) params.dueDateStart = dueDateStart;
      if (dueDateEnd) params.dueDateEnd = dueDateEnd;
      if (modelerId) params.modelerId = modelerId;
      if (org) params.org = org;
      const queryString = new URLSearchParams(params).toString();
      const endpoint = `/services/etask/api/dashboard_all/rating_assignee?${queryString}`;
      const data = await fetchRequest({
        url: getConfig().BASE_URL + endpoint,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return Promise.resolve(
        data.data as {rating: Rating[]; assignee: Assignee[]},
      );
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  },
  async findUserByOrgIn(
    page: number,
    size: number,
    search: string,
    orgIn: string,
    resourceIds: number[],
    custId?: number,
    logins: string[] = [],
    block?: boolean,
  ) {
    try {
      if (logins?.length) {
        logins = [...new Set(logins)];
      }
      const payload: any = {
        advanced: true,
        contactId: '',
        custId: custId ?? null,
        resourceIds: resourceIds,
        logins: logins,
        field: '',
        from: '',
        ids: [],
        keyWord: '',
        orgIn: orgIn,
        owner: '',
        q: search,
        recipientId: '',
        recipientRole: [],
        refId: '',
        resource: 'table_user',
        terms: {},
        to: '',
      };
      if (block !== undefined) {
        payload.block = block;
      }
      let params: any = {
        page,
        size,
        role: true,
      };

      if (custId) {
        params = {...params, isPublic: true};
      }
      const queryString = new URLSearchParams(params).toString();
      const endpoint = `/services/uaa/api/search/user-info/role?${queryString}`;
      const data = await fetchRequest({
        url: getConfig().BASE_URL + endpoint,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      return Promise.resolve(data.data as User[]);
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  },
  async searchTaskHistory(
    dateStart: string,
    dateEnd: string,
    dueDateStart: string,
    dueDateEnd: string,
    modelerId: string,
    org?: string,
    myBoard?: boolean,
  ) {
    try {
      let params: any = {};
      if (dateStart) params.dateStart = dateStart;
      if (dateEnd) params.dateEnd = dateEnd;
      if (dueDateStart) params.dueDateStart = dueDateStart;
      if (dueDateEnd) params.dueDateEnd = dueDateEnd;
      if (modelerId) params.modelerId = modelerId;
      if (org) params.org = org;
      if (myBoard) params.type = 'my_board';
      const queryString = new URLSearchParams(params).toString();
      const endpoint = `/services/etask/api/dashboard_all/history?${queryString}`;
      const data = await fetchRequest({
        url: getConfig().BASE_URL + endpoint,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return Promise.resolve(data.data as {history: TaskHistory[]});
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  },
});
