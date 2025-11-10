// Import external
import React, {FC} from 'react';
import {StyleProp, Text, TextProps, TextStyle} from 'react-native';

// Import internal
import styles from './styles';

type Props = {
  style?: StyleProp<TextStyle> | undefined;
  children?: any;
};
// Constructor<NativeMethods> & typeof TextComponent;
const TextCM: FC<Props & TextProps> = ({style, children, ...more}) => {
  return (
    <Text
      allowFontScaling={false}
      style={[styles.ctnContainer, style]}
      {...more}>
      {children}
    </Text>
  );
};

export default TextCM;
