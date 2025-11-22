import React, {useRef} from 'react';
import {View, ActivityIndicator} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import * as eva from '@eva-design/eva';
import {ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import {NavigationContainer, NavigationContainerRef} from '@react-navigation/native';
import RootNavigator from './src/navigation';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';
import {store, persistor} from './src/redux';
import {NavigationName} from './src/constants';
import {useNotifications} from './src/hooks/useNotifications';
import {useDeepLinks} from './src/hooks/useDeepLinks';

export default function App() {
  const navigationRef = useRef<NavigationContainerRef<any>>(null);

  // Setup notifications handlers
  useNotifications(navigationRef);

  // Setup deep links handlers
  useDeepLinks(navigationRef);
  const linking = {
    prefixes: ['mobilenote://','https://mobilenote.com' ],
    config: {
      screens: {
        [NavigationName.Login]: 'login',
        [NavigationName.Dashboard]: 'dashboard',
        [NavigationName.NotionDetail]: 'notion/:notionId',
        [NavigationName.ETaskDetail]: 'task/:taskId',
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
