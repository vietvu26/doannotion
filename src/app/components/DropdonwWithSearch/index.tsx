import {useEffect, useState} from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import {Color} from '../../../constants';
import {View} from 'react-native';

type Props = {
  data: any;
  searchable?: boolean;
  placeholder?: string;
  multiple?: boolean;
  onChangeData?: (data: any) => void;
};

const DropdownListWithSearch = ({
  data,
  searchable,
  placeholder,
  multiple,
  onChangeData,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);

  useEffect(() => {
    if (onChangeData) {
      onChangeData(value);
    }
  }, [value]);

  return (
    <View style={{zIndex: open ? 1 : 0}}>
      <DropDownPicker
        open={open}
        setOpen={setOpen}
        value={value}
        setValue={setValue}
        searchable={searchable}
        placeholder={placeholder}
        multiple={multiple}
        items={data}
        style={{
          borderRadius: 8,
          borderColor: Color.borderColor,
        }}
        searchContainerStyle={{
          borderColor: Color.borderColor,
        }}
        searchTextInputStyle={{
          borderColor: Color.borderColor,
        }}
        dropDownContainerStyle={{
          borderColor: Color.borderColor,
        }}
        searchPlaceholderTextColor={Color.Text}
        placeholderStyle={{
          color: Color.Text,
        }}
      />
    </View>
  );
};

export default DropdownListWithSearch;
