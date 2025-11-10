import {isEmpty} from 'lodash';
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react';
import {
  Animated,
  StyleProp,
  TextInput,
  TextInputProps,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';
import TextCM from '../Text';
import styles from './styles';
import {SizeDP} from '../../../constants/Size';
import {Color} from '../../../constants';
import {Icon} from '@ui-kitten/components';

type Props = {
  containerStyle?: StyleProp<ViewStyle>;
  inputContainerStyle?: StyleProp<ViewStyle>;
  errorContainerStyle?: StyleProp<ViewStyle>;
  label?: string;
  viewIconRight?: React.ReactNode;
  viewIconLeft?: React.ReactNode;
  onChangeText?: (text: string) => void;
  value?: string;
  errorMessage?: string;
  isRequired?: boolean;
  onIconPress?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  isDisabled?: boolean;
  isFloatingLabel?: boolean;
  isShowIconClear?: boolean;
};

const TextFieldCM = forwardRef(
  (
    {
      containerStyle,
      inputContainerStyle,
      errorContainerStyle,
      label,
      viewIconRight,
      viewIconLeft,
      value,
      errorMessage,
      isRequired,
      onChangeText = () => {},
      onIconPress = () => {},
      onFocus = () => {},
      onBlur = () => {},
      isDisabled,
      isFloatingLabel = false,
      isShowIconClear = true,
      ...more
    }: Props & TextInputProps,
    ref,
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [textValue, setTextValue] = useState('');
    const textInputRef = useRef<TextInput>(null);

    const floatingLabelAnimation = useRef(new Animated.Value(0)).current;

    const handleOnchangeText = (text: string) => {
      setTextValue(text);
      onChangeText(text);
    };

    useEffect(() => {
      if (!isEmpty(value)) {
        setTextValue(value ?? '');
        if (isFloatingLabel) {
          Animated.timing(floatingLabelAnimation, {
            toValue: 1,
            duration: 150,
            useNativeDriver: false,
          }).start();
        }
      }
    }, [value]);

    useImperativeHandle(ref, () => ({
      focus: () => {
        if (textInputRef.current) {
          textInputRef.current.focus();
        }
      },
      blur: () => {
        if (textInputRef.current) {
          textInputRef.current.blur();
        }
      },
      clear: () => {
        if (textInputRef.current) {
          textInputRef.current.clear();
          setTextValue('');
        }
      },
    }));

    const handleFocus = () => {
      setIsFocused(true);
      if (isFloatingLabel) {
        Animated.timing(floatingLabelAnimation, {
          toValue: 1,
          duration: 150,
          useNativeDriver: false,
        }).start();
      }
      if (onFocus) {
        onFocus();
      }
    };

    const handleBlur = () => {
      setIsFocused(false);
      if (isEmpty(textValue)) {
        Animated.timing(floatingLabelAnimation, {
          toValue: 0,
          duration: 150,
          useNativeDriver: false,
        }).start();
      }
      if (onBlur) {
        onBlur();
      }
    };

    const floatingLabelContainerStyle = {
      top: floatingLabelAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [SizeDP(10), 0],
      }),
    };

    const floatingFontSize = {
      fontSize: floatingLabelAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [SizeDP(14), SizeDP(11)],
      }),
    };

    const floatingLabelText = {
      fontSize: floatingLabelAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [SizeDP(14), SizeDP(11)],
      }),
      color: floatingLabelAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [
          Color.TextPrimary,
          isDisabled ? Color.textDisableColor : Color.TextPrimary,
        ],
      }),
    };

    const getDisableClearIcon = () => {
      if (more.readOnly) return false;
      if (isDisabled) return false;
      if (!isShowIconClear) return false;
      if (isEmpty(value)) return false;
      return true;
    };

    return (
      <View style={[containerStyle]}>
        <TouchableWithoutFeedback
          onPress={() => {
            if (textInputRef.current) {
              textInputRef.current.focus();
            }
          }}>
          <View
            style={[
              styles.inputContainer,
              more.multiline && styles.textAreaContainer,
              isFocused && {borderColor: Color.TxtCheckbox},
              !isEmpty(errorMessage) && {borderColor: Color.Red},
              isDisabled && {backgroundColor: Color.Background},
              inputContainerStyle,
            ]}>
            {!isEmpty(viewIconLeft) && (
              <View style={styles.iconContainer}>{viewIconLeft}</View>
            )}
            {isFloatingLabel ? (
              <View style={[styles.innerInputContainer]}>
                {!isEmpty(label) && (
                  <Animated.View
                    style={[
                      styles.labelContainer,
                      floatingLabelContainerStyle,
                    ]}>
                    <Animated.Text
                      allowFontScaling={false}
                      style={[
                        styles.labelDefault,
                        isDisabled && {color: Color.textDisableColor},
                        floatingLabelText,
                      ]}>
                      {label}
                    </Animated.Text>
                    {isRequired && (
                      <Animated.Text
                        allowFontScaling={false}
                        style={[styles.requiredIndicator, floatingFontSize]}>
                        *
                      </Animated.Text>
                    )}
                  </Animated.View>
                )}
                <TextInput
                  {...more}
                  ref={textInputRef}
                  style={[
                    styles.textInput,
                    isDisabled && {color: Color.textDisableColor},
                    !isEmpty(viewIconRight) && {paddingRight: SizeDP(8)},
                    !isEmpty(viewIconLeft) && {paddingLeft: SizeDP(8)},
                  ]}
                  allowFontScaling={false}
                  onChangeText={handleOnchangeText}
                  value={value}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  placeholderTextColor={
                    isFocused ? Color.textDisableColor : 'transparent'
                  }
                  editable={!isDisabled}
                />
                {more.multiline && (
                  <View style={styles.textCountContainer}>
                    <TextCM
                      style={
                        styles.textCount
                      }>{`${textValue.length}/${more.maxLength}`}</TextCM>
                  </View>
                )}
              </View>
            ) : (
              <View style={[styles.innerInputContainer]}>
                <TextInput
                  {...more}
                  ref={textInputRef}
                  placeholder={label}
                  allowFontScaling={false}
                  style={[
                    styles.textInput,
                    isDisabled && {color: Color.textDisableColor},
                    !isEmpty(viewIconRight) && {paddingRight: SizeDP(8)},
                    !isEmpty(viewIconLeft) && {paddingLeft: SizeDP(8)},
                  ]}
                  onChangeText={handleOnchangeText}
                  value={value}
                  onFocus={handleFocus}
                  onBlur={handleBlur}
                  editable={!isDisabled}
                />
                {more.multiline && (
                  <View style={styles.textCountContainer}>
                    <TextCM
                      style={
                        styles.textCount
                      }>{`${textValue.length}/${more.maxLength}`}</TextCM>
                  </View>
                )}
              </View>
            )}

            {getDisableClearIcon() && (
              <TouchableOpacity
                onPress={() => {
                  handleOnchangeText('');
                  textInputRef.current?.focus();
                }}
                style={styles.iconContainer}
                hitSlop={SizeDP(15)}>
                <Icon
                  name="close-outline"
                  width={SizeDP(18)}
                  height={SizeDP(18)}
                />
              </TouchableOpacity>
            )}
            {!isEmpty(viewIconRight) && (
              <TouchableOpacity
                style={styles.iconContainer}
                onPress={onIconPress}>
                {viewIconRight}
              </TouchableOpacity>
            )}
          </View>
        </TouchableWithoutFeedback>
        {!isEmpty(errorMessage) && (
          <View style={[styles.errorContainer, errorContainerStyle]}>
            {/* <IconError width={SizeDP(16)} height={SizeDP(16)} /> */}
            <TextCM style={[styles.errorText]}>{errorMessage}</TextCM>
          </View>
        )}
      </View>
    );
  },
);

export default TextFieldCM;
