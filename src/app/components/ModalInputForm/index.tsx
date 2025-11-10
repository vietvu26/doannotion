import React, {useState} from 'react';
import {
  View,
  Modal,
  Pressable,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView,
} from 'react-native';
import {
  Input,
  Button,
  Select,
  SelectItem,
  IndexPath,
} from '@ui-kitten/components';
import TextCM from '../Text';
import ButtonCM from '../Button';
import styles from './styles';
import DeleteIcon from '../../../assets/images/ic/delete-listtask.svg';
import { useTranslation } from 'react-i18next';
type ModalInputFormProps = {
  visible: boolean;
  onClose: () => void;
  title: string;
  fields: {
    label: string;
    placeholder: string;
    value: string | string[];
    onChange: any;
    required?: boolean;
    multiline?: boolean;
    maxLength?: number;
    type?: string;
    options?: string[];
  }[];
  data?: IDataFormInput[];
  onSubmit: () => void;
  isSubmitting?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
};
export interface IDataFormInput {
  id: number;
  key: string;
  value: string;
  icon?: React.ReactNode;
}
const ModalInputForm = ({
  visible,
  onClose,
  title,
  fields,
  data,
  onSubmit,
  isSubmitting = false,
  submitLabel = 'Lưu',
  cancelLabel = 'Hủy',
}: ModalInputFormProps) => {
  const [errors, setErrors] = useState<boolean[]>(fields.map(() => false));

  const isFormValid = fields.every(
    (field, index) =>
      !field.required ||
      (typeof field.value === 'string'
        ? field.value.trim() && !errors[index]
        : field.value.length > 0 && !errors[index]),
  );
  const {t} = useTranslation();

  const handleInputChange = (
    index: number,
    text: string,
    required?: boolean,
  ) => {
    fields[index].onChange(text);
    if (required) {
      setErrors(prev => {
        const newErrors = [...prev];
        newErrors[index] = !text.trim();
        return newErrors;
      });
    }
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modal}>
         
            <View style={styles.modelEdit}>
              {/* Header */}
              <View style={styles.modelHeader}>
                <TextCM style={styles.textHeaderEdit}>{title}</TextCM>
              </View>

              <ScrollView
                contentContainerStyle={{paddingBottom: 20}}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
                nestedScrollEnabled={true}>
                {fields.map((field, index) => (
                  <View key={index} style={{marginBottom: 12}}>
                    <TextCM style={{marginBottom: 4}}>
                      {field.label}{' '}
                      {field.required && (
                        <TextCM style={{color: 'red'}}>*</TextCM>
                      )}
                    </TextCM>

                    {field.type === 'select' ? (
                      <Select
                        selectedIndex={
                          data
                            ? new IndexPath(
                                Math.max(
                                  0,
                                  data.findIndex(
                                    item => item.key === field.value,
                                  ),
                                ),
                              )
                            : new IndexPath(0)
                        }
                        onSelect={index => {
                          const selected = index as IndexPath;
                          if (data && data[selected.row]) {
                            const newKey = data[selected.row].key; 
                            field.onChange(newKey);
                          }
                        }}
                        value={
                          data?.find(item => item.key === field.value)
                                ?.value || ''
                        }>
                        {data?.map((item, i) => (
                          <SelectItem key={i} title={item.value} />
                        ))}
                      </Select>
                    ) : field.type === 'listSelect' &&
                      Array.isArray(field.value) ? (
                      <View>
                        {field.value.map((value, i) => (
                          <View
                            key={i}
                            style={styles.listSelectCtn}>
                            <Input
                              placeholder={field.placeholder}
                              value={value}
                              onChangeText={text => {
                                const newValues = [...field.value];
                                newValues[i] = text;
                                field.onChange(newValues);
                              }}
                              status={errors[index] ? 'danger' : 'basic'}
                              style={{flex: 1, marginRight: 8}}
                            />
                            {field.value.length > 1 && (
                              <Pressable
                                onPress={() => {
                                  if (Array.isArray(field.value)) {
                                    const newValues = field.value.filter(
                                      (_, idx) => idx !== i,
                                    );
                                    field.onChange(newValues);
                                  }
                                }}>
                                <DeleteIcon style={styles.icon} />
                              </Pressable>
                            )}
                          </View>
                        ))}

                        <Pressable
                          onPress={() => {
                            const newValues = [...field.value, ''];
                            field.onChange(newValues);
                          }}>
                          <TextCM
                            style={styles.addSelect}>
                           {t('task.add-select')}
                          </TextCM>
                        </Pressable>
                      </View>
                    ) : (
                      <Input
                        placeholder={field.placeholder}
                        value={
                          typeof field.value === 'string' ? field.value : ''
                        }
                        onChangeText={text =>
                          handleInputChange(index, text, field.required)
                        }
                        status={errors[index] ? 'danger' : 'basic'}
                        multiline={field.multiline}
                        maxLength={field.maxLength}
                        textStyle={
                          field.multiline ? styles.textDescription : undefined
                        }
                        style={{marginBottom: errors[index] ? 2 : 12}}
                      />
                    )}

                    {errors[index] && (
                      <TextCM style={{color: 'red', marginTop: 4}}>
                        {t('common.empty')}
                      </TextCM>
                    )}
                    {field.maxLength && (
                      <TextCM style={{textAlign: 'right', marginTop: 4}}>
                        {field.value.length}/{field.maxLength}
                      </TextCM>
                    )}
                  </View>
                ))}
              </ScrollView>

              {/* Nút hành động */}
              <View style={styles.bottomEdit}>
                <Button status="basic" onPress={onClose}>
                  {cancelLabel}
                </Button>
                <ButtonCM
                  disabled={!isFormValid}
                  onPress={onSubmit}
                  style={{backgroundColor: '#CA1E66', borderWidth: 0}}
                  label={submitLabel}
                  loading={isSubmitting}
                />
              </View>
            </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default ModalInputForm;
