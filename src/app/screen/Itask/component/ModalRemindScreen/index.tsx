import React, { useState, useEffect } from 'react';
import { View, ScrollView, Pressable } from 'react-native';
import { Divider, Icon, CheckBox, IndexPath, Input } from '@ui-kitten/components';
import HeaderCM from '../../../../components/Header/HeaderCM';
import TextCM from '../../../../components/Text';
import DropdownListCM from '../../../../components/DropDownList';
import ModalDateTime from '../ModalDateTime';
import ModalFullScreen from '../../../../components/ModalFullScreen';
import { DateUtils } from '../../../../../utils';
import { Color } from '../../../../../constants';
import { listTimeRepeat, listRepeatType, RepeatType, TimeRepeat } from '../ModalRemindHelper';

interface ConfigRemind {
  dateStart: string | null;
  typeLoop: string | null;
  alwaysLoop: boolean;
  iterationCount: string | null;
  dateEnd: string | null;
}

interface ModalRemindScreenProps {
  onClose: () => void;
  onSave?: (data: ConfigRemind) => void;
  valueConfig?: ConfigRemind;
}

const ModalRemindScreen = ({ onClose, onSave, valueConfig }: ModalRemindScreenProps) => {
  const [dataForm, setDataForm] = useState<ConfigRemind>({
    dateStart: valueConfig?.dateStart || null,
    typeLoop: valueConfig?.typeLoop || null,
    alwaysLoop: valueConfig?.alwaysLoop || false,
    iterationCount: valueConfig?.iterationCount || null,
    dateEnd: valueConfig?.dateEnd || null,
  });

  const [selectTimeRepeat, setSelectTimeRepeat] = useState<IndexPath | null>(
    valueConfig?.typeLoop
      ? (new IndexPath(
          listTimeRepeat.findIndex(t => t.value === valueConfig.typeLoop)
        ) as any)
      : null
  );

  const [selectRepeatType, setSelectRepeatType] = useState<IndexPath>(
    valueConfig?.iterationCount ? new IndexPath(1) : new IndexPath(0)
  );

  const [showCheckbox, setShowCheckbox] = useState(false);
  const [showModalDate, setShowModalDate] = useState<'dateStart' | 'dateEnd' | undefined>();

  useEffect(() => {
    if (selectTimeRepeat !== null) {
      setShowCheckbox(true);
      const dataSelect = listTimeRepeat[selectTimeRepeat.row]?.value;
      setDataForm({
        ...dataForm,
        typeLoop: dataSelect,
        alwaysLoop: dataSelect ? true : false,
      });
    } else {
      setShowCheckbox(false);
      setDataForm({
        ...dataForm,
        typeLoop: null,
        alwaysLoop: false,
      });
    }
  }, [selectTimeRepeat]);

  const handleSave = (date: string | null, type: 'dateStart' | 'dateEnd') => {
    setDataForm({
      ...dataForm,
      [type]: date,
      iterationCount: type === 'dateEnd' ? null : dataForm.iterationCount,
    });
    setShowModalDate(undefined);
  };

  const onChangeCheckBox = (value: boolean) => {
    setDataForm({
      ...dataForm,
      alwaysLoop: value,
      dateEnd: value ? null : dataForm.dateEnd,
      iterationCount: value ? null : dataForm.iterationCount,
    });
  };

  const handleSaveSelect = (value: any, type: string) => {
    setDataForm({
      ...dataForm,
      [type]: value,
      dateEnd: null,
    });
  };

  const dataSubmit = () => {
    onSave?.(dataForm);
    onClose();
  };

  return (
    <View style={{ flex: 1, backgroundColor: Color.White }}>
      <HeaderCM
        onPressIconLeft={onClose}
        style={{ backgroundColor: Color.White }}
        contentStyle={{ backgroundColor: Color.White }}
        titleStyle={{ color: Color.Black }}
        fillIconBackLeft={Color.Black}
        title="Nhắc nhở"
        renderContentRight={() => (
          <Pressable onPress={dataSubmit}>
            <TextCM style={{ color: Color.BgPrimary, fontSize: 16, fontWeight: '600' }}>
              Xong
            </TextCM>
          </Pressable>
        )}
      />
      <Divider />

      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 16, rowGap: 16 }}>
        <TextCM style={{ fontSize: 12, fontWeight: '500', color: '#00204DF2' }}>
          Thời gian nhắc nhở
        </TextCM>
        <Pressable
          onPress={() => setShowModalDate('dateStart')}
          style={{
            borderWidth: 1,
            borderColor: Color.borderColor || '#E5E7EB',
            height: 40,
            paddingHorizontal: 16,
            borderRadius: 8,
            alignItems: 'flex-start',
            justifyContent: 'center',
          }}>
          <TextCM>
            {dataForm?.dateStart
              ? DateUtils.convertDateToDDMMYYYY_H_M(dataForm.dateStart)
              : 'Chọn thời gian'}
          </TextCM>
        </Pressable>

        <DropdownListCM
          label="Lặp lại"
          placeholder="Chọn loại lặp lại"
          listData={listTimeRepeat}
          onSelect={setSelectTimeRepeat}
          valueSelect={selectTimeRepeat || undefined}
          size="medium"
          isi18n={false}
        />

        {showCheckbox && (
          <CheckBox
            onChange={value => onChangeCheckBox(value)}
            checked={dataForm?.alwaysLoop}
            children={<TextCM>Lặp lại vô tận</TextCM>}
          />
        )}

        {showCheckbox && !dataForm?.alwaysLoop && (
          <View style={{ rowGap: 10 }}>
            <DropdownListCM
              label="Loại kết thúc"
              listData={listRepeatType}
              onSelect={setSelectRepeatType}
              valueSelect={selectRepeatType}
              size="medium"
              isi18n={false}
            />
            {selectRepeatType?.row === RepeatType.repeat && (
              <Input
                placeholder="Nhập số lần"
                keyboardType="numeric"
                value={dataForm?.iterationCount || ''}
                onChangeText={value => handleSaveSelect(value, 'iterationCount')}
              />
            )}
            {selectRepeatType?.row === RepeatType.end && (
              <View>
                <TextCM style={{ fontSize: 14, fontWeight: '500', marginBottom: 8 }}>
                  Ngày kết thúc
                </TextCM>
                <Pressable
                  onPress={() => setShowModalDate('dateEnd')}
                  style={{
                    borderWidth: 1,
                    borderColor: Color.borderColor || '#E5E7EB',
                    height: 40,
                    paddingHorizontal: 16,
                    borderRadius: 8,
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                  }}>
                  <TextCM>
                    {dataForm?.dateEnd
                      ? DateUtils.convertDateToDDMMYYYY_H_M(dataForm.dateEnd)
                      : 'Chọn thời gian'}
                  </TextCM>
                </Pressable>
              </View>
            )}
          </View>
        )}
      </ScrollView>

      <ModalFullScreen
        isVisible={showModalDate === 'dateStart'}
        children={
          <ModalDateTime
            onClose={() => setShowModalDate(undefined)}
            onSave={(date: string | null) => {
              handleSave(date, 'dateStart');
            }}
            value={dataForm?.dateStart || null}
            option="remind"
          />
        }
      />

      <ModalFullScreen
        isVisible={showModalDate === 'dateEnd'}
        children={
          <ModalDateTime
            onClose={() => setShowModalDate(undefined)}
            onSave={(date: string | null) => {
              handleSave(date, 'dateEnd');
            }}
            value={dataForm?.dateEnd || null}
            option="remind"
          />
        }
      />
    </View>
  );
};

export default ModalRemindScreen;
export type { ConfigRemind };

