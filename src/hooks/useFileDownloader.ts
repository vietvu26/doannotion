import {useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Platform} from 'react-native';
import RNFS, {DownloadFileOptions} from 'react-native-fs';
import {useAppSelector} from './useRedux';
import Toast from 'react-native-toast-message';

const useFileDownloader = (fileName: string, fileUrl: string) => {
  const accessToken = useAppSelector(state => state.common.accessToken);

  const [downloadStatus, setDownloadStatus] = useState('idle');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [filePath, setFilePath] = useState('');
  const {t} = useTranslation();

  const onDownloadStart = () => {
    downloadFile();
  };

  const downloadFile = async () => {
    const toFile = `${
      Platform.OS === 'android'
        ? RNFS.DownloadDirectoryPath
        : RNFS.DocumentDirectoryPath
    }/${fileName}`;
    setDownloadStatus('downloading');
    setProgress(0);
    setError('');

    const options: DownloadFileOptions = {
      fromUrl: fileUrl,
      toFile,
      background: true,
      // headers: {
      //   Authorization: `Bearer ${accessToken}`,
      // },
      begin: (res: any) => {
        console.log('Download has begun', res);
      },
      progress: (res: any) => {
        let percentage = (res.bytesWritten / res.contentLength) * 100;
        setProgress(percentage);
      },
      connectionTimeout: 1000 * 5,
    };

    try {
      const result = await RNFS.downloadFile(options).promise;
      if (result.statusCode === 200) {
        setDownloadStatus('completed');
        setFilePath(toFile);
        Toast.show({
          type: 'success',
          text1: t('DC.DowloadFIle.success'),
        });
      } else {
        Toast.show({
          type: 'error',
          text1: t('DC.DowloadFIle.fail'),
        });
        setDownloadStatus('failed');
        setError(`Failed with status code: ${result.statusCode}`);
      }
    } catch (err: any) {
      Toast.show({
        type: 'error',
        text1: t('DC.DowloadFIle.fail'),
      });
      setDownloadStatus('failed');
      setError(err?.message);
    }
  };

  return {downloadStatus, progress, error, filePath, onDownloadStart};
};

export default useFileDownloader;
