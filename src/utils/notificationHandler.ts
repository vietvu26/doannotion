import messaging from '@react-native-firebase/messaging';
import notifee, {AndroidImportance, EventType} from '@notifee/react-native';
import {AppState} from 'react-native';
import {NavigationContainerRef} from '@react-navigation/native';
import {handleDeepLink} from './deepLinkHandler';

export const setupFCMHandlers = (
  navigationRef: React.RefObject<NavigationContainerRef<any> | null>,
): (() => void) | null => {
  // Request permission for notifications
  messaging()
    .requestPermission()
    .then(authStatus => {
      console.log('Notification permission status:', authStatus);
    })
    .catch(error => {
      console.error('Error requesting notification permission:', error);
    });

  // Tạo notification channel cho Android
  notifee.createChannel({
    id: 'default',
    name: 'Thông báo chung',
    importance: AndroidImportance.HIGH,
  });

  // Xử lý notification khi app ở foreground
  const unsubscribeForeground = messaging().onMessage(async remoteMessage => {
    console.log('=== Nhận FCM notification (foreground) ===');
    console.log('Message ID:', remoteMessage.messageId);
    console.log('App State:', AppState.currentState);
    console.log('Data:', JSON.stringify(remoteMessage.data, null, 2));

    try {
      const title =
        typeof remoteMessage.notification?.title === 'string'
          ? remoteMessage.notification.title
          : typeof remoteMessage.data?.title === 'string'
          ? remoteMessage.data.title
          : 'Thông báo';
      const body =
        typeof remoteMessage.notification?.body === 'string'
          ? remoteMessage.notification.body
          : typeof remoteMessage.data?.body === 'string'
          ? remoteMessage.data.body
          : 'Bạn có thông báo mới';
      const notionId = remoteMessage.data?.notionId;
      const deepLink =
        remoteMessage.data?.deepLink ||
        (notionId ? `mobilenote://notion/${notionId}` : 'mobilenote://home');

      const channelId = await notifee.createChannel({
        id: 'default',
        name: 'Thông báo chung',
        importance: AndroidImportance.HIGH,
        sound: 'default',
      });

      await notifee.displayNotification({
        title: title,
        body: body,
        android: {
          channelId: channelId,
          pressAction: {
            id: 'default',
            launchActivity: 'default',
          },
          importance: AndroidImportance.HIGH,
          sound: 'default',
        },
        data: {
          notionId: notionId || '',
          deepLink: deepLink,
          messageId: remoteMessage.messageId || '',
        },
      });

      console.log('=== Notification displayed successfully (foreground) ===');
    } catch (error) {
      console.error('=== Lỗi hiển thị notification (foreground) ===');
      console.error('Error:', error);
    }
  });

  // Xử lý notification khi app được mở từ background/quit state
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        console.log('=== Notification mở app từ quit state ===');
        const deepLinkValue = remoteMessage.data?.deepLink;
        const notionIdValue = remoteMessage.data?.notionId;
        const deepLink =
          typeof deepLinkValue === 'string'
            ? deepLinkValue
            : notionIdValue
            ? `mobilenote://notion/${notionIdValue}`
            : null;
        if (deepLink && typeof deepLink === 'string') {
          console.log('Opening deep link from quit state:', deepLink);
          setTimeout(() => {
            handleDeepLink(deepLink, navigationRef);
          }, 1000);
        }
      }
    })
    .catch(error => {
      console.error('Error getting initial notification:', error);
    });

  // Xử lý notification khi app được mở từ background
  messaging().onNotificationOpenedApp(remoteMessage => {
    console.log('=== Notification mở app từ background ===');
    const deepLinkValue = remoteMessage.data?.deepLink;
    const notionIdValue = remoteMessage.data?.notionId;
    const deepLink =
      typeof deepLinkValue === 'string'
        ? deepLinkValue
        : notionIdValue
        ? `mobilenote://notion/${notionIdValue}`
        : null;
    if (deepLink && typeof deepLink === 'string') {
      console.log('Opening deep link from background:', deepLink);
      setTimeout(() => {
        handleDeepLink(deepLink, navigationRef);
      }, 500);
    }
  });

  // Xử lý khi user tap vào notification (foreground)
  notifee.onForegroundEvent(async ({type, detail}) => {
    if (type === EventType.PRESS) {
      console.log('=== User tap vào notification (foreground) ===');
      const deepLink = detail.notification?.data?.deepLink;
      if (deepLink && typeof deepLink === 'string') {
        handleDeepLink(deepLink, navigationRef);
      }
    }
  });

  // Trả về cleanup function
  return () => {
    if (unsubscribeForeground) {
      unsubscribeForeground();
    }
  };
};

