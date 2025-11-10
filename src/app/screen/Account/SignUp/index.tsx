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
import { useNavigation } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { Color, NavigationName } from '../../../../constants';
import TextCM from '../../../components/Text';
import CheckboxCM from '../../../components/Checkbox';
import { signUpWithEmail } from '../../../../services/auth.services';
import styles from './styles';

const SignUpScreen = () => {
  const navigation = useNavigation<any>();
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (text: string) => {
    setEmail(text);
    
    // Clear error when user is typing
    if (emailError) {
      setEmailError('');
    }
  };

  const validatePhone = (text: string) => {
    setPhone(text);
    
    // Clear error when user is typing
    if (phoneError) {
      setPhoneError('');
    }
  };

  const handleSignUp = async () => {
    // Clear previous errors
    setEmailError('');
    setPhoneError('');

    let hasError = false;

    // Check if email is empty
    if (!email.trim()) {
      setEmailError('Vui lòng nhập email');
      hasError = true;
    } else {
      // Validate email format
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setEmailError('Email không hợp lệ');
        hasError = true;
      }
    }

    // Check if phone is empty
    if (!phone.trim()) {
      setPhoneError('Vui lòng nhập số điện thoại');
      hasError = true;
    } else {
      // Validate phone format (Vietnamese phone number)
      // Accept: 03x, 04x, 05x, 07x, 08x, 09x (10 digits total)
      const phoneRegex = /^0[3-9][0-9]{8}$/;
      if (!phoneRegex.test(phone)) {
        setPhoneError('Số điện thoại không hợp lệ');
        hasError = true;
      }
    }

    // Check if user agreed to terms
    if (!agreedToTerms) {
      Alert.alert('Thông báo', 'Vui lòng đồng ý với điều khoản dịch vụ và chính sách bảo mật');
      return;
    }

    if (hasError) {
      return;
    }

    setIsLoading(true);

    try {
      console.log('=== Bắt đầu đăng ký ===');
      console.log('Email:', email.trim());
      console.log('Phone:', phone.trim());

      // Call API đăng ký (MySQL database)
      const result = await signUpWithEmail(email.trim(), phone.trim());

      console.log('=== Kết quả validate ===');
      console.log('Success:', result.success);
      console.log('Message:', result.message);

      // Kiểm tra nếu validate thành công và OTP đã được gửi
      if (result.success) {
        console.log('=== Validate thành công, OTP đã được gửi ===');
        console.log('Email:', email.trim());
        console.log('Phone:', phone.trim());
        console.log('=== Chuyển đến màn hình OTP Verification ===');

        // Tắt loading trước khi navigate
        setIsLoading(false);

        // Chuyển đến màn hình OTP Verification để xác thực email
        // Dùng navigate (không dùng replace) để user có thể quay lại nếu cần
        // Pass email và phone, và flag isSignUp = true để phân biệt với reset password
        navigation.navigate(NavigationName.OTPVerification, { 
          email: email.trim(),
          phone: phone.trim(),
          isSignUp: true,
        });
        
        console.log('✅ Đã chuyển đến màn hình OTP Verification');
      } else {
        // Tắt loading nếu có lỗi
        setIsLoading(false);
        // Show error message
        console.error('Validate thất bại:', result);
        const errorMessage = result.message || 'Thông tin không hợp lệ. Vui lòng thử lại.';
        
        Toast.show({
          type: 'error',
          text1: 'Đăng ký thất bại',
          text2: errorMessage,
          visibilityTime: 3000,
        });
      }
    } catch (error: any) {
      console.error('=== Lỗi trong handleSignUp ===');
      console.error('Error:', error);
      console.error('Error message:', error.message);
      console.error('Error code:', error.code);
      
      // Đảm bảo setIsLoading(false) được gọi trong catch
      setIsLoading(false);
      
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: error.message || 'Đã xảy ra lỗi. Vui lòng thử lại.',
        visibilityTime: 3000,
      });
    }
  };

  const handleLogin = () => {
    navigation.navigate(NavigationName.Login);
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
              <TextCM style={styles.title}>Tạo tài khoản</TextCM>

              {/* Email input */}
              <View style={styles.inputContainer}>
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
                {emailError ? (
                  <View style={styles.errorContainer}>
                    <TextCM style={styles.errorText}>{emailError}</TextCM>
                  </View>
                ) : null}
              </View>

              {/* Info text */}
              <TextCM style={styles.infoText}>
                Sau khi đăng ký, bạn sẽ được yêu cầu tạo mật khẩu
              </TextCM>

              {/* Phone input */}
              <View style={styles.inputContainer}>
                <TextInput
                  style={[
                    styles.input,
                    phoneError ? styles.inputError : null
                  ]}
                  placeholder="Nhập số điện thoại"
                  placeholderTextColor="#9CA3AF"
                  value={phone}
                  onChangeText={validatePhone}
                  keyboardType="phone-pad"
                  autoCapitalize="none"
                  autoCorrect={false}
                />
                {phoneError ? (
                  <View style={styles.errorContainer}>
                    <TextCM style={styles.errorText}>{phoneError}</TextCM>
                  </View>
                ) : null}
              </View>

              {/* Terms and conditions checkbox */}
              <View style={styles.termsContainer}>
                <CheckboxCM
                  checked={agreedToTerms}
                  onChange={() => setAgreedToTerms(!agreedToTerms)}
                  label=""
                />
                <View style={styles.termsTextContainer}>
                  <TextCM style={styles.termsText}>Tôi đã đọc và đồng ý với </TextCM>
                  <TouchableOpacity>
                    <TextCM style={styles.termsLink}>điều khoản dịch vụ</TextCM>
                  </TouchableOpacity>
                  <TextCM style={styles.termsText}> và </TextCM>
                  <TouchableOpacity>
                    <TextCM style={styles.termsLink}>chính sách bảo mật</TextCM>
                  </TouchableOpacity>
                  <TextCM style={styles.termsText}> của Kyta Platform</TextCM>
                </View>
              </View>

              {/* Sign up button */}
              <TouchableOpacity
                style={[styles.signupButton, isLoading && styles.signupButtonDisabled]}
                onPress={handleSignUp}
                activeOpacity={0.8}
                disabled={isLoading}
              >
                <TextCM style={styles.signupButtonText}>
                  {isLoading ? 'Đang xử lý...' : 'Tạo tài khoản'}
                </TextCM>
              </TouchableOpacity>

              {/* Login link */}
              <View style={styles.loginContainer}>
                <TextCM style={styles.loginText}>Đã có tài khoản? </TextCM>
                <TouchableOpacity onPress={handleLogin}>
                  <TextCM style={styles.loginLink}>Đăng nhập</TextCM>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
};

export default SignUpScreen;

