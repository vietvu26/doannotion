import {Icon, Input, InputProps} from '@ui-kitten/components';
import {
  KeyboardTypeOptions,
  Pressable,
  StyleProp,
  TextInputProps,
  TextStyle,
  View,
} from 'react-native';
import TextCM from '../Text';
import {Font} from '../../../constants';

type Props = {
  label?: string;
  labelStyle?: StyleProp<TextStyle>;
  isRequired?: boolean;
  placeholder?: string;
  size?: 'large' | 'medium' | 'small';
  captionText?: string;
  value: string;
  onChangeText: (type: any, value: string) => void;
  multiline?: boolean;
  status?:
    | 'basic'
    | 'primary'
    | 'success'
    | 'info'
    | 'warning'
    | 'danger'
    | 'control';
  onBlur?: (e: any) => void;
  onFocus?: (e: any) => void;
  type?: any;
  disabled?: boolean;
  keyBoardType?: KeyboardTypeOptions;
  onSubmitEditing?: any;
  accessoryRightIcon?: any;
  secureTextEntry?: boolean;
  isShowAccessoryLeft?: boolean;
};

const InputCM = ({
  label,
  labelStyle,
  isRequired = false,
  placeholder,
  size = 'medium',
  captionText,
  value,
  onChangeText,
  multiline = false,
  status = 'basic',
  onBlur,
  onFocus,
  type,
  disabled = false,
  keyBoardType = 'default',
  onSubmitEditing,
  accessoryRightIcon,
  secureTextEntry = false,
  isShowAccessoryLeft = false,
}: Props & InputProps & TextInputProps) => {
  return (
    <Input
      style={{
        backgroundColor: !disabled ? '#fff' : '#e6eaf0',
        flex: 1,
      }}
      secureTextEntry={secureTextEntry}
      onSubmitEditing={onSubmitEditing}
      keyboardType={keyBoardType}
      disabled={disabled}
      value={value}
      onChangeText={onChangeText}
      placeholderTextColor={'#00204D8C'}
      placeholder={placeholder}
      allowFontScaling={false}
      size={size}
      multiline={multiline}
      status={status}
      onBlur={onBlur}
      onFocus={onFocus}
      label={
        label
          ? props => (
              <TextCM
                {...props}
                style={[
                  labelStyle,
                  {
                    fontSize: 12,
                    fontFamily: Font.InterMedium500,
                    color: '#00204DF2',
                    marginBottom: 4,
                    lineHeight: 22,
                  },
                ]}>
                {label}{' '}
                {isRequired && <TextCM style={{color: '#E14337'}}>*</TextCM>}
              </TextCM>
            )
          : undefined
      }
      caption={
        captionText
          ? props => (
              <View
                {...props}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                  columnGap: 10,
                  marginTop: 4,
                }}>
                <Icon fill={'#E14337'} width={14} height={14} name="info" />
                <TextCM
                  style={{
                    fontSize: 12,
                    fontFamily: Font.InterMedium500,
                    color: '#E14337',
                  }}>
                  {captionText}
                </TextCM>
              </View>
            )
          : undefined
      }
      accessoryRight={
        !accessoryRightIcon ? (
          value && !disabled ? (
            <Pressable onPress={() => onChangeText('')}>
              <Icon fill={'#00204D8C'} name="close" />
            </Pressable>
          ) : undefined
        ) : (
          <>
            {value && !disabled ? (
              <Pressable onPress={() => onChangeText('')}>
                <Icon width={24} height={24} fill={'#00204D8C'} name="close" />
              </Pressable>
            ) : undefined}
            {accessoryRightIcon}
          </>
        )
      }
      accessoryLeft={
        isShowAccessoryLeft ? (
          <Icon
            width={24}
            height={24}
            fill={'#00204D8C'}
            name="search-outline"
          />
        ) : undefined
      }
    />
  );
};

export default InputCM;
