import {NavigationContainerRef} from '@react-navigation/native';
import axios from 'axios';
import {NavigationName} from '../constants';
import {getApiUrl} from '../config/api.config';
import {NotionItem} from '../app/screen/Notion/Home';

export const handleDeepLink = async (
  url: string,
  navigationRef: React.RefObject<NavigationContainerRef<any> | null>,
) => {
  try {
    console.log('=== Handling deep link ===');
    console.log('URL:', url);

    // Parse deeplink: mobileNote://notion/:notionId
    if (url.startsWith('mobilenote://notion/')) {
      const notionId = url.replace('mobilenote://notion/', '');
      if (notionId) {
        const response = await axios.get(`${getApiUrl()}/api/notion-by-id/${notionId}`);
        if (response.data?.success && response.data?.data) {
          const notionItem: NotionItem = response.data.data;
          setTimeout(() => {
            navigationRef.current?.navigate(NavigationName.NotionDetail, {
              notionItem,
            });
          }, 500);
        }
      }
    }
    // Parse deeplink: mobileNote://task/:taskId
    else if (url.startsWith('mobilenote://task/')) {
      const taskIdStr = url.replace('mobilenote://task/', '').trim();
      if (taskIdStr) {
        const taskId = parseInt(taskIdStr, 10);
        if (!isNaN(taskId) && taskId > 0) {
          console.log('=== Navigating to task detail ===');
          console.log('Task ID:', taskId);
          setTimeout(() => {
            if (navigationRef.current) {
              navigationRef.current.navigate(NavigationName.TaskDetailScreen, {
                taskId: taskId,
              });
            } else {
              console.error('Navigation ref is null');
            }
          }, 500);
        } else {
          console.error('Invalid taskId:', taskIdStr);
        }
      }
    }
  } catch (error) {
    console.error('Error handling deep link:', error);
  }
};

