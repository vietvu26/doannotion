import React, { useEffect, useState } from 'react';
import {
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Icon, Menu, MenuItem } from '@ui-kitten/components';
import Toast from 'react-native-toast-message';
import TextCM from '../../components/Text';
import HeaderCM from '../../components/Header/HeaderCM';
import BottomSheetCM from '../../components/BottomSheet';
import { ChoosePhoto } from '../../components/ImageCropPicker';
import { useAppSelector, useAppDispatch } from '../../../hooks/useRedux';
import { commonActions } from '../../../redux/slices';
import { getApiUrl } from '../../../config/api.config';
import axios from 'axios';
import styles from './styles';

const AccountInfoScreen = () => {
  const navigation = useNavigation<any>();
  const dispatch = useAppDispatch();
  const currentUserId = useAppSelector((state) => state.common.currentUserId);
  const reduxEmail = useAppSelector((state) => state.common.userEmail);
  const reduxPhone = useAppSelector((state) => state.common.userPhone);
  const reduxAvatar = useAppSelector((state) => state.common.userAvatar);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const defaultAvatar = 'https://media.istockphoto.com/id/2171382633/vector/user-profile-icon-anonymous-person-symbol-blank-avatar-graphic-vector-illustration.jpg?s=612x612&w=0&k=20&c=ZwOF6NfOR0zhYC44xOX06ryIPAUhDvAajrPsaZ6v1-w=';
  const [avatarUri, setAvatarUri] = useState<string>(defaultAvatar);

  useEffect(() => {
    fetchUserInfo();
  }, [currentUserId]);

  const fetchUserInfo = async () => {
    if (!currentUserId) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `${getApiUrl()}/api/user/${currentUserId}`
      );
      if (response.data && response.data.success) {
        setUserInfo(response.data.user);
        // Cập nhật avatar từ database
        if (response.data.user.avatar) {
          // Nếu avatar là base64, thêm prefix data:image
          const avatar = response.data.user.avatar;
          if (avatar.startsWith('data:image')) {
            setAvatarUri(avatar);
            dispatch(commonActions.setUserAvatar(avatar));
          } else {
            // Nếu là URL hoặc base64 không có prefix
            setAvatarUri(avatar);
            dispatch(commonActions.setUserAvatar(avatar));
          }
        } else {
          setAvatarUri(defaultAvatar);
          dispatch(commonActions.setUserAvatar(null));
        }
      }
    } catch (error: any) {
      console.error('Error fetching user info:', error);
      if (reduxEmail || reduxPhone) {
        setUserInfo({
          email: reduxEmail,
          phone: reduxPhone,
        });
      }
    } finally {
      setLoading(false);
    }
  };

  // Ưu tiên thông tin từ database, nếu không có thì dùng Redux
  const userEmail = userInfo?.email || reduxEmail || null;
  const userPhone = userInfo?.phone || reduxPhone || null;

  const handleRemoveAvatar = async () => {
    if (!currentUserId) {
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Chưa đăng nhập. Vui lòng đăng nhập.',
        visibilityTime: 3000,
      });
      return;
    }

    try {
      setUploadingAvatar(true);
      const response = await axios.delete(
        `${getApiUrl()}/api/user/${currentUserId}/avatar`
      );
      
      if (response.data && response.data.success) {
        setAvatarUri(defaultAvatar);
        // Cập nhật userInfo
        setUserInfo((prev: any) => ({
          ...prev,
          avatar: null,
        }));
        // Xóa avatar khỏi Redux
        dispatch(commonActions.setUserAvatar(null));
        Toast.show({
          type: 'success',
          text1: 'Thành công',
          text2: 'Đã gỡ ảnh đại diện',
          visibilityTime: 2000,
        });
        setShowAvatarModal(false);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Lỗi',
          text2: 'Không thể gỡ ảnh đại diện. Vui lòng thử lại.',
          visibilityTime: 3000,
        });
      }
    } catch (error: any) {
      console.error('Error removing avatar:', error);
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Không thể gỡ ảnh đại diện. Vui lòng thử lại.',
        visibilityTime: 3000,
      });
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleChangeAvatar = async () => {
    if (!currentUserId) {
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Chưa đăng nhập. Vui lòng đăng nhập.',
        visibilityTime: 3000,
      });
      return;
    }

    try {
      setShowAvatarModal(false);
      setUploadingAvatar(true);
      
      // Mở thư viện ảnh với crop hình tròn và lấy base64
      // Giảm kích thước ảnh để giảm dung lượng (300x300 là đủ cho avatar)
      const image: any = await ChoosePhoto({
        width: 300,
        height: 300,
        cropping: true,
        cropperCircleOverlayEnabled: true,
        includeBase64Enabled: true, // Bật base64 để upload lên server
        compressImageQuality: 0.7, // Nén ảnh với quality 70% để giảm dung lượng
      });
      
      if (image && image.path) {
        // Tạo base64 string với data URI
        let avatarData = '';
        if (image.data) {
          // Nếu đã có base64 data từ image picker
          const mime = image.mime || 'image/jpeg';
          avatarData = `data:${mime};base64,${image.data}`;
        } else {
          // Fallback: dùng path (local file)
          avatarData = image.path;
        }

        // Cập nhật avatar trước (optimistic update)
        setAvatarUri(avatarData);

        // Upload lên server
        try {
          const response = await axios.put(
            `${getApiUrl()}/api/user/${currentUserId}/avatar`,
            { avatar: avatarData }
          );

          if (response.data && response.data.success) {
            // Cập nhật userInfo với avatar mới
            setUserInfo((prev: any) => ({
              ...prev,
              avatar: avatarData,
            }));
            // Lưu avatar vào Redux
            dispatch(commonActions.setUserAvatar(avatarData));
            Toast.show({
              type: 'success',
              text1: 'Thành công',
              text2: 'Đã thay đổi ảnh đại diện',
              visibilityTime: 2000,
            });
          } else {
            // Rollback nếu upload thất bại
            setAvatarUri(userInfo?.avatar || defaultAvatar);
            Toast.show({
              type: 'error',
              text1: 'Lỗi',
              text2: 'Không thể lưu ảnh đại diện. Vui lòng thử lại.',
              visibilityTime: 3000,
            });
          }
        } catch (uploadError: any) {
          console.error('Error uploading avatar:', uploadError);
          // Rollback nếu upload thất bại
          setAvatarUri(userInfo?.avatar || defaultAvatar);
          Toast.show({
            type: 'error',
            text1: 'Lỗi',
            text2: 'Không thể lưu ảnh đại diện. Vui lòng thử lại.',
            visibilityTime: 3000,
          });
        }
      }
    } catch (error: any) {
      // Người dùng hủy chọn ảnh
      if (error.code !== 'E_PICKER_CANCELLED') {
        console.error('Error selecting image:', error);
        Toast.show({
          type: 'error',
          text1: 'Lỗi',
          text2: 'Không thể chọn ảnh. Vui lòng thử lại.',
          visibilityTime: 3000,
        });
      }
    } finally {
      setUploadingAvatar(false);
    }
  };

  const renderAvatarMenu = () => {
    return (
      <View style={styles.menuContainer}>
        {/* Hiển thị avatar hiện tại */}
        <View style={styles.avatarPreviewContainer}>
          <Image
            source={{ uri: avatarUri }}
            style={styles.avatarPreview}
          />
        </View>
        
        {/* 2 nút action */}
        <View style={styles.buttonRow}>
          <TouchableOpacity 
            style={[styles.removeButton, uploadingAvatar && { opacity: 0.5 }]}
            onPress={handleRemoveAvatar}
            activeOpacity={0.7}
            disabled={uploadingAvatar}
          >
            {uploadingAvatar ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <TextCM style={styles.removeButtonText}>Gỡ ảnh</TextCM>
            )}
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.changeButton, uploadingAvatar && { opacity: 0.5 }]}
            onPress={handleChangeAvatar}
            activeOpacity={0.7}
            disabled={uploadingAvatar}
          >
            {uploadingAvatar ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <TextCM style={styles.changeButtonText}>Thay ảnh</TextCM>
            )}
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView edges={['bottom']} style={styles.container}>
      <HeaderCM
        title="Thông tin tài khoản"
        showIconBackLeft={true}
        useLinearGradient={true}
      />
      <ScrollView style={styles.content}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#ca1e66" />
            <TextCM style={styles.loadingText}>Đang tải thông tin...</TextCM>
          </View>
        ) : (
          <>
            {/* Profile Summary Section */}
            <View style={styles.profileSection}>
          <View style={styles.profileLeft}>
            <TouchableOpacity 
              style={styles.avatarContainer}
              onPress={() => setShowAvatarModal(true)}
            >
              <Image
                source={{ uri: avatarUri }}
                style={styles.avatar}
              />
              <View style={styles.editBadge}>
                <Icon name="edit-outline" fill="#ca1e66" style={styles.editIcon} />
              </View>
            </TouchableOpacity>
            <View style={styles.profileTextContainer}>
              <TextCM style={styles.profileEmailSecondary}>{userEmail || 'Chưa có email'}</TextCM>
            </View>
          </View>
          <TouchableOpacity style={styles.profileButton}>
            <TextCM style={styles.profileButtonText}>Hồ sơ cá nhân</TextCM>
          </TouchableOpacity>
        </View>

        {/* Basic Information Section */}
        <View style={styles.basicInfoSection}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionIconContainer}>
              <Icon name="person-outline" fill="#ca1e66" style={styles.sectionIcon} />
            </View>
            <TextCM style={styles.sectionTitle}>Thông tin cơ bản</TextCM>
          </View>

          <View style={styles.infoRow}>
            <TextCM style={styles.infoLabel}>Email:</TextCM>
            <TextCM style={styles.infoValue}>{userEmail || 'Chưa có thông tin'}</TextCM>
          </View>

          <View style={styles.infoRow}>
            <TextCM style={styles.infoLabel}>Số điện thoại:</TextCM>
            <View style={styles.phoneRow}>
              <TextCM style={styles.infoValue}>{userPhone || 'Chưa có thông tin'}</TextCM>
              <TouchableOpacity style={styles.editButton}>
                <Icon name="edit-2-outline" fill="#999" style={styles.editSmallIcon} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
          </>
        )}
      </ScrollView>
      
      {/* Avatar Change Modal */}
      <BottomSheetCM
        title="Thay đổi ảnh đại diện"
        isVisible={showAvatarModal}
        onClose={() => setShowAvatarModal(false)}
        renderContent={renderAvatarMenu()}
      />
    </SafeAreaView>
  );
};

export default AccountInfoScreen;

