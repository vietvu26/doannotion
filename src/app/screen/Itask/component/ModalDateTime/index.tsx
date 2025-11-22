import React, { useState } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { Calendar, Divider, Icon } from '@ui-kitten/components';
import HeaderCM from '../../../../components/Header/HeaderCM';
import TextCM from '../../../../components/Text';
import DatePicker from 'react-native-date-picker';
import { DateUtils } from '../../../../../utils';
import { Color } from '../../../../../constants';
import styles from './styles';

type Props = {
  onClose: () => void;
  onSave?: (date: string | null) => void;
  value?: string | null;
  option?: 'remind' | 'select';
};

const ModalDateTime = ({ onClose, onSave, value, option = 'select' }: Props) => {
  const [date, setDate] = useState<Date>(value ? new Date(value) : new Date());

  const handleSave = () => {
    const dateSelect = date ? date.toISOString() : null;
    onSave?.(dateSelect);
    onClose();
  };

  const handleClear = () => {
    onSave?.(null);
    onClose();
  };

  const formatDate = (d: Date) => {
    return DateUtils.convertDateToDDMMYYYY_H_M(d);
  };

  return (
    <View style={{ flex: 1, backgroundColor: Color.White }}>
      <HeaderCM
        onPressIconLeft={onClose}
        style={{ backgroundColor: Color.White }}
        contentStyle={{ backgroundColor: Color.White }}
        titleStyle={{ color: Color.Black }}
        fillIconBackLeft={Color.Black}
        title="Chọn ngày giờ"
        renderContentRight={() => (
          <Pressable onPress={handleSave}>
            <TextCM style={{ color: Color.BgPrimary, fontSize: 16, fontWeight: '600' }}>
              Xong
            </TextCM>
          </Pressable>
        )}
      />
      <Divider />

      <ScrollView style={{ flex: 1 }}>
        <View style={styles.ctnView}>
          <Icon name="calendar" width={20} height={20} fill={Color.Text} />
          <View>
            <TextCM>{formatDate(date)}</TextCM>
          </View>
        </View>
        <Divider />

        <Calendar
          style={{ width: '100%' }}
          min={option === 'select' ? new Date(1970, 0, 0) : new Date()}
          date={date}
          onSelect={nextDate => {
            if (nextDate instanceof Date) {
              // Giữ nguyên giờ, chỉ cập nhật ngày
              const newDate = new Date(nextDate);
              newDate.setHours(date.getHours());
              newDate.setMinutes(date.getMinutes());
              setDate(newDate);
            }
          }}
        />

        <View style={styles.ctnTime}>
          <TextCM style={{ fontSize: 16, fontWeight: '500' }}>Giờ</TextCM>
          <DatePicker
            date={date}
            onDateChange={setDate}
            mode="time"
            locale="vi"
          />
        </View>

        <Pressable onPress={handleClear} style={styles.btnClear}>
          <TextCM style={styles.txtClear}>Xóa</TextCM>
        </Pressable>
      </ScrollView>
    </View>
  );
};

export default ModalDateTime;

