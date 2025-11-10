import {dataEnv} from '../constants/Env';

export const isProduct = 'demo';

let config = {
  ...dataEnv['kyta'][isProduct],
};

export const getConfig = () => config;

export const setConfig = (valueConfig: any) => {
  config = valueConfig;
};

interface IRequestFetch {
  url: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: any;
  headers?: any;
  params?: any;
  typeOfResponse?: 'text' | 'json' | '';
}
