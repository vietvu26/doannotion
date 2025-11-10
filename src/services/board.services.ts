import {ITask} from '../app/screens/board/store/interface';
import {getConfig} from './httpClient';

export const createBoardServices = (fetchRequest: any) => ({
  async login() {
    const endPoint = '/auth/login';
    try {
      const data = await fetch(getConfig().BASE_URL_EACCOUNT + endPoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'binhntt6@fpt.com.vn',
          password: 'admin@123',
        }),
      });
      return Promise.resolve(data.json());
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async getListTaskOfMine(body: any, params: any) {
    try {
      const endpoint = '/services/etask/api/search-list-task-owner';
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

  async getListTaskApproved() {
    try {
      const endpoint = '/services/etask/api/list-tasks/approved';
      const response = await fetchRequest({
        url: getConfig().BASE_URL + endpoint,
        method: 'GET',
      });
      return Promise.resolve(response?.data as ITask[]);
    } catch (error) {
      return Promise.reject(error);
    }
  },

  async getGroupUserBelong(userId: any) {
    try {
      const endpoint = `/services/uaa/api/groups/all/user-belong/${userId}`;
      const response = await fetchRequest({
        url: getConfig().BASE_URL + endpoint,
        method: 'GET',
      });
      return Promise.resolve(response?.data);
    } catch (error) {
      return Promise.reject(error);
    }
  },

  async searchProcessListTask(body: any, params: any) {
    try {
      const endpoint = '/services/etask/api/search-modeler-task';
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

  async searchListTask(body: any, params: any) {
    try {
      const endpoint = '/services/etask/api/search-list-task';
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

  async getAclByUserIdAndGroupUserId(body: any) {
    try {
      const endpoint =
        '/services/etask/api/user-acls/findByUserIdAndGroupUserId';
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

  async getTemplateListTask(body: any, params: any) {
    try {
      const endpoint = '/services/etask/api/search-template-list-task';
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

  async saveListTask(body: any, method = 'POST') {
    try {
      const endpoint = '/services/etask/api/list-tasks';
      const response = await fetchRequest({
        url: getConfig().BASE_URL + endpoint,
        method: method,
        body: JSON.stringify(body),
      });
      return Promise.resolve(response?.data);
    } catch (error) {
      return Promise.reject(error);
    }
  },

  async getTaskById(id: string) {
    try {
      const endpoint = `/services/etask/api/list-tasks/${id}`;
      const response = await fetchRequest({
        url: getConfig().BASE_URL + endpoint,
        method: 'GET',
      });
      return Promise.resolve(response?.data);
    } catch (error) {
      return Promise.reject(error);
    }
  },

  async deleteTaskById(id: any) {
    try {
      const endpoint = `/services/etask/api/list-tasks/${id}`;
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

  async copyTaskFormOtherTask(id: any) {
    try {
      const endpoint = `/services/etask/api/list-tasks/copy-list-tasks/${id}`;
      const response = await fetchRequest({
        url: getConfig().BASE_URL + endpoint,
        method: 'GET',
      });
      return Promise.resolve(response?.data);
    } catch (error) {
      return Promise.reject(error);
    }
  },

  async searchTask(body: any, params: any, isAssign?: boolean) {
    try {
      const endpoint = `/services/etask/api/search-task${
        isAssign ? '-assign' : ''
      }`;
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

  async createTask(body: any) {
    try {
      const endpoint = '/services/etask/api/tasks';
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

  async updateTask(body: any) {
    try {
      const endpoint = '/services/etask/api/tasks';
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

  async exportListTask(listTaskId: string, language: string = 'vi') {
    try {
      const endpoint = `/services/etask/api/export?listTaskId=${listTaskId}&language=${language}`;
      const response = await fetchRequest({
        url: getConfig().BASE_URL + endpoint,
        method: 'GET',
        responseType: 'blob',
        headers: {
          'Content-Type': 'application/octet-stream',
        },
        typeOfResponse: 'blob' as 'json',
      });
      return Promise.resolve(response);
    } catch (error) {
      console.error('error', error);
      return Promise.reject(error);
    }
  },

  async deleteBoardTask(id: string) {
    try {
      const endpoint = `/services/etask/api/group-tasks/${id}`;
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

  async addGroupTask(body: any) {
    try {
      const endpoint = '/services/etask/api/group-tasks';
      const response = await fetchRequest({
        url: getConfig().BASE_URL + endpoint,
        method: 'POST',
        body: JSON.stringify(body),
      });
      return Promise.resolve(response?.data);
    } catch (error) {
      console.error('error', error);
      return Promise.reject(error);
    }
  },
  async searchTemplateTask(
    page: number,
    size: number,
    payload: any,
    sort?: string,
  ) {
    try {
      const endpoint = `/services/etask/api/search-template-task`;

      const response = await fetchRequest({
        url: getConfig().BASE_URL + endpoint,
        method: 'POST',
        params: {
          page,
          size,
          sort,
        },
        body: JSON.stringify(payload),
      });
      return Promise.resolve(response?.data);
    } catch (error) {
      console.error('error', error);
      return Promise.reject(error);
    }
  },
  async getListFormEflow(body: any) {
    try {
      const endpoint = `/services/eform/api/share/form-eflow`;
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
  async addTaskFormData(body: any) {
    try {
      const endpoint = `/services/etask/api/task-form-data`;
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
  async updateTaskFormData(body: any) {
    try {
      const endpoint = `/services/etask/api/task-form-data`;
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
  async getTaskFormId(id: string) {
    try {
      const endpoint = `/services/etask/api/task-form-data/task/${id}`;
      const response = await fetchRequest({
        url: getConfig().BASE_URL + endpoint,
        method: 'GET',
      });
      return Promise.resolve(response?.data);
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async getTaskFormData(params: any) {
    try {
      const endpoint = `/services/eform/api/common/form`;
      const response = await fetchRequest({
        url: getConfig().BASE_URL + endpoint,
        method: 'GET',
        params,
      });
      return Promise.resolve(response?.data);
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async deleteTaskFormById(id: string) {
    try {
      const endpoint = `/services/etask/api/task-form-data/${id}`;
      const response = await fetchRequest({
        url: getConfig().BASE_URL + endpoint,
        method: 'DELETE',
      });
      return Promise.resolve(response?.data);
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async getCommentById(id: string, params: any) {
    try {
      const endpoint = `/services/etask/api/comments-findbytask/${id}`;
      const response = await fetchRequest({
        url: getConfig().BASE_URL + endpoint,
        method: 'GET',
        params,
      });
      return Promise.resolve(response?.data);
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async updateComment(body: any) {
    try {
      const endpoint = `/services/etask/api/comments`;
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
  async deleteComment(id: string) {
    try {
      const endpoint = `/services/etask/api/comments/${id}`;
      const response = await fetchRequest({
        url: getConfig().BASE_URL + endpoint,
        method: 'DELETE',
      });
      return Promise.resolve(response?.data);
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async addComment(body: any) {
    try {
      const endpoint = `/services/etask/api/comments`;
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
  async getCustomFieldById(id: string) {
    try {
      const endpoint = `/services/etask/api/task-hdrs/task/${id}`;
      const response = await fetchRequest({
        url: getConfig().BASE_URL + endpoint,
        method: 'GET',
        
      });
      return Promise.resolve(response?.data);
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async getImageCustomFieldById(id: string, fieldId: string) {
    try {
      const endpoint = `/services/etask/api/task-hdrs/content/${id}?fieldId=${fieldId}`;
      const response = await fetchRequest({
        url: getConfig().BASE_URL + endpoint,
        method: 'GET',
        typeOfResponse: 'text',
      });
      return Promise.resolve(response?.data);
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async uploadImage(body: FormData) {
    try {
      const endpoint = `/services/etask/api/task-hdrs/upload`;
      const response = await fetchRequest({
        url: getConfig().BASE_URL + endpoint,
        method: 'POST',
        body: body,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        typeOfResponse: 'text',
      });
      return Promise.resolve(response?.data);
    } catch (error) {
      return Promise.reject(error);
    }
  },
  async updateCustomField(body: any) {
    try {
      const endpoint = `/services/etask/api/task-hdrs`;
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
  async addCustomField(body: any) {
    try {
      const endpoint = `/services/etask/api/task-hdrs`;
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
  async deleteCustomField(id: string) {
    try {
      const endpoint = `/services/etask/api/task-hdrs/${id}`;
      const response = await fetchRequest({
        url: getConfig().BASE_URL + endpoint,
        method: 'DELETE',
      });
      return Promise.resolve(response?.data);
    } catch (error) {
      return Promise.reject(error);
    }
  },
   
});
