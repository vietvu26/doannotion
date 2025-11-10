import {Pressable, StyleProp, View, ViewStyle} from 'react-native';
import {FC, useState} from 'react';
import styles from './styles';
import {Icon, IndexPath, Select, SelectItem} from '@ui-kitten/components';
import TextCM from '../Text';
import {useTranslation} from 'react-i18next';
import {isArray} from 'lodash';
import { SvgProps } from 'react-native-svg';

export interface IDropDown {
  label: string;
  value: any;
  icon?: React.ReactNode | React.FC<SvgProps>;
}

type Props = {
  placeholder?: string;
  size?: 'large' | 'medium' | 'small';
  onSelect?: any;
  valueSelect?: IndexPath[] | IndexPath;
  listData: IDropDown[];
  multiple?: boolean;
  isi18n?: boolean;
  label?: string;
  isRequired?: boolean;
  caption?: string;
  status?: string;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  isShowClear?: boolean;
};

const DropdownListCM: FC<Props> = ({
  placeholder,
  onSelect,
  valueSelect,
  listData,
  multiple = false,
  size = 'large',
  isi18n = false,
  label,
  isRequired = false,
  caption,
  status = 'primary',
  disabled = false,
  style,
  isShowClear = true,
}) => {
  const {t} = useTranslation();
  const [heightOfView, setHeightOfView] = useState(0);
  const [widthOfView, setWidthOfView] = useState(0);
  let displayData = '';
  if (valueSelect) {
    if (isArray(valueSelect)) {
      if (multiple) {
        displayData = valueSelect
          .map((index: IndexPath) => {
            return !isi18n
              ? listData[index.row].label.trim()
              : t(listData[index.row].label.trim());
          })
          .join(', ');
      } else {
        displayData = isi18n
          ? t(listData[valueSelect[0].row]?.label?.trim())
          : listData[valueSelect[0].row]?.label?.trim();
      }
    } else {
      displayData = isi18n
        ? t(listData[valueSelect.row]?.label?.trim())
        : listData[valueSelect.row]?.label?.trim();
    }
  }

  return (
    <View style={[styles.container, style]}>
      <Select
        label={
          label
            ? props => (
                <TextCM {...props} style={styles.textTitle}>
                  {label}{' '}
                  {isRequired && <TextCM style={{color: '#E14337'}}>*</TextCM>}
                </TextCM>
              )
            : undefined
        }
        caption={
          caption
            ? props => (
                <View {...props} style={styles.ctnCaption}>
                  <Icon fill={'#E14337'} width={14} height={14} name="info" />
                  <TextCM style={styles.textCaption}>{caption}</TextCM>
                </View>
              )
            : undefined
        }
        disabled={disabled}
        size={size}
        status={status}
        multiSelect={multiple}
        appearance="default"
        placeholder={props => <TextCM {...props}>{placeholder}</TextCM>}
        selectedIndex={valueSelect}
        value={
          displayData && (
            <View
              onLayout={event => {
                setHeightOfView(event.nativeEvent.layout.height);
                setWidthOfView(event.nativeEvent.layout.width);
              }}
              style={{
                position: 'relative',
              }}>
              <TextCM style={[widthOfView > 0 && {width: widthOfView - 20}]}>
                {displayData}
              </TextCM>
              {isShowClear && (
                <Pressable
                  disabled={disabled}
                  style={{
                    position: 'absolute',
                    right: 0,
                    top: (heightOfView - 16) / 2,
                  }}
                  onPress={() => onSelect(undefined)}>
                  {heightOfView > 0 && (
                    <Icon name="close" width={16} height={16} />
                  )}
                </Pressable>
              )}
            </View>
          )
        }
        onSelect={(index: IndexPath[] | IndexPath) => onSelect(index)}>
        {listData &&
          listData.map(ser => (
            <SelectItem
              key={ser?.value}
              title={props => (
                <View>
                  <TextCM {...props}>
                    {!isi18n ? ser?.label?.trim() : t(ser?.label?.trim())}
                  </TextCM>
                </View>
              )}
            />
          ))}
      </Select>
    </View>
  );
};

export default DropdownListCM;
