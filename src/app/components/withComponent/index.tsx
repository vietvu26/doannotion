import {Federated} from '@callstack/repack/client';
import React, {useMemo} from 'react';
import SplashScreen from '../../components/Splash';
import {useRoute} from '@react-navigation/native';

const WithComponent = (props: any) => {
  const router = useRoute<any>();
  const {app, moduleName} = router?.params;
  const ComponentCM = useMemo(() => {
    return React.lazy(() => Federated.importModule(app, `./${moduleName}`));
  }, [app, moduleName]);
  return (
    <React.Suspense fallback={<SplashScreen app={''} />}>
      <ComponentCM {...props} />
    </React.Suspense>
  );
};

export default WithComponent;
