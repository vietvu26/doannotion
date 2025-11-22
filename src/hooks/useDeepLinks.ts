import {useEffect} from 'react';
import {Linking} from 'react-native';
import {NavigationContainerRef} from '@react-navigation/native';
import {handleDeepLink} from '../utils/deepLinkHandler';

export const useDeepLinks = (
  navigationRef: React.RefObject<NavigationContainerRef<any> | null>,
) => {
  useEffect(() => {
    // Handle deep link when app is opened from a closed state
    const getInitialUrl = async () => {
      const initialUrl = await Linking.getInitialURL();
      if (initialUrl) {
        handleDeepLink(initialUrl, navigationRef);
      }
    };

    // Handle deep link when app is already running
    const subscription = Linking.addEventListener('url', event => {
      handleDeepLink(event.url, navigationRef);
    });

    getInitialUrl();

    return () => {
      subscription.remove();
    };
  }, [navigationRef]);
};

