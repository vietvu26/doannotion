import {getConfig} from './httpClient';

export const createDashboardServices = (fetchRequest: any) => ({
  async getDashboard(params?: any) {
    try {
      const endpoint = '/services/etask/api/dashboard_all/count_task';
      const response = await fetchRequest({
        url: getConfig().BASE_URL + endpoint,
        method: 'GET',
      });
      return response;
    } catch (error) {}
  },
});
