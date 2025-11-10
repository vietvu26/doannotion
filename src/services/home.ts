import {ListTaskSpace, WorkSpace} from '../model/interface/home.interface';
import {getConfig} from './httpClient';

export const createHomeServices = (fetchRequest: any) => ({
    async getWorkPlace() {
    try {
      const endpoint =
        '/services/etask/api/work-space/search?page=0&size=5&sort=lastAccessDate,desc';
      const data = await fetchRequest({
        url: getConfig().BASE_URL + endpoint,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });
      return Promise.resolve({
        data: data?.data as WorkSpace[],
      });
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  },
  async getOwnWorkPlace() {
    try {
      const endpoint =
        '/services/etask/api/work-space/search?type=owner&page=0&size=5&sort=createdDate,desc';
      const data = await fetchRequest({
        url: getConfig().BASE_URL + endpoint,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });
      return Promise.resolve({
        data: data?.data as WorkSpace[],
      });
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  },
  async getAllOwnWorkPlace() {
    try {
      const endpoint =
        '/services/etask/api/work-space/search?type=owner';
      const data = await fetchRequest({
        url: getConfig().BASE_URL + endpoint,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });
      return Promise.resolve({
        data: data?.data as WorkSpace[],
      });
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  },
   async getAuthorWorkPlace() {
    try {
      const endpoint =
        '/services/etask/api/work-space/search?type=authorized&page=0&size=5';
      const data = await fetchRequest({
        url: getConfig().BASE_URL + endpoint,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({}),
      });
      return Promise.resolve({
        data: data?.data as WorkSpace[],
      });
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  },
  async getListWorkPlace(id: string) {
    try {
      const endpoint = '/services/etask/api/search-list-task';
      const data = await fetchRequest({
        url: getConfig().BASE_URL + endpoint,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          terms: {
            workSpaces: [id]
          },
        }),
      });

      return Promise.resolve({
        data: data?.data?.data as ListTaskSpace[],
      });
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  },
  async deleteWorkSpaceById(id: string) {
    try {
      const endpoint = `/services/etask/api/work-spaces/${id}`;

      const response = await fetchRequest({
        url: getConfig().BASE_URL + endpoint,
        method: 'DELETE',
        typeOfResponse: '',
      });

      if (response?.status === 204 || response?.data === undefined) {
        return {success: true, status: response?.status};
      }

      // Nếu có phản hồi không mong đợi, trả về thất bại
      return {success: false, status: response?.status};
    } catch (error) {
      console.log('deleteWorkSpaceById error', error);
    }
  },
  async updateWorkSpace(data: any) {
    try {
      const endpoint = `/services/etask/api/work-spaces`;
      const response = await fetchRequest({
        url: getConfig().BASE_URL + endpoint,
        method: 'PUT',
         body: JSON.stringify({
        workSpace: {
          ...data,
        },
      }),
      
      });
      return Promise.resolve({
        data: response?.data,
      });
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  },
  async createWorkSpace(data: any) {
    try {
      const endpoint = `/services/etask/api/work-spaces`;
      const response = await fetchRequest({
        url: getConfig().BASE_URL + endpoint,
        method: 'POST',
         body: JSON.stringify({
        workSpace: {
          ...data,
        },
      }),
      
      });
      return Promise.resolve({
        data: response?.data,
      });
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  },
   async getTaskSpaceById(id: string) {
    try {
    const endpoint = `/services/etask/api/work-space/tasks?page=0&size=10000&workSpaceId=${id}`;
      const response = await fetchRequest({
        url: getConfig().BASE_URL + endpoint,
        method: 'POST',
      });
      return Promise.resolve(response?.data);
    } catch (error) {
      return Promise.reject(error);
    }
  },
});
