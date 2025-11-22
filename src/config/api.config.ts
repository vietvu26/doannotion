import { Platform } from 'react-native';



const YOUR_COMPUTER_IP = '192.168.52.102'; 
const PRODUCTION_API_URL = 'http://192.168.52.102:3000'; 

export const getApiUrl = (): string => {
  if (__DEV__) {
    if (Platform.OS === 'android') {
      return 'http://10.0.2.2:3000';
    } else {
      return `http://${YOUR_COMPUTER_IP}:3000`;
    }
  } else {
    return PRODUCTION_API_URL;
  }
};

export const API_URL = getApiUrl();




