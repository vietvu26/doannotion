// Import external
import React, {FC, useCallback} from 'react';
import {
  ActivityIndicator,
  StyleProp,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
// Import internal
import {debounce, isEmpty} from 'lodash';
import TextCM from '../Text';
import styles from './styles';
import {Color} from '../../../constants';

type Props = {
  style?: StyleProp<ViewStyle>;
  styleLabel?: StyleProp<TextStyle>;
  label?: string;
  onPress: () => void;
  debounceNumber?: number;
  viewIconLeft?: React.ReactNode;
  viewIconRight?: React.ReactNode;
  disabled?: boolean;
  loading?: boolean;
};

const ButtonCM: FC<Props> = ({
  style,
  styleLabel,
  label = 'text button',
  onPress = () => {},
  debounceNumber = 0,
  disabled = false,
  loading = false,
  viewIconLeft,
  viewIconRight,
}) => {
  const handlerPress = useCallback(debounce(onPress, debounceNumber), [
    onPress,
  ]);
  return (
    <TouchableOpacity
      disabled={disabled || loading}
      style={[styles.btnDefault, disabled && styles.btnDisable, style]}
      onPress={handlerPress}>
      <View>{!isEmpty(viewIconLeft) && viewIconLeft}</View>
      {loading ? (
        <ActivityIndicator size="small" color={Color.White} />
      ) : (
        <TextCM style={[styles.txtDefault, styleLabel]}>
          {label}
        </TextCM>
      )}
      <View>{!isEmpty(viewIconRight) && viewIconRight}</View>
    </TouchableOpacity>
  );
};

export default ButtonCM;
