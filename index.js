/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';

// Background message handler - phải đăng ký trước khi register component
// Handler này CHỈ chạy khi app ở background hoặc quit state
// Với data-only message, handler này sẽ hiển thị notification bằng notifee
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('=== Background FCM notification received ===');
  console.log('Message ID:', remoteMessage.messageId);
  console.log('Message:', JSON.stringify(remoteMessage, null, 2));
  
  try {
    // Lấy title và body từ notification object hoặc data
    const title = remoteMessage.notification?.title || remoteMessage.data?.title || 'Thông báo';
    const body = remoteMessage.notification?.body || remoteMessage.data?.body || 'Bạn có thông báo mới';
    const notionId = remoteMessage.data?.notionId;
    const deepLink = remoteMessage.data?.deepLink || (notionId ? `mobilenote://notion/${notionId}` : 'mobilenote://home');

    console.log('Title:', title);
    console.log('Body:', body);
    console.log('NotionId:', notionId);
    console.log('DeepLink:', deepLink);

    // Tạo channel
    const channelId = await notifee.createChannel({
      id: 'default',
      name: 'Thông báo chung',
      importance: AndroidImportance.HIGH,
      sound: 'default',
    });

    console.log('Channel ID created:', channelId);

    // Hiển thị notification - CHỈ trong background handler
    // Đây là handler duy nhất hiển thị notification khi app ở background/quit
    const notificationId = await notifee.displayNotification({
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

    console.log('=== Background notification displayed successfully ===');
    console.log('Notification ID:', notificationId);
  } catch (error) {
    console.error('=== Error in background message handler ===');
    console.error('Error:', error);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
  }
});

// Background event handler cho notifee
notifee.onBackgroundEvent(async ({ type, detail }) => {
  console.log('=== Background event handler ===');
  console.log('Type:', type);
  console.log('Detail:', detail);
  
  if (type === EventType.PRESS) {
    const deepLink = detail.notification?.data?.deepLink;
    if (deepLink && typeof deepLink === 'string') {
      console.log('Opening deep link from background:', deepLink);
      // Sử dụng Linking để mở deeplink
      const { Linking } = require('react-native');
      Linking.openURL(deepLink);
    }
  }
});

AppRegistry.registerComponent(appName, () => App);
