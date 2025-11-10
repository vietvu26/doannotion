import WebView from 'react-native-webview';
import HeaderCM from '../Header/HeaderCM';
import {useRoute} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';

const WebviewScreen = () => {
  const route = useRoute<any>();
  const url = route?.params?.url;
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#fff'}} edges={['bottom']}>
      <HeaderCM title="View" />
      <WebView
        onError={e => console.log(e)}
        startInLoadingState
        source={{uri: url}}
        onLoadStart={e => console.log('e', e)}
      />
    </SafeAreaView>
  );
};

export default WebviewScreen;
