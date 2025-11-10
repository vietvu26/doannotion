import {Platform, Share} from 'react-native';
import DocumentPicker from 'react-native-document-picker';
import Toast from 'react-native-toast-message';
import {isProduct, setConfig} from '../services/httpClient';
import {dataEnv, TypeOfDataEnv} from '../constants/Env';

const getSize = (size: number) => {
  if (size && size >= 1024) {
    return Math.floor(size / 1024) + ' KB';
  } else if (size && size < 1024) {
    return size + ' MB';
  } else {
    return '-';
  }
};
const handleGetFile = async () => {
  try {
    const data = await DocumentPicker.pick({
      type: [DocumentPicker.types.allFiles],
    });
    if (data?.[0].size && data?.[0].size >= 10485760) {
      Toast.show({
        type: 'error',
        text1: 'Thông báo',
        text2: 'Dung lượng tệp tin quá lớn (tối đa 10MB)',
      });
      return null;
    }
    const fileUri =
      Platform.OS === 'ios'
        ? data?.[0].uri.replace('file://', '')
        : data?.[0].uri;
    return {
      uri: fileUri,
      type: data?.[0].type,
      name: data?.[0]?.name,
    };
  } catch (error) {
    if (DocumentPicker.isCancel(error)) {
      console.log('User cancelled the picker');
    } else {
      console.error(error);
    }
    return null;
  }
};

const downloadFile = async (
  fileName: string,
  baseUrl: string,
  isShare = true,
) => {
  try {
    // Lazy load RNFS để tránh lỗi khi native module chưa sẵn sàng
    const RNFS = require('react-native-fs').default;
    
    if (!RNFS || !RNFS.DocumentDirectoryPath) {
      console.error('RNFS native module chưa sẵn sàng');
      return {
        uri: '',
        status: 'error',
      };
    }
    
    let statusDownload = '';
    const toFile = `${
      Platform.OS === 'android'
        ? RNFS.DocumentDirectoryPath
        : RNFS.DocumentDirectoryPath
    }/${fileName}`;
    
    // Sử dụng RNFS.downloadFile thay vì ReactNativeBlobUtil
    const downloadResult = await RNFS.downloadFile({
      fromUrl: baseUrl,
      toFile: toFile,
    }).promise;
    
    if (downloadResult.statusCode === 200) {
      if (isShare) {
        const dataShare = await Share.share({
          url: Platform.OS === 'ios' ? toFile : 'file://' + toFile,
        });
        if (dataShare.action == Share.dismissedAction) {
          statusDownload = 'error';
          await RNFS.unlink(toFile);
        } else {
          statusDownload = 'success';
        }
      } else {
        statusDownload = 'success';
      }

      return {
        uri: Platform.OS === 'ios' ? toFile : 'file://' + toFile,
        status: statusDownload,
      };
    }
    
    return {
      uri: '',
      status: 'error',
    };
  } catch (error) {
    console.error('Lỗi download file:', error);
    return {
      uri: '',
      status: 'error',
    };
  }
};

const generateBoxShadowStyle = (
  xOffset: number,
  yOffset: number,
  shadowColorIos: string,
  shadowOpacity: number,
  shadowRadius: number,
  elevation: number,
  shadowColorAndroid: string,
) => {
  if (Platform.OS === 'ios') {
    return {
      shadowColor: shadowColorIos,
      shadowOffset: {width: xOffset, height: yOffset},
      shadowOpacity,
      shadowRadius,
    };
  } else if (Platform.OS === 'android') {
    return {
      elevation,
      shadowColor: shadowColorAndroid,
    };
  }
};

const getDefaultConfig = (system: TypeOfDataEnv) => {
  setConfig((dataEnv as any)[system][isProduct]);
};

const parseQueryParamsString = (queryString: string) => {
  const params: any = {};
  const keyValuePairs = queryString.split('&');
  for (const pair of keyValuePairs) {
    const [key, value] = pair.split('=');
    params[key] = value;
  }
  return params;
};

const mimeTypes = {
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  gif: 'image/gif',
  webp: 'image/webp',
  svg: 'image/svg+xml',
  mp4: 'video/mp4',
  mp3: 'audio/mpeg',
  wav: 'audio/wav',
  pdf: 'application/pdf',
  doc: 'application/msword',
  docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  xls: 'application/vnd.ms-excel',
  xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ppt: 'application/vnd.ms-powerpoint',
  pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  txt: 'text/plain',
  csv: 'text/csv',
  json: 'application/json',
  zip: 'application/zip',
  rar: 'application/vnd.rar',
  '7z': 'application/x-7z-compressed',
};

const getMimeType = (fileName: any) => {
  if (!fileName) return 'application/octet-stream';
  const ext = fileName.split('.').pop().toLowerCase();
  return (mimeTypes as any)[ext] || 'application/octet-stream'; // Giá trị mặc định nếu không tìm thấy
};

const truncateText = (text: string, maxLength: number) => {
  if (text?.length <= maxLength) {
    return text;
  }
  return text?.substring(0, maxLength) + '...';
};

export default {
  getSize,
  handleGetFile,
  downloadFile,
  generateBoxShadowStyle,
  getDefaultConfig,
  parseQueryParamsString,
  getMimeType,
  truncateText,
};
