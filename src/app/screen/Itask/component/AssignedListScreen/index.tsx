import React, { useState, useEffect } from 'react';
import { View, ScrollView, Pressable, Image } from 'react-native';
import { Icon, Spinner } from '@ui-kitten/components';
import HeaderCM from '../../../../components/Header/HeaderCM';
import TextCM from '../../../../components/Text';
import ButtonCM from '../../../../components/Button';
import ModalFullScreen from '../../../../components/ModalFullScreen';
import { getApiUrl } from '../../../../../config/api.config';
import Toast from 'react-native-toast-message';
import { Color } from '../../../../../constants';
import SelectUserScreen, { SelectableUser } from '../SelectUserScreen';

interface AssignedUser {
  id?: number;
  task_id: number;
  user_id: number;
  role: 'assigner' | 'assignee';
  createdAt?: string;
  updatedAt?: string;
  name: string;
  email: string;
  avatar: string | null;
}

interface AssignedListScreenProps {
  taskId: number;
  onClose: () => void;
}

const AssignedListScreen = ({ taskId, onClose }: AssignedListScreenProps) => {
  const [assignedUsers, setAssignedUsers] = useState<AssignedUser[]>([]);
  const [pendingAssignedUsers, setPendingAssignedUsers] = useState<AssignedUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [isShowSelectUser, setIsShowSelectUser] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const fetchAssignedUsers = async () => {
    setLoading(true);
    try {
      const API_URL = getApiUrl();
      const response = await fetch(`${API_URL}/api/task/${taskId}/assign`);
      const result = await response.json();

      if (response.ok && result.success) {
        const list: AssignedUser[] = result.assignedUsers || [];
        setAssignedUsers(list);
        setPendingAssignedUsers(list);
      } else {
        Toast.show({
          type: 'error',
          text1: 'Lỗi',
          text2: result.error || 'Lỗi lấy danh sách đã giao',
        });
      }
    } catch (error: any) {
      console.error('Error fetching assigned users:', error);
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
    fetchAssignedUsers();
  }, [taskId]);

  const handleRemovePendingUser = (userId: number) => {
    setPendingAssignedUsers(prev => prev.filter(user => user.user_id !== userId));
  };

  const handleSaveAssign = async () => {
    setIsSaving(true);
    try {
      const API_URL = getApiUrl();
      const assigneeIds = pendingAssignedUsers.map(user => user.user_id);
      const response = await fetch(`${API_URL}/api/task/${taskId}/assign`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          assignee_ids: assigneeIds,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        Toast.show({
          type: 'success',
          text1: 'Thành công',
          text2: 'Cập nhật danh sách đã giao thành công',
        });
        onClose();
      } else {
        Toast.show({
          type: 'error',
          text1: 'Lỗi',
          text2: result.error || 'Cập nhật danh sách đã giao thất bại',
        });
      }
    } catch (error: any) {
      console.error('Error saving assigned users:', error);
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: error.message || 'Có lỗi xảy ra. Vui lòng thử lại.',
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUserSelected = (selectedUsers: SelectableUser[]) => {
    const mapped: AssignedUser[] = selectedUsers.map(user => {
      const existing = assignedUsers.find(item => item.user_id === user.id);
      return {
        id: existing?.id,
        task_id: taskId,
        user_id: user.id,
        role: 'assignee',
        createdAt: existing?.createdAt,
        updatedAt: existing?.updatedAt,
        name: user.name,
        email: user.email,
        avatar: user.avatar ?? null,
      };
    });
    setPendingAssignedUsers(mapped);
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
        title="Danh sách đã giao"
        fillIconBackLeft={Color.Black}
        onPressIconLeft={onClose}
        renderContentRight={() => (
          <Pressable onPress={() => setIsShowSelectUser(true)}>
            <TextCM
              style={{
                color: '#cb1d66',
                textAlign: 'right',
                fontSize: 14,
                fontWeight: '600',
              }}>
              Thêm +
            </TextCM>
          </Pressable>
        )}
      />

      <View style={{ flex: 1 }}>
        <ScrollView
          style={{ flex: 1, margin: 10 }}
          contentContainerStyle={{ rowGap: 16 }}>
          {loading ? (
            <View style={{ padding: 20, alignItems: 'center' }}>
              <Spinner size="small" />
            </View>
          ) : pendingAssignedUsers.length === 0 ? (
            <View style={{ padding: 20, alignItems: 'center' }}>
              <TextCM style={{ color: '#999', fontSize: 14 }}>
                Chưa có người được giao
              </TextCM>
            </View>
          ) : (
            pendingAssignedUsers.map((user) => (
              <View
                key={user.user_id}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 12,
                  backgroundColor: Color.White,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: '#e0e0e0',
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
                <Pressable
                  onPress={() => handleRemovePendingUser(user.user_id)}
                  style={{ padding: 8 }}>
                  <Icon
                    name="trash-2-outline"
                    style={{ width: 20, height: 20, tintColor: '#999' }}
                  />
                </Pressable>
              </View>
            ))
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
            label="Quay lại"
          />
          <ButtonCM
            loading={isSaving}
            disabled={isSaving}
            style={{ flex: 1, backgroundColor: Color.BgPrimary }}
            onPress={handleSaveAssign}
            label="Xác nhận"
          />
        </View>
      </View>

      <ModalFullScreen
        isVisible={isShowSelectUser}
        children={
          isShowSelectUser ? (
            <SelectUserScreen
              initialSelectedUsers={pendingAssignedUsers.map(user => ({
                id: user.user_id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
              }))}
              onClose={() => setIsShowSelectUser(false)}
              onConfirm={handleUserSelected}
            />
          ) : null
        }
      />
    </View>
  );
};

export default AssignedListScreen;

