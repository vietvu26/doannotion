import React, { useState } from 'react';
import {
  View,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Icon } from '@ui-kitten/components';
import TextCM from '../../components/Text';
import HeaderCM from '../../components/Header/HeaderCM';
import ModalConfirmCM from '../../components/ModalConfirm';
import { NavigationName } from '../../../constants';
import { useAppDispatch } from '../../../hooks/useRedux';
import { commonActions } from '../../../redux/slices';
import styles from './styles';

const SettingsScreen = () => {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = async () => {
    // Clear Redux state
    dispatch(commonActions.setIsAuthorized(false));
    dispatch(commonActions.setAccessToken(''));
    dispatch(commonActions.setCurrentUserId(null));
    dispatch(commonActions.setUserEmail(null));
    dispatch(commonActions.setUserPhone(null));
    dispatch(commonActions.setUserAvatar(null));
    dispatch(commonActions.setUserName(null));
    
    // Note: Không xóa remembered email khi logout
    // User có thể muốn giữ email để đăng nhập lại nhanh hơn
    // Nếu muốn xóa, uncomment dòng dưới:
    // await Cache.clearRememberedEmail();
    
    // Navigate to Login
    navigation.reset({
      index: 0,
      routes: [{ name: NavigationName.Login }],
    });
    
    setShowLogoutModal(false);
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
  };

  const settingsItems = [
    {
      id: 'account',
      title: 'Thông tin tài khoản',
      icon: 'person-outline',
      onPress: () => {
        navigation.navigate(NavigationName.AccountInfo);
      },
    },
    {
      id: 'logout',
      title: 'Đăng xuất',
      icon: 'log-out-outline',
      onPress: handleLogout,
    },
  ];

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <HeaderCM
        title="Cài đặt chung"
        showIconBackLeft={true}
        useLinearGradient={true}
      />
      <View style={styles.content}>
        {settingsItems.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={styles.settingItem}
            onPress={item.onPress}
            activeOpacity={0.7}
          >
            <View style={styles.settingItemLeft}>
              <View style={styles.iconContainer}>
                <Icon
                  name={item.icon}
                  fill="#ca1e66"
                  style={styles.icon}
                />
              </View>
              <TextCM style={styles.settingItemText}>{item.title}</TextCM>
            </View>
            <Icon
              name="chevron-right-outline"
              fill="#000"
              style={styles.chevronIcon}
            />
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout Confirmation Modal */}
      <ModalConfirmCM
        isVisible={showLogoutModal}
        title="Đăng xuất"
        content="Bạn có chắc chắn muốn đăng xuất?"
        labelConfirm="Đăng xuất"
        labelCancel="Hủy"
        onConfirm={handleConfirmLogout}
        onClose={handleCancelLogout}
        type="info"
      />
    </SafeAreaView>
  );
};

export default SettingsScreen;

