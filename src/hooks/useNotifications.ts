import {useEffect, useRef} from 'react';
import {NavigationContainerRef} from '@react-navigation/native';
import {setupFCMHandlers} from '../utils/notificationHandler';

export const useNotifications = (
  navigationRef: React.RefObject<NavigationContainerRef<any> | null>,
) => {
  const unsubscribeForegroundRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    const cleanup = setupFCMHandlers(navigationRef);
    if (cleanup) {
      unsubscribeForegroundRef.current = cleanup;
    }

    return () => {
      if (unsubscribeForegroundRef.current) {
        unsubscribeForegroundRef.current();
        unsubscribeForegroundRef.current = null;
      }
    };
  }, [navigationRef]);
};

