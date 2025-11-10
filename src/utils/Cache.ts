import {isEmpty, isNull} from 'lodash';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Key = {
  Token: 'ACCESS_TOKEN_KEY',
  CUSTOMER_LOGIN_ID_KEY: 'CUSTOMER_LOGIN_ID_KEY',
  DATA_REMEMBER_LOGIN_KEY: 'DATA_REMEMBER_LOGIN_KEY',
  REMEMBERED_EMAIL: 'REMEMBERED_EMAIL',
};

// Token
const setToken = async (value: string) => {
  try {
    await AsyncStorage.setItem(Key.Token, value);
  } catch (e) {
    // saving error
  }
};
const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem(Key.Token);
    return isEmpty(token) ? '' : token?.replace(/\"/g, '');
  } catch (e) {
    // saving error
  }
};

const setCustomerLoginIdKey = async (value: string) => {
  try {
    await AsyncStorage.setItem(Key.CUSTOMER_LOGIN_ID_KEY, value);
  } catch (e) {
    // saving error
  }
};

const getCustomerLoginIdKey = async () => {
  try {
    const loginKey = await AsyncStorage.getItem(Key.CUSTOMER_LOGIN_ID_KEY);
    return isEmpty(loginKey) ? '' : loginKey?.replace(/\"/g, '');
  } catch (e) {
    // saving error
  }
};

const clearCustomerLoginIdKey = async () => {
  try {
    await AsyncStorage.removeItem(Key.CUSTOMER_LOGIN_ID_KEY);
  } catch (e) {
    // saving error
  }
};

const setDataRememberLoginKey = async (value: string) => {
  try {
    await AsyncStorage.setItem(Key.DATA_REMEMBER_LOGIN_KEY, value);
  } catch (e) {
    // saving error
  }
};

const getDataRememberLoginKey = async () => {
  try {
    const loginKey = await AsyncStorage.getItem(Key.DATA_REMEMBER_LOGIN_KEY);
    return isNull(loginKey) ? '' : loginKey;
  } catch (e) {
    // saving error
  }
};

const clearDataRememberLoginKey = async () => {
  try {
    await AsyncStorage.removeItem(Key.DATA_REMEMBER_LOGIN_KEY);
  } catch (e) {
    // saving error
  }
};

const saveReloadWebview = async () => {
  try {
    const getValue = await getReloadWebview();
    if (getValue === 'first') {
      await AsyncStorage.setItem('RELOAD_WEBVIEW', 'second');
    } else {
      await AsyncStorage.setItem('RELOAD_WEBVIEW', 'first');
    }
  } catch (e) {
    // saving error
  }
};

const getReloadWebview = async () => {
  try {
    const reloadWebview = await AsyncStorage.getItem('RELOAD_WEBVIEW');
    return isEmpty(reloadWebview) ? 'first' : 'second';
  } catch (e) {
    // saving error
  }
};

const clearReloadWebview = () => {
  try {
    AsyncStorage.removeItem('RELOAD_WEBVIEW');
  } catch (e) {
    // saving error
  }
};

// Remember Email functions
const setRememberedEmail = async (email: string) => {
  try {
    await AsyncStorage.setItem(Key.REMEMBERED_EMAIL, email);
  } catch (e) {
    // saving error
  }
};

const getRememberedEmail = async () => {
  try {
    const email = await AsyncStorage.getItem(Key.REMEMBERED_EMAIL);
    return email || '';
  } catch (e) {
    // saving error
    return '';
  }
};

const clearRememberedEmail = async () => {
  try {
    await AsyncStorage.removeItem(Key.REMEMBERED_EMAIL);
  } catch (e) {
    // saving error
  }
};

export default {
  setToken,
  getToken,
  setCustomerLoginIdKey,
  getCustomerLoginIdKey,
  clearCustomerLoginIdKey,
  setDataRememberLoginKey,
  getDataRememberLoginKey,
  clearDataRememberLoginKey,
  saveReloadWebview,
  getReloadWebview,
  clearReloadWebview,
  setRememberedEmail,
  getRememberedEmail,
  clearRememberedEmail,
};
