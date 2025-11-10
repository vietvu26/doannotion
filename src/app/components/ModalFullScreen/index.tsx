import {Modal} from '@ui-kitten/components';
import {Platform, StyleProp, ViewStyle} from 'react-native';
import {SafeAreaView, useSafeAreaInsets} from 'react-native-safe-area-context';

type Props = {
  isVisible: boolean;
  children: React.ReactNode;
  backdropStyle?: StyleProp<ViewStyle>;
  animationType?: 'none' | 'slide' | 'fade';
  paddingBottom?: boolean;
};

const ModalFullScreen = ({
  isVisible,
  children,
  backdropStyle,
  animationType = 'slide',
  paddingBottom = true,
}: Props) => {
  const inset = useSafeAreaInsets();

  return (
    <Modal
      shouldUseContainer={false}
      visible={isVisible}
      backdropStyle={[{backgroundColor: '#fff'}, backdropStyle]}
      animationType={animationType}
      children={
        <SafeAreaView
          style={[
            {flex: 1, marginTop:  Platform.OS === 'android' ? 0 : inset.top , paddingBottom: inset.bottom},
            {paddingBottom: paddingBottom ? inset.bottom : 0},
          ]}>
          {children}
        </SafeAreaView>
      }
    />
  );
};

export default ModalFullScreen;
