import React, { useState } from 'react';
import { View, ScrollView, Pressable, Image } from 'react-native';
import { Divider, Icon } from '@ui-kitten/components';
import HeaderCM from '../../../../components/Header/HeaderCM';
import InputCM from '../../../../components/TextField/InputCM';
import TextCM from '../../../../components/Text';
import ButtonCM from '../../../../components/Button';
import DropdownListCM from '../../../../components/DropDownList';
import DatePickerModal from '../../../../components/ModalPickCalender';
import ModalFullScreen from '../../../../components/ModalFullScreen';
import SelectUserScreen, { SelectableUser } from '../SelectUserScreen';
import { isEmpty } from 'lodash';
import { IndexPath } from '@ui-kitten/components';
import { DateUtils } from '../../../../../utils';
import { useAppSelector } from '../../../../../hooks/useRedux';
import { getApiUrl } from '../../../../../config/api.config';
import Toast from 'react-native-toast-message';
import { Color } from '../../../../../constants';
import styles from './styles';

interface AddTaskScreenProps {
  onClose: () => void;
  initialStatus?: 'new' | 'processing' | 'completed';
  workspaceId?: number;
}

const AddTaskScreen = ({ onClose, initialStatus = 'new', workspaceId }: AddTaskScreenProps) => {
  const currentUserId = useAppSelector((state) => state.common.currentUserId);
  const [taskName, setTaskName] = useState('');
  const [errorName, setErrorName] = useState('');
  const [selectedUsers, setSelectedUsers] = useState<SelectableUser[]>([]);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [priorityIndex, setPriorityIndex] = useState<IndexPath | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isShowSelectUser, setIsShowSelectUser] = useState(false);

  const PRIORITIES = [
    { label: 'Khẩn cấp', value: '1' },
    { label: 'Cao', value: '2' },
    { label: 'Trung bình', value: '3' },
    { label: 'Thấp', value: '4' },
  ];

  const handleChangeName = (value: string) => {
    setTaskName(value);
    if (!value.trim()) {
      setErrorName('Không được để trống');
    } else {
      setErrorName('');
    }
  };

  const handleSubmit = async () => {
    if (!taskName.trim()) {
      setErrorName('Không được để trống');
      return;
    }

    if (!currentUserId) {
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: 'Vui lòng đăng nhập để tiếp tục',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Convert date string (YYYY-MM-DD) to MySQL DATETIME format (YYYY-MM-DD HH:MM:SS)
      const convertToDateTime = (dateStr: string | null) => {
        if (!dateStr) return null;
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return null;
        
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = '00';
        const minutes = '00';
        const seconds = '00';
        
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      };

      const priority = priorityIndex !== undefined 
        ? PRIORITIES[priorityIndex.row]?.value || null 
        : null;

      const taskData = {
        name: taskName.trim(),
        description: null,
        status: initialStatus,
        priority: priority,
        start_date: convertToDateTime(startDate),
        due_date: null,
        completed_date: null,
        created_by: currentUserId,
        workspace_id: workspaceId || null,
      };

      const API_URL = getApiUrl();
      const response = await fetch(`${API_URL}/api/task`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
      });

      const result = await response.json();

      if (response.ok && (result.success || result.id)) {
        const taskId = result.id || result.task?.id;
        
        // Nếu có người được giao, lưu vào assign_task
        if (taskId && selectedUsers.length > 0) {
          const assigneeIds = selectedUsers.map(user => user.id);
          try {
            const assignResponse = await fetch(`${API_URL}/api/task/${taskId}/assign`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                assignee_ids: assigneeIds,
              }),
            });
            
            if (!assignResponse.ok) {
              console.error('Error assigning users to task');
            }
          } catch (assignError) {
            console.error('Error assigning users:', assignError);
          }
        }

        Toast.show({
          type: 'success',
          text1: 'Thành công',
          text2: 'Tạo công việc thành công',
        });
        onClose();
      } else {
        Toast.show({
          type: 'error',
          text1: 'Lỗi',
          text2: result.error || result.message || 'Tạo công việc thất bại',
        });
      }
    } catch (error: any) {
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: error.message || 'Có lỗi xảy ra. Vui lòng thử lại.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const getAvatarSource = (avatar: string | null) => {
    if (avatar) {
      return { uri: avatar };
    }
    return { uri: 'https://via.placeholder.com/32' };
  };

  return (
    <View style={{ flex: 1 }}>
      <HeaderCM
        style={{
          backgroundColor: '#fff',
        }}
        contentStyle={{
          backgroundColor: '#fff',
        }}
        titleStyle={{
          color: '#000810',
        }}
        fillIconBackLeft="#000810"
        onPressIconLeft={onClose}
        title="Thêm công việc"
        alignment="start"
      />
      <Divider />

      <View style={{ flex: 1 }}>
        <ScrollView
          contentContainerStyle={{ rowGap: 10, paddingBottom: 16 }}
          style={{ flex: 1, padding: 16 }}
          keyboardShouldPersistTaps="handled">
          <InputCM
            isRequired
            label="Tên công việc"
            placeholder="Nhập tên công việc"
            value={taskName}
            onChangeText={handleChangeName}
            captionText={errorName}
          />

          <View style={{ rowGap: 10 }}>
            <TextCM>Người thực hiện</TextCM>
            {selectedUsers.length === 0 ? (
              <Pressable
                onPress={() => setIsShowSelectUser(true)}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 20,
                  backgroundColor: '#F3F4F6',
                  alignItems: 'center',
                  justifyContent: 'center',
                  borderWidth: 1,
                  borderColor: '#E5E7EB',
                }}>
                <Icon name="person-add-outline" width={20} height={20} fill="#475467" />
              </Pressable>
            ) : (
              <Pressable
                onPress={() => setIsShowSelectUser(true)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                }}>
                {selectedUsers.slice(0, 3).map((user, index) => (
                  <Image
                    key={user.id}
                    source={getAvatarSource(user.avatar)}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      marginLeft: index > 0 ? -8 : 0,
                      borderWidth: 2,
                      borderColor: '#fff',
                    }}
                  />
                ))}
                {selectedUsers.length > 3 && (
                  <View
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      backgroundColor: '#F3F4F6',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginLeft: -8,
                      borderWidth: 2,
                      borderColor: '#fff',
                    }}>
                    <TextCM style={{ fontSize: 12, color: '#475467' }}>
                      +{selectedUsers.length - 3}
                    </TextCM>
                  </View>
                )}
              </Pressable>
            )}
          </View>

          <View style={{ rowGap: 10 }}>
            <TextCM>Ngày thực hiện</TextCM>
            <Pressable
              style={styles.dateInput}
              onPress={() => setShowStartDatePicker(true)}>
              <TextCM style={styles.dateText}>
                {startDate ? DateUtils.convertDateToDDMMYYYY(startDate) : 'Chọn ngày thực hiện'}
              </TextCM>
            </Pressable>
          </View>

          <DropdownListCM
            label="Độ ưu tiên"
            placeholder="Chọn độ ưu tiên"
            size="medium"
            valueSelect={priorityIndex}
            onSelect={setPriorityIndex}
            listData={PRIORITIES}
            isi18n={false}
          />
        </ScrollView>
      </View>

      <View style={styles.footer}>
        <ButtonCM
          style={[styles.button, styles.buttonCancel]}
          onPress={onClose}
          label="Quay lại"
        />
        <ButtonCM
          disabled={!isEmpty(errorName) || !taskName.trim() || isSubmitting}
          loading={isSubmitting}
          style={[styles.button, styles.buttonSave]}
          onPress={handleSubmit}
          label={isSubmitting ? 'Đang lưu...' : 'Lưu'}
        />
      </View>

      <DatePickerModal
        visible={showStartDatePicker}
        onClose={() => setShowStartDatePicker(false)}
        onSelect={(date) => {
          setStartDate(date);
          setShowStartDatePicker(false);
        }}
      />

      <ModalFullScreen
        isVisible={isShowSelectUser}
        children={
          <SelectUserScreen
            initialSelectedUsers={selectedUsers}
            onClose={() => setIsShowSelectUser(false)}
            onConfirm={(users) => {
              setSelectedUsers(users);
              setIsShowSelectUser(false);
            }}
          />
        }
      />
    </View>
  );
};

export default AddTaskScreen;

