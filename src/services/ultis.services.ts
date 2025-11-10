import {head} from 'lodash';
import {getConfig} from './httpClient';

export const createUtilsServices = (fetchRequest: any) => ({
  async viewFile(body: FormData, params: any) {
    try {
      const endpoint = '/services/s3service/api/view';
      const response = await fetchRequest({
        url: getConfig().BASE_URL + endpoint,
        method: 'POST',
        params,
        body,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return Promise.resolve(response?.data);
    } catch (error) {
      return Promise.reject(error);
    }
  },

  async updateFile(body: FormData, method: 'POST' | 'PUT' = 'POST') {
    try {
      const endpoint = '/services/etask/api/attachment';
      const response = await fetchRequest({
        url: getConfig().BASE_URL + endpoint,
        method: method,
        body,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return Promise.resolve(response?.data);
    } catch (error) {
      return Promise.reject(error);
    }
  },

  async deleteFile(id: string) {
    try {
      const endpoint = `/services/etask/api/attachment/${id}`;
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
});
