import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { Color } from '../../../../constants';
import TextCM from '../../../components/Text';
import HeaderCM from '../../../components/Header/HeaderCM';
import { IconForgetPassword, IconMail } from '../../../../assets/images';
import styles from './styles';
import ButtonCM from '../../../components/Button';
import { forgotPassword } from '../../../../services/auth.services';
import { NavigationName } from '../../../../constants';

const ForgotPasswordScreen = () => {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (text: string) => {
    setEmail(text);
    
    if (emailError) {
      setEmailError('');
    }
  };

  const handleSendRequest = async () => {
    setEmailError('');

    if (!email.trim()) {
      setEmailError('Vui lòng nhập email');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Email không hợp lệ');
      return;
    }

    setIsLoading(true);

    try {
      const result = await forgotPassword(email.trim());

      if (result.success) {
        Toast.show({
          type: 'success',
          text1: 'Thành công',
          text2: result.message || 'Mã OTP đã được gửi đến email của bạn',
          visibilityTime: 3000,
        });

        // Chuyển đến màn hình OTP Verification với flag reset password
        navigation.navigate(NavigationName.OTPVerification, {
          email: email.trim(),
          isResetPassword: true,
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Lỗi',
          text2: result.message || 'Gửi yêu cầu thất bại. Vui lòng thử lại.',
          visibilityTime: 3000,
        });
      }
    } catch (error: any) {
      console.error('Error in handleSendRequest:', error);
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Có lỗi xảy ra. Vui lòng thử lại.',
        visibilityTime: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      {/* Header */}
      <HeaderCM
        title="Quên mật khẩu"
        fillIconBackLeft="#FFFFFF"
        onPressIconLeft={() => navigation.goBack()}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Content container */}
          <View style={styles.contentContainer}>
            {/* Icon */}
            <View style={styles.iconContainer}>
              <IconForgetPassword width={220} height={220} />
            </View>

            {/* Description */}
            <TextCM style={styles.description}>
              Nhập địa chỉ email đã đăng ký để đặt lại mật khẩu
            </TextCM>

            {/* Email input with icon */}
            <View style={styles.inputWrapper}>
              <View style={styles.inputContainer}>
                <View style={styles.emailIconContainer}>
                  <IconMail width={20} height={20} />
                </View>
                <TextInput
                  style={[
                    styles.input,
                    emailError ? styles.inputError : null
                  ]}
                  placeholder="Nhập email"
                  placeholderTextColor="#9CA3AF"
                  value={email}
                  onChangeText={validateEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
              {emailError ? (
                <View style={styles.errorContainer}>
                  <TextCM style={styles.errorText}>{emailError}</TextCM>
                </View>
              ) : null}
            </View>

            {/* Send request button */}
            {/* <TouchableOpacity
              style={styles.sendButton}
              onPress={handleSendRequest}
              activeOpacity={0.8}
            >
              <TextCM style={styles.sendButtonText}>Gửi yêu cầu</TextCM>
            </TouchableOpacity> */}
            <ButtonCM
              style={styles.sendButton}
              onPress={handleSendRequest}
              label={isLoading ? 'Đang gửi...' : 'Gửi yêu cầu'}
              disabled={isLoading}
            />
            {isLoading && (
              <ActivityIndicator
                size="small"
                color={Color.primary01}
                style={{ marginTop: 10 }}
              />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default ForgotPasswordScreen;