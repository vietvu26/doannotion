import {ReactNode, useState} from 'react';
import {IndexPath, MenuItem, OverflowMenu} from '@ui-kitten/components';
import {useTranslation} from 'react-i18next';
import {TouchableOpacity} from 'react-native';
import TextCM from '../Text';
interface IDataMenu {
  id: number;
  key: string;
  value: string;
  icon?: ReactNode;
  selectedTitle?: string;
}
type Props = {
  selectedIndex: IndexPath | undefined;
  setSelectedIndex: (selectedIndex: IndexPath | undefined) => void;
  listData: IDataMenu[];
  selectedTitle?: any;
  renderSelected?: ReactNode;
};

export const OverflowMenuCM = ({
  listData = [],
  selectedIndex = undefined,
  selectedTitle = 'Toggle Menu',
  setSelectedIndex,
  renderSelected,
}: Props) => {
  const {t} = useTranslation();
  const [visible, setVisible] = useState(false);

  const onItemSelect = (index: IndexPath | undefined): void => {
    setSelectedIndex(index);
    setVisible(false);
  };

  const renderToggleButton = () => {
    if (renderSelected) {
      return (
        <TouchableOpacity onPress={() => setVisible(true)}>
          {renderSelected}
        </TouchableOpacity>
      );
    }
    return (
      <TouchableOpacity onPress={() => setVisible(true)}>
        <TextCM>{selectedTitle}</TextCM>
      </TouchableOpacity>
    );
  };

  return (
    <OverflowMenu
      anchor={renderToggleButton}
      visible={visible}
      selectedIndex={selectedIndex}
      onSelect={onItemSelect}
      onBackdropPress={() => setVisible(false)}>
      {listData.map((item: IDataMenu) => (
        <MenuItem title={t(item.value)} accessoryLeft={item?.icon} />
      ))}
    </OverflowMenu>
  );
};
