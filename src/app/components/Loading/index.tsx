// Import external
import React, {FC} from 'react';
import {
  ActivityIndicator,
  Modal,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';

// Import internal
import styles from './styles';
import TextCM from '../Text';
import {Color} from '../../../constants';

type Props = {
  style?: StyleProp<ViewStyle>;
  message?: string;
  isVisible?: boolean;
};

const LoadingCM: FC<Props> = ({style, message, isVisible}) => {
  // const loading = useAppSelector(state => state.common.loading);
  return (
    <Modal visible={isVisible} transparent={true} style={style}>
      <View style={styles.ctnContainer}>
        <ActivityIndicator size={'large'} color={Color.White} />
        <TextCM>{message}</TextCM>
      </View>
    </Modal>
  );
};

export default LoadingCM;
