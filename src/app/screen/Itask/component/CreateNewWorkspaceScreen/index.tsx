import React, { useState } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { Divider } from '@ui-kitten/components';
import HeaderCM from '../../../../components/Header/HeaderCM';
import InputCM from '../../../../components/TextField/InputCM';
import TextFieldCM from '../../../../components/TextField';
import TextCM from '../../../../components/Text';
import ButtonCM from '../../../../components/Button';
import { isEmpty } from 'lodash';
import DatePickerModal from '../../../../components/ModalPickCalender';
import { DateUtils } from '../../../../../utils';
import { useAppSelector } from '../../../../../hooks/useRedux';
import { getApiUrl } from '../../../../../config/api.config';
import Toast from 'react-native-toast-message';
import styles from './styles'

interface CreateNewWorkspaceScreenProps {
  onClose: () => void;
}

const CreateNewWorkspaceScreen = ({ onClose }: CreateNewWorkspaceScreenProps) => {
  const currentUserId = useAppSelector((state) => state.common.currentUserId);
  const [dataForm, setDataForm] = useState({
    name: '',
    description: '',
  });
  const [errors, setErrors] = useState<{ name?: string; description?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [startDate, setStartDate] = useState<string | null>(null);
  const [dueDate, setDueDate] = useState<string | null>(null);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showDueDatePicker, setShowDueDatePicker] = useState(false);

  const handleChangeValue = (key: 'name' | 'description', value: string) => {
    setDataForm(prev => ({
      ...prev,
      [key]: value,
    }));

    if (key === 'name' && !value?.trim()) {
      setErrors(prev => ({
        ...prev,
        name: 'Không được để trống',
      }));
    } else {
      setErrors(prev => {
        const update = { ...prev };
        delete update[key];
        return update;
      });
    }
  };

  const handleSubmit = async () => {
    if (!dataForm.name?.trim()) {
      setErrors(prev => ({
        ...prev,
        name: 'Không được để trống',
      }));
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

      const workspaceData = {
        name: dataForm.name.trim(),
        description: dataForm.description || null,
        startAt: convertToDateTime(startDate),
        dueAt: convertToDateTime(dueDate),
        created_by: currentUserId,
      };

      const API_URL = getApiUrl();
      const response = await fetch(`${API_URL}/api/workspace`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workspaceData),
      });

      const result = await response.json();

      if (response.ok && (result.success || result.id)) {
        Toast.show({
          type: 'success',
          text1: 'Thành công',
          text2: 'Tạo không gian làm việc thành công',
        });
        onClose();
      } else {
        Toast.show({
          type: 'error',
          text1: 'Lỗi',
          text2: result.error || result.message || 'Tạo không gian làm việc thất bại',
        });
      }
    } catch (error: any) {
      console.error('Error creating workspace:', error);
      Toast.show({
        type: 'error',
        text1: 'Lỗi',
        text2: error.message || 'Có lỗi xảy ra. Vui lòng thử lại.',
      });
    } finally {
      setIsSubmitting(false);
    }
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
        title="Thêm mới không gian làm việc"
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
            label="Tên không gian"
            placeholder="Nhập tên không gian"
            value={dataForm.name}
            onChangeText={(text: string) => handleChangeValue('name', text)}
            captionText={errors?.name}
          />

          <TextCM>Đến hạn</TextCM>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Pressable
              style={styles.dateInput}
              onPress={() => setShowStartDatePicker(true)}>
              <TextCM style={styles.dateText}>
                {startDate ? DateUtils.convertDateToDDMMYYYY(startDate) : 'Từ ngày'}
              </TextCM>
            </Pressable>
            <Pressable
              style={styles.dateInput}
              onPress={() => setShowDueDatePicker(true)}>
              <TextCM style={styles.dateText}>
                {dueDate ? DateUtils.convertDateToDDMMYYYY(dueDate) : 'Đến ngày'}
              </TextCM>
            </Pressable>
          </View>

          <View style={{ rowGap: 6 }}>
            <TextCM>Mô tả</TextCM>
            <TextFieldCM
              onChangeText={text => handleChangeValue('description', text)}
              value={dataForm.description}
              label="Nhập mô tả"
              multiline
              maxLength={500}
            />
          </View>
        </ScrollView>
      </View>

      <View style={styles.footer}>
        <ButtonCM
          style={[styles.button, styles.buttonCancel]}
          onPress={onClose}
          label="Hủy"
        />
        <ButtonCM
          disabled={!isEmpty(errors) || !dataForm.name?.trim() || isSubmitting}
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

      <DatePickerModal
        visible={showDueDatePicker}
        onClose={() => setShowDueDatePicker(false)}
        onSelect={(date) => {
          setDueDate(date);
          setShowDueDatePicker(false);
        }}
      />
    </View>
  );
};

export default CreateNewWorkspaceScreen;

