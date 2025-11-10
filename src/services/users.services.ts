import {IOrgIn} from '../model/interface/account.interface';
import {getConfig} from './httpClient';

export const createUserServices = (fetchRequest: any) => ({
  async getUser(body: any, params: any) {
    const dataBody = {
      advanced: true,
      contactId: '',
      custId: null,
      resourceIds: [],
      logins: null,
      field: '',
      from: '',
      ids: [],
      keyWord: '',
      orgIn: null,
      owner: '',
      q: '',
      recipientId: '',
      recipientRole: [],
      refId: '',
      resource: 'table_user',
      terms: {},
      to: '',
      ...body,
    };
    const endpoint = '/services/uaa/api/search/user-info/role';
    try {
      const response = await fetchRequest({
        url: getConfig().BASE_URL + endpoint,
        method: 'POST',
        body: JSON.stringify(dataBody),
        params,
      });
      const total = response?.headers.get('x-total-count');

      return Promise.resolve({
        data: response?.data,
        total: total,
      });
    } catch (error) {
      return Promise.reject(error);
    }
  },

  async findListOrgIn(params: any) {
    try {
      const endpoint =
        '/services/uaa/api/organizations/child/find-organization-like-orgin';
      const response = await fetchRequest({
        url: getConfig().BASE_URL + endpoint,
        method: 'GET',
        params,
      });
      return Promise.resolve(response?.data as IOrgIn[]);
    } catch (error) {
      return Promise.reject(error);
    }
  },

  async groupSearch(body: any, params: any) {
    try {
      const endpoint = '/services/uaa/api/groups/search';
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

  async findListGroup(body: number[]) {
    try {
      const endpoint = '/services/uaa/api/groups/find-list';
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
});
