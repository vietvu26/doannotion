import React, {useState} from 'react';
import {View, TouchableOpacity, Modal} from 'react-native';
import {Color} from '../../../constants';
import styles from './styles';
import TextCM from '../Text';
import {Calendar} from '@ui-kitten/components';
import {DateUtils} from '../../../utils';

type Props = {
  visible: boolean; // Trạng thái hiển thị modal
  onClose: () => void; // Hàm đóng modal
  onSelect: (date: string | null) => void; // Hàm callback khi chọn ngày
};

const DatePickerModal = ({visible, onClose, onSelect}: Props) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const formatDate = DateUtils.convertDateToYYYYMMDD;

  const handleSelectToday = () => {
    const today = new Date();
    setSelectedDate(today);
    onSelect(formatDate(today));
    onClose();
  };
  const addYears = (date: Date, years: number) => {
    const result = new Date(date);
    result.setFullYear(result.getFullYear() + years);
    return result;
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Calendar
            style={{
              width: '100%',
            }}
            date={selectedDate || new Date()}
            min={new Date(1900, 0, 1)}
            max={addYears(new Date(), 100)}
            onSelect={nextDate => {
              if (nextDate instanceof Date) {
                setSelectedDate(nextDate);
              }
            }}
          />

          <View style={styles.footer}>
            <TouchableOpacity onPress={handleSelectToday}>
              <TextCM style={{color: Color.primary01}}>Hôm nay</TextCM>
            </TouchableOpacity>

            <View style={styles.footerRight}>
              <TouchableOpacity
                style={styles.btnDelete}
                onPress={() => {
                  setSelectedDate(null);
                  onSelect(null);
                  onClose();
                }}>
                <TextCM>Xóa</TextCM>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.btnConfirm}
                onPress={() => {
                  if (selectedDate) {
                    onSelect(formatDate(selectedDate));
                  } else {
                    onSelect(null);
                  }
                  onClose();
                }}>
                <TextCM style={{color: 'white'}}>Chọn</TextCM>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default DatePickerModal;
