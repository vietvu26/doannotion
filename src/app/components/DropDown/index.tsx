import {isEmpty} from 'lodash';
import React, {FC, ReactElement} from 'react';
import {
  FlatList,
  Pressable,
  StyleProp,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import TextCM from '../Text';
import {IconHozDot} from '../../../assets/images';
import {SizeDP} from '../../../constants/Size';
import styles from './styles';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Menu} from 'react-native-paper';
import {useTranslation} from 'react-i18next';
export interface IDataDropdown {
  id: number;
  key: string;
  value: string;
  icon?: React.ReactNode;
}

type Props = {
  listDropdown: IDataDropdown[];
  onChangeItem: (item: IDataDropdown) => void;
  renderShowData?: React.ReactNode;
  dropDownStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
};

const DropdownCM: FC<Props> = ({
  listDropdown,
  onChangeItem,
  renderShowData,
}) => {
  const {t} = useTranslation();
  const inset = useSafeAreaInsets();
  const [visible, setVisible] = React.useState(false);

  const openMenu = () => {
    setVisible(true);
  };

  const closeMenu = () => setVisible(false);

  const handleSelectItem = (item: IDataDropdown) => {
    onChangeItem(item);
    setVisible(false);
  };

  const renderItem = ({
    item,
  }: {
    item: IDataDropdown;
  }): ReactElement<any, any> => (
    <Menu.Item
      style={styles.item}
      onPress={() => handleSelectItem(item)}
      title={
        <TouchableOpacity
          style={styles.item}
          onPress={() => handleSelectItem(item)}>
          {!isEmpty(item.icon) && item.icon}
          {item.key && <TextCM>{t(item.key)}</TextCM>}
        </TouchableOpacity>
      }
    />
  );

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'center',
      }}>
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        style={{backgroundColor: '#fff', zIndex: 999999999}}
        contentStyle={{backgroundColor: '#fff', borderRadius: SizeDP(8)}}
        anchor={
          <Pressable
            style={{
              alignItems: 'center',
              justifyContent: 'center',
              padding: 4,
            }}
            onPress={openMenu}>
            {!isEmpty(renderShowData) ? (
              renderShowData
            ) : (
              <IconHozDot width={SizeDP(16)} height={SizeDP(16)} />
            )}
          </Pressable>
        }>
        <FlatList
          style={{zIndex: 999999999}}
          data={listDropdown}
          renderItem={renderItem}
          keyExtractor={(item, index) => index.toString()}
        />
      </Menu>
    </View>
  );
};

export default DropdownCM;
