import {INotification} from '../model/interface/notification.interface';
import {getConfig} from './httpClient';

export const createNotificationServices = (fetchRequest: any) => ({
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
  async getListNotifications(params: any, body: any) {
    try {
      const endpoint = '/services/notify-central/api/idaas-notifies/filter';
      const data = await fetchRequest({
        url: getConfig().BASE_URL + endpoint,
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        params: params,
      });
      const totalCounts = data?.headers?.get('x-total-count');
      return Promise.resolve({
        data: data?.data as INotification[],
        totalRecords: totalCounts ? Number(totalCounts) : 0,
      });
    } catch (error) {
      console.error(error);
      return Promise.reject(error);
    }
  },

  async markAsReadNotify(id: number) {
    try {
      const endpoint = '/services/notify-central/api/idaas-notifies';
      const data = await fetchRequest({
        url: getConfig().BASE_URL + endpoint,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([
          {
            id,
            status: 'read',
          },
        ]),
        typeOfResponse: 'text',
      });
      return Promise.resolve(data.data);
    } catch (error) {
      console.error('markAsReadNotify', error);
      return Promise.reject(error);
    }
  },

  async markAsReadListNotify(listId: number[]) {
    try {
      const endpoint = '/services/notify-central/api/idaas-notifies';
      const data = await fetchRequest({
        url: getConfig().BASE_URL + endpoint,
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(
          listId.map(id => ({
            id,
            status: 'read',
          })),
        ),
        typeOfResponse: 'text',
      });
      return Promise.resolve(data.data);
    } catch (error) {
      console.error('markAsReadNotify', error);
      return Promise.reject(error);
    }
  },

  ///services/notify-central/api/notification-reports/E_REQUEST
  async getTotalNoti() {
    try {
      const endpoint =
        '/services/notify-central/api/notification-reports/E_TASK';
      const data = await fetchRequest({
        url: getConfig().BASE_URL + endpoint,
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      return Promise.resolve(data.data);
    } catch (error) {
      console.error('getTotalNoti', error);
      return Promise.reject(error);
    }
  },
  // async updateNotifications(body: any) {
  //   try {
  //     const endpoint = '/services/notify-central/api/idaas-notifies';
  //     const data = await fetchRequest({
  //       url: getConfig().BASE_URL + endpoint,
  //       method: 'PUT',
  //       headers: {
  //         'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify(body),
  //       typeOfResponse: 'text',
  //     });

  //     return Promise.resolve(data?.data);
  //   } catch (error) {
  //     console.error('error', error);
  //   }
  // },

  // async getNumberOfNotiUnread() {
  //   try {
  //     const endpoint =
  //       '/services/notify-central/api/notification-reports/E_REQUEST';
  //     const data = await fetchRequest({
  //       url: getConfig().BASE_URL + endpoint,
  //       method: 'GET',
  //       headers: {},
  //       typeOfResponse: 'text',
  //     });
  //     return Promise.resolve(data?.data);
  //   } catch (error) {
  //     console.error('error-get-number-noti', error);
  //   }
  // },
});
