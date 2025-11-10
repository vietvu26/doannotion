import React, {useEffect, useState} from 'react';
import {useTranslation} from 'react-i18next';
import {Dimensions, Modal, TouchableOpacity, View} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import styles from './styles';
import {ScreenWidth, SizeDP} from '../../../constants/Size';
import TextCM from '../Text';
import ButtonCM from '../Button';
import {IconCalender, IconLeftArrow} from '../../../assets/images';
import {isEmpty, isUndefined} from 'lodash';
import {DateUtils} from '../../../utils';

type ModalPicDateProp = {
  title: string;
  onClose: () => void;
  onOpen: () => void;
  isVisible: boolean;
  onSave?: (date: Date | undefined) => void;
  initDate?: Date;
};

const ModalPicDateCM = ({
  title,
  onClose,
  onOpen,
  isVisible,
  onSave,
  initDate,
}: ModalPicDateProp) => {
  const {t, i18n} = useTranslation();

  const [date, setDate] = useState(initDate);
  const insets = useSafeAreaInsets();

  const onDateChange = (data: Date) => {
    setDate(data);
  };

  const [screenWidth, setScreenWidth] = useState(
    Dimensions.get('window').width,
  );
  useEffect(() => {
    const sub = Dimensions.addEventListener('change', ({window}) => {
      setScreenWidth(window.width);
    });
    return () => sub.remove();
  }, []);
  return (
    <>
      <TouchableOpacity style={styles.ctnMainTrigger} onPress={onOpen}>
        <TextCM style={styles.textDate}>
          {isUndefined(date)
            ? 'DD/MM/YYYY'
            : DateUtils.convertDateToDDMMYYYY(date)}
        </TextCM>
        <IconCalender width={SizeDP(16)} height={SizeDP(16)} />
      </TouchableOpacity>
      <Modal animationType="fade" transparent visible={isVisible}>
        <View style={styles.ctnContainer}>
          <View style={styles.ctnTop} onTouchEnd={onClose} />
          <View
            style={[
              styles.ctnContent,
              {paddingBottom: SizeDP(16) + insets.bottom},
            ]}>
            <View style={styles.viewHeader}>
              <TouchableOpacity onPress={onClose}>
                <IconLeftArrow width={SizeDP(14)} height={SizeDP(16)} />
              </TouchableOpacity>
              <TextCM style={styles.txtTitle}>{title}</TextCM>
              <View />
            </View>
            <View style={styles.viewDate}>
              <DatePicker
                date={date ?? new Date()}
                onDateChange={onDateChange}
                mode="date"
                locale={i18n.language}
                style={{
                  width: screenWidth - SizeDP(36),
                }}
                theme="light"
              />
            </View>
            <ButtonCM
              label={'Lưu'}
              onPress={() => {
                onSave?.(date ?? undefined);
                onClose();
              }}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

export default ModalPicDateCM;
