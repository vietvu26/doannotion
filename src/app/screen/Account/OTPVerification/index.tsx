import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import Toast from 'react-native-toast-message';
import { Color, NavigationName } from '../../../../constants';
import TextCM from '../../../components/Text';
import HeaderCM from '../../../components/Header/HeaderCM';
import { forgotPassword, verifySignupOTP, resendSignupOTP } from '../../../../services/auth.services';
import styles from './styles';

interface RouteParams {
  email?: string;
  phone?: string;
  isResetPassword?: boolean;
  isSignUp?: boolean;
}

const OTPVerificationScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute();
  const params = route.params as RouteParams;
  const email = params?.email || '';
  const phone = params?.phone || '';
  const isResetPassword = params?.isResetPassword || false;
  const isSignUp = params?.isSignUp || false;

  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const inputRefs = useRef<(TextInput | null)[]>([]);
  // Set timeLeft based on isResetPassword: 900s (15 min) for reset, 300s (5 min) for signup
  const [timeLeft, setTimeLeft] = useState(isResetPassword ? 900 : 300);
  const [isResendDisabled, setIsResendDisabled] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);

  // Update timeLeft when isResetPassword or isSignUp changes
  useEffect(() => {
    setTimeLeft(isResetPassword ? 900 : 300);
  }, [isResetPassword, isSignUp]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft <= 0) {
      setTimeLeft(0);
      setIsResendDisabled(false);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        const newTime = prev - 1;
        if (newTime <= 0) {
          setIsResendDisabled(false);
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOtpChange = (value: string, index: number) => {
    // Only allow numbers
    const numericValue = value.replace(/[^0-9]/g, '');

    if (numericValue.length > 1) {
      // Handle paste: split the value across multiple inputs
      const digits = numericValue.slice(0, 6).split('');
      const newOtp = [...otp];
      
      digits.forEach((digit, i) => {
        if (index + i < 6) {
          newOtp[index + i] = digit;
        }
      });
      
      setOtp(newOtp);
      
      // Focus on the next empty input or the last one
      const nextIndex = Math.min(index + digits.length, 5);
      inputRefs.current[nextIndex]?.focus();
    } else {
      // Single character input
      const newOtp = [...otp];
      newOtp[index] = numericValue;
      setOtp(newOtp);

      // Auto-focus next input if value entered
      if (numericValue && index < 5) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    // Handle backspace on empty input
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleResendOTP = async () => {
    if (isResendDisabled && timeLeft > 0) {
      return;
    }

    if (isResending) {
      return;
    }

    if (!email) {
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Không tìm thấy email. Vui lòng thử lại.',
        visibilityTime: 3000,
      });
      return;
    }

    setIsResending(true);

    try {
      let result;
      
      // Nếu là reset password, gọi forgotPassword
      // Nếu là signup, gọi resendSignupOTP
      if (isResetPassword) {
        result = await forgotPassword(email);
      } else if (isSignUp) {
        result = await resendSignupOTP(email);
      } else {
        // Trường hợp này không nên xảy ra trong flow hiện tại
        Toast.show({
          type: 'error',
          text1: 'Lỗi',
          text2: 'Không thể xác định loại yêu cầu. Vui lòng thử lại.',
          visibilityTime: 3000,
        });
        setIsResending(false);
        return;
      }

      if (result.success) {
        Toast.show({
          type: 'success',
          text1: 'Gửi lại OTP thành công',
          text2: result.message,
          visibilityTime: 3000,
        });

        // Reset timer: 15 minutes for reset password, 5 minutes for signup
        setTimeLeft(isResetPassword ? 900 : 300);
        setIsResendDisabled(true);
        
        // Clear OTP inputs
        setOtp(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      } else {
        Toast.show({
          type: 'error',
          text1: 'Gửi lại OTP thất bại',
          text2: result.message,
          visibilityTime: 3000,
        });
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: error.message || 'Gửi lại OTP thất bại. Vui lòng thử lại.',
        visibilityTime: 3000,
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleNext = async () => {
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Vui lòng nhập đầy đủ 6 số OTP',
        visibilityTime: 3000,
      });
      return;
    }

    if (isVerifying) {
      return;
    }

    if (!email) {
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Không tìm thấy email. Vui lòng thử lại.',
        visibilityTime: 3000,
      });
      return;
    }

    setIsVerifying(true);

    try {
      // Nếu là reset password, chuyển đến màn hình ResetPassword với email và OTP
      if (isResetPassword) {
        // Không cần verify OTP ở đây, chỉ cần chuyển đến màn hình reset password
        // OTP sẽ được verify ở màn hình ResetPassword khi submit
        navigation.navigate(NavigationName.ResetPassword, {
          email: email,
          otp: otpString,
        });
        setIsVerifying(false);
        return;
      }

      // Nếu là signup, verify signup OTP
      if (isSignUp) {
        const result = await verifySignupOTP(email, otpString);

        if (result.success) {
          Toast.show({
            type: 'success',
            text1: 'Xác thực thành công',
            text2: result.message || 'Xác thực email thành công. Vui lòng tạo mật khẩu.',
            visibilityTime: 2000,
          });

          // Chuyển đến màn hình CreatePassword sau khi xác thực OTP thành công
          setTimeout(() => {
            navigation.replace(NavigationName.CreatePassword, {
              email: result.email || email,
              phone: result.phone || phone,
            });
          }, 1500);
        } else {
          Toast.show({
            type: 'error',
            text1: 'Xác thực thất bại',
            text2: result.message,
            visibilityTime: 3000,
          });
          
          // Clear OTP inputs on error
          setOtp(['', '', '', '', '', '']);
          inputRefs.current[0]?.focus();
        }
        setIsVerifying(false);
        return;
      }

      // Trường hợp này không nên xảy ra trong flow hiện tại
      // OTPVerification chỉ được dùng cho signup hoặc reset password
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Không thể xác định loại yêu cầu. Vui lòng thử lại.',
        visibilityTime: 3000,
      });
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: error.message || 'Xác thực OTP thất bại. Vui lòng thử lại.',
        visibilityTime: 3000,
      });
      
      // Clear OTP inputs on error
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } finally {
      setIsVerifying(false);
    }
  };

  const handleBackToLogin = () => {
    navigation.navigate(NavigationName.Login);
  };

  return (
    <View style={styles.container}>
      <StatusBar translucent backgroundColor="transparent" barStyle="light-content" />
      
      {/* Header */}
      <HeaderCM
        title="Xác thực OTP"
        fillIconBackLeft="#FFFFFF"
        onPressIconLeft={() => navigation.goBack()}
        titleStyle={styles.headerTitle}
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
            {/* Instructions */}
            <TextCM style={styles.instructionText}>
              {isResetPassword 
                ? 'Nhập mã OTP đã được gửi đến email để đặt lại mật khẩu'
                : isSignUp
                ? 'Nhập mã OTP đã được gửi đến email để xác thực đăng ký'
                : 'Nhập mã xác nhận đã được gửi đến email'}
            </TextCM>

            {/* Email display */}
            {email ? (
              <TextCM style={styles.emailText}>{email}</TextCM>
            ) : null}

            {/* OTP Input Fields */}
            <View style={styles.otpContainer}>
              {otp.map((digit, index) => (
                <TextInput
                  key={index}
                  ref={(ref) => {
                    inputRefs.current[index] = ref;
                  }}
                  style={[
                    styles.otpInput,
                    digit ? styles.otpInputFilled : null,
                  ]}
                  value={digit}
                  onChangeText={(value) => handleOtpChange(value, index)}
                  onKeyPress={(e) => handleKeyPress(e, index)}
                  keyboardType="number-pad"
                  maxLength={1}
                  selectTextOnFocus
                  textAlign="center"
                  autoFocus={index === 0}
                />
              ))}
            </View>

            {/* Resend OTP and Timer */}
            <View style={styles.actionRow}>
              <TouchableOpacity
                onPress={handleResendOTP}
                disabled={(isResendDisabled && timeLeft > 0) || isResending}
              >
                <TextCM
                  style={[
                    styles.resendLink,
                    (isResendDisabled && timeLeft > 0) || isResending
                      ? styles.resendLinkDisabled
                      : null,
                  ]}
                >
                  {isResending ? 'Đang gửi...' : 'Không nhận được OTP?'}
                </TextCM>
              </TouchableOpacity>

              {timeLeft > 0 && (
                <TextCM style={styles.timerText}>
                  Mã OTP hết hạn sau {formatTime(timeLeft)}
                </TextCM>
              )}
            </View>

            {/* Back to login link */}
            <View style={styles.backToLoginContainer}>
              <TouchableOpacity onPress={handleBackToLogin}>
                <TextCM style={styles.backToLoginLink}>
                  Quay lại trang đăng nhập
                </TextCM>
              </TouchableOpacity>
            </View>

            {/* Next button */}
            <TouchableOpacity
              style={[
                styles.nextButton,
                otp.join('').length === 6 && !isVerifying && styles.nextButtonActive,
              ]}
              onPress={handleNext}
              activeOpacity={0.8}
              disabled={otp.join('').length !== 6 || isVerifying}
            >
              <TextCM style={styles.nextButtonText}>
                {isVerifying ? 'Đang xác thực...' : 'Tiếp theo'}
              </TextCM>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

export default OTPVerificationScreen;

