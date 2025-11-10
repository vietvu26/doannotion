import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { Color, NavigationName } from '../../../../constants';
import TextCM from '../../../components/Text';
import { IcEyes, IcOpenEyes } from '../../../../assets/images';
import { registerComplete } from '../../../../services/auth.services';
import styles from './styles';

interface RouteParams {
  email?: string;
  phone?: string; // Phone có thể không cần nữa, nhưng giữ lại để tương thích
}

const CreatePasswordScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const params = route.params as RouteParams;
  const email = params?.email || '';
  // Phone không còn cần thiết nữa vì đã được lưu trong bảng tạm

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newPasswordError, setNewPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateNewPassword = (text: string) => {
    setNewPassword(text);
    
    if (newPasswordError) {
      setNewPasswordError('');
    }
  };

  const validateConfirmPassword = (text: string) => {
    setConfirmPassword(text);
    
    if (confirmPasswordError) {
      setConfirmPasswordError('');
    }
  };

  const handleConfirm = async () => {
    // Clear previous errors
    setNewPasswordError('');
    setConfirmPasswordError('');

    let hasError = false;

    // Validate new password
    if (!newPassword.trim()) {
      setNewPasswordError('Vui lòng nhập mật khẩu mới');
      hasError = true;
    } else if (newPassword.length < 5) {
      setNewPasswordError('Độ dài tối thiểu 5 ký tự');
      hasError = true;
    }

    // Validate confirm password
    if (!confirmPassword.trim()) {
      setConfirmPasswordError('Vui lòng nhập lại mật khẩu mới');
      hasError = true;
    } else if (newPassword !== confirmPassword) {
      setConfirmPasswordError('Mật khẩu không khớp');
      hasError = true;
    }

    if (hasError) {
      return;
    }

    setIsLoading(true);

    try {
      // Gọi API đăng ký hoàn tất (lưu user vào DB với password)
      // Phone sẽ được lấy từ bảng tạm (sau khi đã xác thực OTP)
      const result = await registerComplete(email, newPassword);

      setIsLoading(false);

      if (result.success) {
        Toast.show({
          type: 'success',
          text1: 'Đăng ký thành công',
          text2: 'Bạn có thể đăng nhập ngay bây giờ',
          visibilityTime: 3000,
        });

        // Navigate to login after a short delay
        setTimeout(() => {
          navigation.replace(NavigationName.Login);
        }, 1500);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Đăng ký thất bại',
          text2: result.message,
          visibilityTime: 3000,
        });
      }
    } catch (error: any) {
      setIsLoading(false);
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: error.message || 'Đã xảy ra lỗi. Vui lòng thử lại.',
        visibilityTime: 3000,
      });
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
      
      {/* Background Image */}
      <View style={styles.imageContainer}>
        <Image
          source={require('../../../../assets/images/ic/Image.png')}
          style={styles.backgroundImage}
        />
      </View>

      <View style={styles.contentWrapper}>
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
              {/* Title */}
              <TextCM style={styles.title}>Tạo mật khẩu</TextCM>

            {/* New Password input */}
            <View style={styles.inputContainer}>
              <TextCM style={styles.inputLabel}>
                Mật khẩu mới <TextCM style={styles.required}>*</TextCM>
              </TextCM>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={[
                    styles.input,
                    styles.passwordInput,
                    newPasswordError ? styles.inputError : null
                  ]}
                  placeholder="Nhập mật khẩu mới"
                  placeholderTextColor="#9CA3AF"
                  value={newPassword}
                  onChangeText={validateNewPassword}
                  secureTextEntry={!showNewPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowNewPassword(!showNewPassword)}
                >
                  {showNewPassword ? (
                    <IcEyes width={20} height={20} />
                  ) : (
                    <IcOpenEyes width={20} height={20} />
                  )}
                </TouchableOpacity>
              </View>
              {newPasswordError ? (
                <View style={styles.errorContainer}>
                  <TextCM style={styles.errorText}>{newPasswordError}</TextCM>
                </View>
              ) : (
                <View style={styles.validationContainer}>
                  <TextCM style={styles.validationText}>
                    Độ dài tối thiểu 5 ký tự
                  </TextCM>
                </View>
              )}
            </View>

            {/* Confirm Password input */}
            <View style={styles.inputContainer}>
              <TextCM style={styles.inputLabel}>
                Nhập lại mật khẩu mới <TextCM style={styles.required}>*</TextCM>
              </TextCM>
              <View style={styles.passwordInputContainer}>
                <TextInput
                  style={[
                    styles.input,
                    styles.passwordInput,
                    confirmPasswordError ? styles.inputError : null
                  ]}
                  placeholder="Nhập lại mật khẩu mới"
                  placeholderTextColor="#9CA3AF"
                  value={confirmPassword}
                  onChangeText={validateConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                <TouchableOpacity
                  style={styles.eyeIcon}
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <IcEyes width={20} height={20} />
                  ) : (
                    <IcOpenEyes width={20} height={20} />
                  )}
                </TouchableOpacity>
              </View>
              {confirmPasswordError ? (
                <View style={styles.errorContainer}>
                  <TextCM style={styles.errorText}>{confirmPasswordError}</TextCM>
                </View>
              ) : null}
            </View>

            {/* Confirm button */}
            <TouchableOpacity
              style={[styles.confirmButton, isLoading && styles.confirmButtonDisabled]}
              onPress={handleConfirm}
              activeOpacity={0.8}
              disabled={isLoading}
            >
              <TextCM style={styles.confirmButtonText}>
                {isLoading ? 'Đang xử lý...' : 'Xác nhận'}
              </TextCM>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      </View>
    </View>
  );
};

export default CreatePasswordScreen;

