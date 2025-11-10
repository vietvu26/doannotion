import React, { useState } from 'react';
import {
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { Icon } from '@ui-kitten/components';
import TextCM from '../../../components/Text';
import ButtonCM from '../../../components/Button';
import Color from '../../../../constants/Color';
import { SizeDP } from '../../../../constants/Size';
import { useAppSelector } from '../../../../hooks/useRedux';
import ModalFullScreen from '../../../components/ModalFullScreen';
import InviteUsersModal from './InviteUsersModal';
import { inviteUsers } from '../../../../services/auth.services';
import { Alert } from 'react-native';
import Toast from 'react-native-toast-message';

type ShareSettingsProps = {
  onClose: () => void;
  notionId: number | null;
  notionTitle: string;
};

const ShareSettings: React.FC<ShareSettingsProps> = ({ onClose, notionId, notionTitle }) => {
  const [selectedTab, setSelectedTab] = useState<'share' | 'post'>('share');
  const [searchText, setSearchText] = useState('');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const userName = useAppSelector((state) => state.common.userName);
  const userEmail = useAppSelector((state) => state.common.userEmail);
  
  // Lấy tên hiển thị: userName nếu có, nếu không dùng phần trước @ của email, nếu không có email thì dùng "User"
  const displayName = userName || (userEmail ? userEmail.split('@')[0] : 'User');
  const fullDisplayName = `${displayName} (Bạn)`;
  
  // Lấy chữ cái đầu để hiển thị trong avatar
  const avatarInitial = displayName.charAt(0).toUpperCase();

  const handleInvite = async (emails: string[], permission: 'full' | 'comment' | 'view') => {
    if (!notionId) {
      Alert.alert('Lỗi', 'Không thể chia sẻ. Vui lòng lưu trang trước.');
      return;
    }

    try {
      const result = await inviteUsers({
        notionId,
        emails,
        permission,
        inviterName: userName || displayName,
        notionTitle,
      });

      if (result.success) {
        // Hiển thị toast message thay vì notifee notification
        const emailCount = emails.length;
        const fcmCount = result.fcmSent || 0;
        const toastMessage = `Đã gửi đến ${emailCount} người dùng${fcmCount > 0 ? ` (${fcmCount} thông báo push)` : ''}`;
        
        Toast.show({
          type: 'success',
          text1: 'Đã gửi lời mời thành công',
          text2: toastMessage,
          position: 'top',
          visibilityTime: 3000,
        });

        setShowInviteModal(false);
        // Đóng modal cài đặt chia sẻ
        onClose();
      } else {
        Alert.alert('Lỗi', result.message);
      }
    } catch (error) {
      console.error('Error inviting users:', error);
      Alert.alert('Lỗi', 'Không thể gửi lời mời. Vui lòng thử lại.');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Segmented Control */}
        

        {/* Search Input */}
        <TouchableOpacity
          style={styles.searchContainer}
          onPress={() => setShowInviteModal(true)}
          activeOpacity={0.7}
        >
          <Icon
            name="search-outline"
            width={20}
            height={20}
            fill={Color.Text055}
            style={styles.searchIcon}
          />
          <TextCM style={styles.searchPlaceholder}>
            Mời cá nhân, email, nhóm...
          </TextCM>
        </TouchableOpacity>

        {/* User List */}
        <View style={styles.userItem}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <TextCM style={styles.avatarText}>{avatarInitial}</TextCM>
            </View>
          </View>
          <View style={styles.userInfo}>
            <TextCM style={styles.userName}>{fullDisplayName}</TextCM>
            <TextCM style={styles.userAccess}>Truy cập đầy đủ</TextCM>
          </View>
          <TouchableOpacity>
            <Icon
              name="more-horizontal-outline"
              width={24}
              height={24}
              fill={Color.colorText}
            />
          </TouchableOpacity>
        </View>

        {/* General Access Section */}
        
      </ScrollView>

      {/* Share Link Button */}
      <View style={styles.buttonContainer}>
        <ButtonCM
          label="Chia sẻ liên kết"
          onPress={() => {
            // Handle share link
            console.log('Chia sẻ liên kết');
          }}
          style={styles.shareButton}
        />
      </View>

      {/* Invite Users Modal */}
      {showInviteModal && (
        <ModalFullScreen
          isVisible={showInviteModal}
          animationType="slide"
        >
          <InviteUsersModal
            isVisible={showInviteModal}
            onClose={() => setShowInviteModal(false)}
            onInvite={handleInvite}
          />
        </ModalFullScreen>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.White,
    paddingHorizontal: 16,
  },
  scrollView: {
    flex: 1,
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: Color.Background,
    borderRadius: 8,
    padding: 4,
    marginBottom: 16,
  },
  segment: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    position: 'relative',
  },
  segmentActive: {
    backgroundColor: Color.White,
    borderRadius: 6,
  },
  segmentText: {
    fontSize: 14,
    color: Color.Text055,
    fontWeight: '500',
  },
  segmentTextActive: {
    color: Color.add,
    fontWeight: '600',
  },
  segmentUnderline: {
    position: 'absolute',
    bottom: 0,
    left: '20%',
    right: '20%',
    height: 2,
    backgroundColor: Color.add,
    borderRadius: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Color.Background,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: Color.colorText,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 14,
    color: Color.Text055,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    marginBottom: 16,
  },
  avatarContainer: {
    marginRight: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Color.Background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '600',
    color: Color.colorText,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: Color.colorText,
    marginBottom: 4,
  },
  userAccess: {
    fontSize: 12,
    color: Color.Text055,
  },
  section: {
    marginTop: 8,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    color: Color.Text055,
    marginBottom: 12,
    fontWeight: '500',
  },
  accessItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 12,
    backgroundColor: Color.Background,
    borderRadius: 8,
  },
  accessIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: Color.White,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  accessText: {
    flex: 1,
    fontSize: 14,
    color: Color.colorText,
  },
  buttonContainer: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: Color.Background,
  },
  shareButton: {
    backgroundColor: Color.add,
  },
});

export default ShareSettings;

