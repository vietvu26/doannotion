import {StyleProp, TextStyle, View, ViewStyle} from 'react-native';
import ButtonCM from '../Button';
import {FC} from 'react';
import styles from './styles';

type Props = {
  onPressLeft: () => void;
  onPressRight: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  btnStyleLeft?: StyleProp<ViewStyle>;
  btnStyleRight?: StyleProp<ViewStyle>;
  labelStyleLeft?: StyleProp<TextStyle>;
  labelStyleRight?: StyleProp<TextStyle>;
  labelLeft?: string;
  labelRight?: string;
};

const GroupButtonCM = ({
  onPressLeft,
  onPressRight,
  containerStyle,
  btnStyleLeft,
  btnStyleRight,
  labelStyleLeft,
  labelStyleRight,
  labelLeft = 'left',
  labelRight = 'right',
}: Props) => {
  return (
    <View style={[containerStyle, styles.ctnGroup]}>
      <ButtonCM
        style={[styles.btn, styles.btnLeft, btnStyleLeft]}
        label={labelLeft}
        styleLabel={[labelStyleLeft, styles.labelStyleLeft]}
        onPress={onPressLeft}
      />
      <ButtonCM
        style={[styles.btn, btnStyleRight]}
        label={labelRight}
        styleLabel={[labelStyleRight]}
        onPress={onPressRight}
      />
    </View>
  );
};

export default GroupButtonCM;
