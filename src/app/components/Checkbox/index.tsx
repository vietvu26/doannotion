// Import external
import React, {FC} from 'react';
import {
  StyleProp,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

// Import internal
import styles from './styles';
import TextCM from '../Text';
import {Icon} from '@ui-kitten/components';
import { Color } from '../../../constants';

type Props = {
  style?: StyleProp<ViewStyle>;
  checked: boolean;
  onChange: () => void;
  label?: string;
  labelStyle?: StyleProp<TextStyle>;
};

const CheckboxCM: FC<Props> = ({
  checked,
  label,
  onChange,
  style,
  labelStyle,
}) => {
  return (
    <View style={[styles.ctnContainer, style]}>
      <TouchableOpacity onPress={onChange}>
        <Icon
          name={!checked ? 'square-outline' : 'checkmark-square-2'}
          fill={Color.processing}
          width={24}
          height={24}
        />
      </TouchableOpacity>
      <TouchableOpacity activeOpacity={1} onPress={onChange}>
        <TextCM style={[styles.txtLabel, labelStyle]}>{label}</TextCM>
      </TouchableOpacity>
    </View>
  );
};

export default CheckboxCM;
