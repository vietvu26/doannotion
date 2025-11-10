import {useDispatch} from 'react-redux';
import Toast from 'react-native-toast-message';
import {accountActions, commonActions} from '../redux/slices';

interface IRequestFetch {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: any;
  headers?: any;
  params?: any;
  typeOfResponse?: 'text' | 'json' | '';
  getValueErr?: boolean;
}

export const useFetchRequest = () => {
  const dispatch = useDispatch();
  const fetchRequest = async ({
    url = '',
    method,
    body,
    headers = {
      'Content-Type': 'application/json',
    },
    params,
    typeOfResponse = 'json',
    getValueErr = false,
  }: IRequestFetch) => {
    try {
      let init: any = {
        method: method,
        headers: headers,
      };
      if (params) {
        url += `?${new URLSearchParams(params).toString()}`;
      }
      if (body) {
        init = {
          method: method,
          headers: headers,
          body: body,
        };
      }
      const dataResponse = await fetch(url, init);
      // error token
      if (dataResponse.status === 401) {
        dispatch(commonActions.setIsAuthorized(false));
        dispatch(commonActions.setAccessToken(''));
        dispatch(accountActions.clearAccount());
        Toast.show({
          text1: 'Thông báo',
          text2: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
          type: 'error',
        });
        return;
      }

      // error system
      if (
        dataResponse.status !== 200 &&
        dataResponse.status !== 202 &&
        dataResponse.status !== 201 &&
        dataResponse.status !== 204
      ) {
        return Promise.resolve({
          data: null,
          status: dataResponse.status,
          headers: dataResponse.headers,
          error: await dataResponse.json(),
        });
      }

      let data;
      try {
        switch (typeOfResponse) {
          case 'json':
            data = await dataResponse.json();
            break;
          case 'text':
            data = await dataResponse.text();
            break;
          default:
            data = dataResponse.status;
            break;
        }
      } catch (error) {
        return Promise.resolve({
          data: 'noContent',
          status: dataResponse.status,
          headers: dataResponse.headers,
          error: null,
        });
      }

      return Promise.resolve({
        data,
        status: dataResponse.status,
        headers: dataResponse.headers,
        error: null,
      });
    } catch (error) {
      console.error('err ' + url, error);
      return Promise.reject(error);
    }
  };

  return fetchRequest;
};
