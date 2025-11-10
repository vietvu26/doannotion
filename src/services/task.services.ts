import {ITask} from '../app/screens/board/store/interface';
import {ITaskDetail} from '../app/screens/task-detail/components/task-detail-item/helper';
import {getConfig} from './httpClient';

export const createTaskServices = (fetchRequest: any) => ({
  async getListTaskAll(body: any, params: any) {
    try {
      const endpoint = '/services/etask/api/search-list-task-all';
      const response = await fetchRequest({
        url: getConfig().BASE_URL + endpoint,
        method: 'POST',
        params,
        body: JSON.stringify(body),
      });
      return Promise.resolve(response?.data);
    } catch (error) {
      return Promise.reject(error);
    }
  },

  async getTaskById(id: string) {
    try {
      const endpoint = `/services/etask/api/tasks/${id}`;
      const response = await fetchRequest({
        url: getConfig().BASE_URL + endpoint,
        method: 'GET',
      });
      return Promise.resolve(response?.data as ITaskDetail);
    } catch (error) {
      return Promise.reject(error);
    }
  },

  async deleteTaskById(id: string) {
    try {
      const endpoint = `/services/etask/api/tasks/${id}`;
      const response = await fetchRequest({
        url: getConfig().BASE_URL + endpoint,
        method: 'DELETE',
      });
      return Promise.resolve(response?.data as ITaskDetail);
    } catch (error) {
      return Promise.reject(error);
    }
  },

  async getTaskActivitiesById(id: string) {
    try {
      const endpoint = `/services/etask/api/task-activity/task/${id}`;
      const response = await fetchRequest({
        url: getConfig().BASE_URL + endpoint,
        method: 'GET',
      });
      return Promise.resolve(response?.data);
    } catch (error) {
      return Promise.reject(error);
    }
  },

  async getListTagsByNameAndCustId(name: string, custId: string) {
    try {
      const endpoint = `/services/etask/api/tags-fing-by-name-and-custId`;
      const response = await fetchRequest({
        url: getConfig().BASE_URL + endpoint,
        method: 'GET',
        params: {
          name,
          custId,
        },
      });
      return Promise.resolve(response?.data);
    } catch (error) {
      return Promise.reject(error);
    }
  },

  async getAclsResource() {
    try {
      const endpoint = '/services/etask/api/acls';
      const response = await fetchRequest({
        url: getConfig().BASE_URL + endpoint,
        method: 'GET',
      });
      return Promise.resolve(response?.data);
    } catch (error) {
      return Promise.reject(error);
    }
  },

  async getUserAclByResourceIdAndType(
    resourceId: string,
    type: 'T' | 'L' | 'C',
  ) {
    try {
      const endpoint = `/services/etask/api/user-acls/findByResourceIdAndType/${resourceId}/${type}`;
      const response = await fetchRequest({
        url: getConfig().BASE_URL + endpoint,
        method: 'GET',
      });
      return Promise.resolve(response?.data);
    } catch (error) {
      return Promise.reject(error);
    }
  },

  async deleteUserAclByResourceIdAndType(
    resourceId: string,
    type: 'T' | 'L' | 'C',
  ) {
    try {
      const endpoint = `/services/etask/api/user-acls/${resourceId}/${type}`;
      const response = await fetchRequest({
        url: getConfig().BASE_URL + endpoint,
        method: 'DELETE',
        typeOfResponse: '',
      });
      return Promise.resolve(response?.data);
    } catch (error) {
      return Promise.reject(error);
    }
  },

  async updateUserAcl(body: any) {
    try {
      const endpoint = '/services/etask/api/user-acls';
      const response = await fetchRequest({
        url: getConfig().BASE_URL + endpoint,
        method: 'PUT',
        body: JSON.stringify(body),
      });
      return Promise.resolve(response?.data);
    } catch (error) {
      return Promise.reject(error);
    }
  },

  async updateListTaskAcl(body: any) {
    try {
      const endpoint = '/services/etask/api/list-user-acls';
      const response = await fetchRequest({
        url: getConfig().BASE_URL + endpoint,
        method: 'POST',
        body: JSON.stringify(body),
      });
      return Promise.resolve(response?.data);
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async saveTemplateListTask(body: ITask) {
    try {
      const endpoint =
        '/services/etask/api/template-list-tasks/create-from-list-task';
      const response = await fetchRequest({
        url: getConfig().BASE_URL + endpoint,
        method: 'POST',
        body: JSON.stringify(body),
      });
      return Promise.resolve(response?.data);
    } catch (error) {
      return Promise.reject(error);
    }
  },

  async getCheckListTask(body: any, params: any) {
    try {
      const endpoint = '/services/etask/api/search-checklist';
      const response = await fetchRequest({
        url: getConfig().BASE_URL + endpoint,
        method: 'POST',
        params,
        body: JSON.stringify(body),
      });
      return Promise.resolve(response?.data);
    } catch (error) {
      return Promise.reject(error);
    }
  },

  async addCheckListTask(body: any) {
    try {
      const endpoint = '/services/etask/api/checklists';
      const response = await fetchRequest({
        url: getConfig().BASE_URL + endpoint,
        method: 'POST',
        body: JSON.stringify(body),
      });
      return Promise.resolve(response?.data);
    } catch (error) {
      return Promise.reject(error);
    }
  },

  async updateCheckListTask(body: any) {
    try {
      const endpoint = '/services/etask/api/checklists';
      const response = await fetchRequest({
        url: getConfig().BASE_URL + endpoint,
        method: 'PUT',
        body: JSON.stringify(body),
      });
      return Promise.resolve(response?.data);
    } catch (error) {
      return Promise.reject(error);
    }
  },

  async deleteCheckListById(id: string) {
    try {
      const endpoint = `/services/etask/api/checklists/${id}`;
      const response = await fetchRequest({
        url: getConfig().BASE_URL + endpoint,
        method: 'DELETE',
        typeOfResponse: '',
      });
      return Promise.resolve(response?.data);
    } catch (error) {
      return Promise.reject(error);
    }
  },

  async configRemindTask(body: any) {
    try {
      const endpoint = '/services/etask/api/config-reminds';
      const response = await fetchRequest({
        url: getConfig().BASE_URL + endpoint,
        method: 'PUT',
        body: JSON.stringify(body),
      });
      return Promise.resolve(response?.data);
    } catch (error) {
      return Promise.reject(error);
    }
  },

  async getAttractmentById(id: string) {
    try {
      const endpoint = `/services/etask/api/object-storages-by-task-id/${id}?taskId=${id}`;
      const response = await fetchRequest({
        url: getConfig().BASE_URL + endpoint,
        method: 'GET',
      });
      return Promise.resolve(response?.data);
    } catch (error) {
      return Promise.reject(error);
    }
  },

  async taskReview(body: any) {
    try {
      const endpoint = '/services/etask/api/assign-tasks/review';
      const response = await fetchRequest({
        url: getConfig().BASE_URL + endpoint,
        method: 'POST',
        body: JSON.stringify(body),
      });
      return Promise.resolve(response?.data);
    } catch (error) {
      return Promise.reject(error);
    }
  },

  async deleteTaskReview(id?: string) {
    try {
      const endpoint = `/services/etask/api/assign-tasks/review?id=${id}`;
      const response = await fetchRequest({
        url: getConfig().BASE_URL + endpoint,
        method: 'DELETE',
        typeOfResponse: '',
      });
      return Promise.resolve(response?.data);
    } catch (error) {
      return Promise.reject(error);
    }
  },

  async getDailyTaskConfig(taskId: string) {
    try {
      const endpoint =
        '/services/etask/api/config-daily-tasks/task?taskId=' + taskId;
      const response = await fetchRequest({
        url: getConfig().BASE_URL + endpoint,
        method: 'GET',
      });
      return Promise.resolve(response?.data);
    } catch (error) {
      return Promise.reject(error);
    }
  },

  async createDailyTaskConfig(body: any) {
    try {
      const endpoint = '/services/etask/api/tasks/schedule';
      const response = await fetchRequest({
        url: getConfig().BASE_URL + endpoint,
        method: 'POST',
        body: JSON.stringify(body),
      });
      return Promise.resolve(response?.data);
    } catch (error) {
      return Promise.reject(error);
    }
  },

  async copyTemplateTask(id: string) {
    try {
      const endpoint = `/services/etask/api/tasks/copy-task/${id}`;
      const response = await fetchRequest({
        url: getConfig().BASE_URL + endpoint,
        method: 'GET',
      });
      return Promise.resolve(response?.data);
    } catch (error) {
      return Promise.reject(error);
    }
  },
});
