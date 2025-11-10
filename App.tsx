import React, { useEffect, useRef } from 'react';
import { View, ActivityIndicator, Linking, AppState } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as eva from '@eva-design/eva';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import RootNavigator from './src/navigation';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from './src/redux';
import { NavigationName } from './src/constants';
import axios from 'axios';
import { getApiUrl } from './src/config/api.config';
import { NotionItem } from './src/app/screen/Notion/Home';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';

export default function App() {
  const navigationRef = useRef<NavigationContainerRef<any>>(null);
  const unsubscribeForegroundRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    // Handle deep link when app is opened from a closed state
    const getInitialUrl = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        handleDeepLink(initialUrl);
      }
    };

    // Handle deep link when app is already running
    const subscription = Linking.addEventListener('url', (event) => {
      handleDeepLink(event.url);
    });

    getInitialUrl();

    // Setup FCM notification handlers
    const cleanup = setupFCMHandlers();
    if (cleanup) {
      unsubscribeForegroundRef.current = cleanup;
    }

    return () => {
      subscription.remove();
      // Cleanup foreground handler để tránh duplicate
      if (unsubscribeForegroundRef.current) {
        unsubscribeForegroundRef.current();
        unsubscribeForegroundRef.current = null;
      }
    };
  }, []);

  const setupFCMHandlers = (): (() => void) | null => {
    // Request permission for notifications
    messaging()
      .requestPermission()
      .then((authStatus) => {
        console.log('Notification permission status:', authStatus);
      })
      .catch((error) => {
        console.error('Error requesting notification permission:', error);
      });

    // Tạo notification channel cho Android
    notifee.createChannel({
      id: 'default',
      name: 'Thông báo chung',
      importance: AndroidImportance.HIGH,
    });

    // Xử lý notification khi app ở foreground
    // Với data-only message, handler này sẽ được gọi khi app đang mở
    // NHƯNG: Chỉ hiển thị notification bằng notifee, không để hệ thống tự hiển thị
    const unsubscribeForeground = messaging().onMessage(async (remoteMessage) => {
      console.log('=== Nhận FCM notification (foreground) ===');
      console.log('Message ID:', remoteMessage.messageId);
      console.log('App State:', AppState.currentState);
      console.log('Notification:', JSON.stringify(remoteMessage.notification, null, 2));
      console.log('Data:', JSON.stringify(remoteMessage.data, null, 2));

      try {
        // Lấy title và body từ notification object hoặc data
        const title = typeof remoteMessage.notification?.title === 'string' 
          ? remoteMessage.notification.title 
          : (typeof remoteMessage.data?.title === 'string' ? remoteMessage.data.title : 'Thông báo');
        const body = typeof remoteMessage.notification?.body === 'string'
          ? remoteMessage.notification.body
          : (typeof remoteMessage.data?.body === 'string' ? remoteMessage.data.body : 'Bạn có thông báo mới');
        const notionId = remoteMessage.data?.notionId;
        const deepLink = remoteMessage.data?.deepLink || (notionId ? `mobilenote://notion/${notionId}` : 'mobilenote://home');

        console.log('Title:', title);
        console.log('Body:', body);
        console.log('NotionId:', notionId);
        console.log('DeepLink:', deepLink);

        // Đảm bảo channel đã được tạo
        const channelId = await notifee.createChannel({
          id: 'default',
          name: 'Thông báo chung',
          importance: AndroidImportance.HIGH,
          sound: 'default',
        });

        console.log('Channel ID:', channelId);

        // Hiển thị notification bằng notifee - CHỈ trong foreground handler
        // Với data-only message, chỉ có handler này hiển thị notification
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
            messageId: remoteMessage.messageId || '', // Thêm messageId để tránh duplicate
          },
        });

        console.log('=== Notification displayed successfully (foreground) ===');
        console.log('Notification ID:', notificationId);
      } catch (error) {
        console.error('=== Lỗi hiển thị notification (foreground) ===');
        console.error('Error:', error);
        console.error('Error message:', error instanceof Error ? error.message : String(error));
        console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
      }
    });

    // Xử lý notification khi app được mở từ background/quit state
    messaging()
      .getInitialNotification()
      .then((remoteMessage) => {
        if (remoteMessage) {
          console.log('=== Notification mở app từ quit state ===');
          console.log('Remote message:', JSON.stringify(remoteMessage, null, 2));
          const deepLinkValue = remoteMessage.data?.deepLink;
          const notionIdValue = remoteMessage.data?.notionId;
          const deepLink = typeof deepLinkValue === 'string' ? deepLinkValue : 
                          (notionIdValue ? `mobilenote://notion/${notionIdValue}` : null);
          if (deepLink && typeof deepLink === 'string') {
            console.log('Opening deep link from quit state:', deepLink);
            setTimeout(() => {
              handleDeepLink(deepLink);
            }, 1000);
          }
        } else {
          console.log('No initial notification');
        }
      })
      .catch((error) => {
        console.error('Error getting initial notification:', error);
      });

    // Xử lý notification khi app được mở từ background
    messaging().onNotificationOpenedApp((remoteMessage) => {
      console.log('=== Notification mở app từ background ===');
      console.log('Remote message:', JSON.stringify(remoteMessage, null, 2));
      const deepLinkValue = remoteMessage.data?.deepLink;
      const notionIdValue = remoteMessage.data?.notionId;
      const deepLink = typeof deepLinkValue === 'string' ? deepLinkValue : 
                      (notionIdValue ? `mobilenote://notion/${notionIdValue}` : null);
      if (deepLink && typeof deepLink === 'string') {
        console.log('Opening deep link from background:', deepLink);
        setTimeout(() => {
          handleDeepLink(deepLink);
        }, 500);
      }
    });

    // Xử lý khi user tap vào notification (foreground)
    notifee.onForegroundEvent(async ({ type, detail }) => {
      if (type === EventType.PRESS) {
        console.log('=== User tap vào notification (foreground) ===');
        const deepLink = detail.notification?.data?.deepLink;
        if (deepLink && typeof deepLink === 'string') {
          handleDeepLink(deepLink);
        }
      }
    });

    // Xử lý khi user tap vào notification (background)
    notifee.onBackgroundEvent(async ({ type, detail }) => {
      if (type === EventType.PRESS) {
        console.log('=== User tap vào notification (background) ===');
        const deepLink = detail.notification?.data?.deepLink;
        if (deepLink && typeof deepLink === 'string') {
          Linking.openURL(deepLink);
        }
      }
    });

    // Trả về cleanup function để unsubscribe foreground handler
    return () => {
      if (unsubscribeForeground) {
        unsubscribeForeground();
      }
    };
  };

  const handleDeepLink = async (url: string) => {
    try {
      // Parse deeplink: mobileNote://notion/:notionId
      if (url.startsWith('mobilenote://notion/')) {
        const notionId = url.replace('mobilenote://notion/', '');
        if (notionId) {
          // Fetch notion data from API
          const response = await axios.get(`${getApiUrl()}/api/notion-by-id/${notionId}`);
          if (response.data && response.data.success && response.data.data) {
            const notionItem: NotionItem = response.data.data;
            
            // Navigate to DetailScreen after a short delay to ensure navigation is ready
            setTimeout(() => {
              navigationRef.current?.navigate(NavigationName.NotionDetail, {
                notionItem,
              });
            }, 500);
          }
        }
      }
    } catch (error) {
      console.error('Error handling deep link:', error);
    }
  };
  const linking = {
    prefixes: ['mobilenote://','https://mobilenote.com' ],
    config: {
      screens: {
        [NavigationName.Login]: 'login',
        [NavigationName.Dashboard]: 'dashboard',
        [NavigationName.NotionDetail]: 'notion/:notionId',
        [NavigationName.Settings]: 'settings',
        [NavigationName.AccountInfo]: 'account',
      },
    },
  };
  return (
    <Provider store={store}>
      <PersistGate 
        loading={
          <SafeAreaProvider>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' }}>
              <ActivityIndicator size="large" color="#7C3AED" />
            </View>
          </SafeAreaProvider>
        } 
        persistor={persistor}
        onBeforeLift={() => {
          // State đã được restore từ AsyncStorage
          // Giờ có thể render app
        }}
      >
        <IconRegistry icons={EvaIconsPack} />
        <ApplicationProvider {...eva} theme={eva.light}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
              <NavigationContainer ref={navigationRef} linking={linking}>
                <RootNavigator />
              </NavigationContainer>
            </SafeAreaProvider>
          </GestureHandlerRootView>
        </ApplicationProvider>
      </PersistGate>
    </Provider>
  );
}
