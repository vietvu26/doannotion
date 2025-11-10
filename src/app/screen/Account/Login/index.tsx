import React, { useState, useEffect } from 'react';
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
import { IcEyes, IcOpenEyes } from '../../../../assets/images';
import CheckboxCM from '../../../components/Checkbox';
import { loginWithEmail } from '../../../../services/auth.services';
import { useAppDispatch } from '../../../../hooks/useRedux';
import { commonActions } from '../../../../redux/slices';
import Cache from '../../../../utils/Cache';
import styles from './styles';
import messaging from '@react-native-firebase/messaging';

const LoginScreen = () => {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const [step, setStep] = useState(1); // 1: Email, 2: Password
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load remembered email when component mounts
  useEffect(() => {
    const loadRememberedEmail = async () => {
      try {
        const rememberedEmail = await Cache.getRememberedEmail();
        if (rememberedEmail) {
          setEmail(rememberedEmail);
          setRememberMe(true);
        }
      } catch (error) {
        console.error('Error loading remembered email:', error);
      }
    };

    loadRememberedEmail();
  }, []);

  const validateEmail = (text: string) => {
    setEmail(text);
    
    // Clear error when user is typing
    if (emailError) {
      setEmailError('');
    }
  };

  const validatePassword = (text: string) => {
    setPassword(text);
    
    // Clear error when user is typing
    if (passwordError) {
      setPasswordError('');
    }
  };

  const handleContinue = () => {
    // Clear previous errors
    setEmailError('');

    // Check if email is empty
    if (!email.trim()) {
      setEmailError('Vui lòng nhập email');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Email không hợp lệ');
      return;
    }

    // Move to password step
    setStep(2);
  };

  const handleLogin = async () => {
    // Clear previous errors
    setPasswordError('');

    // Check if password is empty
    if (!password.trim()) {
      setPasswordError('Vui lòng nhập mật khẩu');
      return;
    }

    // Check password length
    if (password.length < 6) {
      setPasswordError('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    setIsLoading(true);

    try {
      console.log('=== Bắt đầu đăng nhập ===');
      console.log('Email:', email.trim());

      // Lấy FCM token nếu có
      let fcmToken: string | undefined;
      try {
        const hasPermission = await messaging().requestPermission();
        console.log('=== FCM Permission Status ===');
        console.log('Permission:', hasPermission);
        
        if (hasPermission === messaging.AuthorizationStatus.AUTHORIZED || 
            hasPermission === messaging.AuthorizationStatus.PROVISIONAL) {
          fcmToken = await messaging().getToken();
          console.log('=== FCM Token ===');
          console.log('FCM Token:', fcmToken);
          console.log('FCM Token Length:', fcmToken?.length);
        } else {
          console.log('=== Không có quyền gửi notification ===');
          console.log('Permission Status:', hasPermission);
        }
      } catch (fcmError) {
        console.error('=== Lỗi lấy FCM token ===');
        console.error('Error:', fcmError);
        // Không fail login nếu không lấy được FCM token
      }

      // Gọi API đăng nhập với FCM token
      console.log('=== Gửi request đăng nhập ===');
      console.log('Email:', email.trim());
      console.log('FCM Token sẽ gửi:', fcmToken ? 'Có' : 'Không có');
      const result = await loginWithEmail(email.trim(), password, fcmToken);

      setIsLoading(false);

      if (result.success && result.token && result.user) {
        console.log('=== Đăng nhập thành công ===');
        console.log('Token:', result.token);
        console.log('User:', result.user);

        // Lưu token và userId vào Redux
        // Email và phone sẽ được lấy từ database khi cần (ví dụ: trong AccountInfo screen)
        const userId = result.user.id ? Number(result.user.id) : null;
        dispatch(commonActions.setAccessToken(result.token));
        dispatch(commonActions.setCurrentUserId(userId));
        dispatch(commonActions.setIsAuthorized(true));
        // Lưu email, phone và name vào Redux để dùng ngay
        dispatch(commonActions.setUserEmail(result.user.email || null));
        dispatch(commonActions.setUserPhone(result.user.phone || null));
        dispatch(commonActions.setUserName(result.user.name || null));

        // Lưu email nếu user chọn "Nhớ tài khoản"
        if (rememberMe) {
          await Cache.setRememberedEmail(email.trim());
        } else {
          // Xóa email đã lưu nếu user không chọn "Nhớ tài khoản"
          await Cache.clearRememberedEmail();
        }

        Toast.show({
          type: 'success',
          text1: 'Đăng nhập thành công',
          text2: 'Chào mừng bạn trở lại!',
          visibilityTime: 2000,
        });

        // Navigate to Dashboard (Home screen)
        setTimeout(() => {
          navigation.replace(NavigationName.Dashboard);
        }, 500);
      } else {
        // Hiển thị lỗi
        const errorMessage = result.message || 'Đăng nhập thất bại. Vui lòng thử lại.';
        setPasswordError(errorMessage);
        
        Toast.show({
          type: 'error',
          text1: 'Đăng nhập thất bại',
          text2: errorMessage,
          visibilityTime: 3000,
        });
      }
    } catch (error: any) {
      console.error('=== Lỗi trong handleLogin ===');
      console.error('Error:', error);
      console.error('Error message:', error.message);

      setIsLoading(false);

      const errorMessage = error.message || 'Đã xảy ra lỗi. Vui lòng thử lại.';
      setPasswordError(errorMessage);

      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: errorMessage,
        visibilityTime: 3000,
      });
    }
  };

  const handleBack = () => {
    setStep(1);
    setPassword('');
    setPasswordError('');
  };

  const handleSignUp = () => {
    navigation.navigate(NavigationName.SignUp);
  };

  const handleForgotPassword = () => {
    navigation.navigate(NavigationName.ForgotPassword);
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
              <TextCM style={styles.title}>Đăng nhập</TextCM>

              {step === 1 ? (
                // Step 1: Email input
                <>
                  <View style={styles.inputContainer}>
                    <TextCM style={styles.inputLabel}>
                      Email <TextCM style={styles.required}>*</TextCM>
                    </TextCM>
                    <TextInput
                      style={[
                        styles.input,
                        emailError ? styles.inputError : null
                      ]}
                      placeholder=""
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

                  {/* Continue button */}
                  <TouchableOpacity
                    style={styles.loginButton}
                    onPress={handleContinue}
                    activeOpacity={0.8}
                  >
                    <TextCM style={styles.loginButtonText}>Đăng nhập</TextCM>
                  </TouchableOpacity>

                  {/* Sign up link */}
                  <View style={styles.signupContainer}>
                    <TextCM style={styles.signupText}>Chưa có tài khoản? </TextCM>
                    <TouchableOpacity onPress={handleSignUp}>
                      <TextCM style={styles.signupLink}>Đăng ký ngay</TextCM>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                // Step 2: Password input
                <>
                  <View style={styles.inputContainer}>
                    <TextCM style={styles.inputLabel}>
                      Mật khẩu <TextCM style={styles.required}>*</TextCM>
                    </TextCM>
                    <View style={styles.passwordInputContainer}>
                      <TextInput
                        style={[
                          styles.input,
                          styles.passwordInput,
                          passwordError ? styles.inputError : null
                        ]}
                        placeholder=""
                        value={password}
                        onChangeText={validatePassword}
                        secureTextEntry={!showPassword}
                        autoCapitalize="none"
                        autoCorrect={false}
                      />
                      <TouchableOpacity
                        style={styles.eyeIcon}
                        onPress={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <IcEyes width={20} height={20} />
                        ) : (
                          <IcOpenEyes width={20} height={20} />
                        )}
                      </TouchableOpacity>
                    </View>
                    {passwordError ? (
                      <View style={styles.errorContainer}>
                        <TextCM style={styles.errorText}>{passwordError}</TextCM>
                      </View>
                    ) : null}
                  </View>

                  {/* Remember me and Forgot password */}
                  <View style={styles.rememberContainer}>
                    <CheckboxCM
                      checked={rememberMe}
                      onChange={async () => {
                        const newRememberMe = !rememberMe;
                        setRememberMe(newRememberMe);
                        // Nếu bỏ chọn "Nhớ tài khoản", xóa email đã lưu
                        if (!newRememberMe) {
                          await Cache.clearRememberedEmail();
                        }
                      }}
                      label="Nhớ tài khoản"
                      labelStyle={[
                        styles.textCheck,
                        {
                          color: rememberMe
                            ? Color.TextPrimary
                            : Color.textDisableColor,
                        },
                      ]}
                    />
                    <TouchableOpacity onPress={handleForgotPassword}>
                      <TextCM style={styles.forgotPassword}>Quên mật khẩu?</TextCM>
                    </TouchableOpacity>
                  </View>

                  {/* Login button */}
                  <TouchableOpacity
                    style={[styles.loginButton, isLoading && { opacity: 0.6 }]}
                    onPress={handleLogin}
                    activeOpacity={0.8}
                    disabled={isLoading}
                  >
                    <TextCM style={styles.loginButtonText}>
                      {isLoading ? 'Đang đăng nhập...' : 'Đăng nhập'}
                    </TextCM>
                  </TouchableOpacity>

                  {/* Back link */}
                  <View style={styles.signupContainer}>
                    <TouchableOpacity onPress={handleBack}>
                      <TextCM style={styles.backLink}>Quay lại</TextCM>
                    </TouchableOpacity>
                  </View>
                </>
              )}
            </View>
          </ScrollView>
        </KeyboardAvoidingView>

        {/* Footer - Fixed at bottom */}
        <View style={styles.footer}>
          <View style={styles.logoContainer}>
            <TextCM>Powered by</TextCM>
            <Image
              source={require('../../../../assets/images/ic/logopka.png')}
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
        </View>
      </View>
    </View>
  );
};

export default LoginScreen;

