import React, { useState, useEffect } from 'react';
import { View, ScrollView, Pressable, Image, TextInput } from 'react-native';
import { Icon } from '@ui-kitten/components';
import HeaderCM from '../../../../components/Header/HeaderCM';
import TextCM from '../../../../components/Text';
import ButtonCM from '../../../../components/Button';
import { getApiUrl } from '../../../../../config/api.config';
import Toast from 'react-native-toast-message';
import { Color } from '../../../../../constants';
import { useAppSelector } from '../../../../../hooks/useRedux';

export interface SelectableUser {
  id: number;
  name: string;
  email: string;
  avatar: string | null;
}

interface SelectUserScreenProps {
  initialSelectedUsers: SelectableUser[];
  onClose: () => void;
  onConfirm: (selectedUsers: SelectableUser[]) => void;
}

const SelectUserScreen = ({
  initialSelectedUsers,
  onClose,
  onConfirm,
}: SelectUserScreenProps) => {
  const currentUserId = useAppSelector((state) => state.common.currentUserId);
  const [users, setUsers] = useState<SelectableUser[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<SelectableUser[]>(initialSelectedUsers);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');

  const fetchUsers = async (search: string = '') => {
    setLoading(true);
    try {
      const API_URL = getApiUrl();
      const queryParam = search ? `?search=${encodeURIComponent(search)}` : '';
      const response = await fetch(`${API_URL}/api/user${queryParam}`);
      const result = await response.json();

      if (response.ok && result.success) {
        const fetchedUsers: SelectableUser[] = (result.users || [])
          .filter((user: any) => user.id !== currentUserId)
          .map((user: any) => ({
            id: user.id,
            name: user.name,
            email: user.email,
            avatar: user.avatar ?? null,
          }));
        setUsers(fetchedUsers);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Lỗi',
          text2: result.error || 'Lỗi lấy danh sách user',
        });
      }
    } catch (error: any) {
      console.error('Error fetching users:', error);
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: error.message || 'Có lỗi xảy ra. Vui lòng thử lại.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setSelectedUsers(initialSelectedUsers);
  }, [initialSelectedUsers]);

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      fetchUsers(searchText);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchText]);

  const handleToggleUser = (user: SelectableUser) => {
    const isSelected = selectedUsers.some((u) => u.id === user.id);
    if (isSelected) {
      setSelectedUsers(selectedUsers.filter((u) => u.id !== user.id));
    } else {
      setSelectedUsers([...selectedUsers, user]);
    }
  };

  const handleConfirm = async () => {
    onConfirm(selectedUsers);
    onClose();
  };

  const getAvatarSource = (avatar: string | null) => {
    if (avatar) {
      return { uri: avatar };
    }
    // Return a default placeholder if no avatar
    return { uri: 'https://via.placeholder.com/40' };
  };

  return (
    <View style={{ flex: 1, backgroundColor: Color.White }}>
      <HeaderCM
        contentStyle={{ backgroundColor: Color.White }}
        titleStyle={{ color: Color.Black }}
        title="Chọn người thực hiện"
        fillIconBackLeft={Color.Black}
        onPressIconLeft={onClose}
      />

      <View style={{ padding: 16 }}>
        <TextInput
          style={{
            height: 40,
            borderWidth: 1,
            borderColor: '#e0e0e0',
            borderRadius: 8,
            paddingHorizontal: 12,
            marginBottom: 16,
          }}
          placeholder="Tìm kiếm theo tên hoặc email..."
          value={searchText}
          onChangeText={setSearchText}
        />
      </View>

      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingHorizontal: 16 }}>
        {loading ? (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <TextCM style={{ color: '#999' }}>Đang tải...</TextCM>
          </View>
        ) : users.length === 0 ? (
          <View style={{ padding: 20, alignItems: 'center' }}>
            <TextCM style={{ color: '#999' }}>Không tìm thấy user nào</TextCM>
          </View>
        ) : (
          users.map((user) => {
            const isSelected = selectedUsers.some((item) => item.id === user.id);
            return (
              <Pressable
                key={user.id}
                onPress={() => handleToggleUser(user)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 12,
                  marginBottom: 12,
                  backgroundColor: Color.White,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: isSelected ? Color.BgPrimary : '#e0e0e0',
                }}>
                <Image
                  source={getAvatarSource(user.avatar)}
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: 20,
                    marginRight: 12,
                  }}
                />
                <View style={{ flex: 1 }}>
                  <TextCM style={{ fontSize: 16, fontWeight: '500' }}>
                    {user.name}
                  </TextCM>
                  <TextCM style={{ fontSize: 14, color: '#666', marginTop: 4 }}>
                    {user.email}
                  </TextCM>
                </View>
                {isSelected && (
                  <Icon
                    name="checkmark-circle-2"
                    style={{ width: 24, height: 24, tintColor: Color.BgPrimary }}
                  />
                )}
              </Pressable>
            );
          })
        )}
      </ScrollView>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          columnGap: 8,
          paddingHorizontal: 16,
          paddingBottom: 16,
        }}>
        <ButtonCM
          style={{ flex: 1, backgroundColor: Color.BgPrimary }}
          onPress={onClose}
          label="Hủy"
        />
        <ButtonCM
          style={{ flex: 1, backgroundColor: Color.BgPrimary }}
          onPress={handleConfirm}
          label="Xác nhận"
        />
      </View>
    </View>
  );
};

export default SelectUserScreen;

