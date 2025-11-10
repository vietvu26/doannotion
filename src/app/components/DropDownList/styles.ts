import {StyleSheet} from 'react-native';
import {Color, Font} from '../../../constants';
import FontSize, {SizeDP} from '../../../constants/Size';

export default StyleSheet.create({
  container: {
    backgroundColor: Color.White,
  },
  dropdown: {
    height: SizeDP(48),
    borderColor: Color.TxtCheckbox,
    borderWidth: SizeDP(1),
    borderRadius: SizeDP(8),
    paddingHorizontal: SizeDP(8),
  },
  placeholderStyle: {
    fontSize: FontSize.FontSmall,
    color: Color.Text055,
    fontFamily: Font.InterRegular400,
  },
  selectedTextStyle: {
    fontSize: FontSize.FontSmall,
    color: Color.Text,
    fontFamily: Font.InterRegular400,
  },
  itemTextStyle: {
    fontSize: FontSize.FontBase,
    color: Color.Text07,
    fontFamily: Font.InterRegular400,
  },
  itemContainerStyle: {
    borderRadius: SizeDP(8),
    overflow: 'hidden',
    borderWidth: SizeDP(1),
    borderColor: Color.colorBorder,
  },
  iconStyle: {},
  inputSearchStyle: {},

  selectedStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: SizeDP(8),
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    paddingHorizontal: SizeDP(12),
    paddingVertical: SizeDP(8),
    columnGap: SizeDP(16),
    marginTop: SizeDP(8),
    marginRight: SizeDP(8),
  },
  textSelectedStyle: {
    // marginRight: SizeDP(5),
  },
  textTitle: {
    fontSize: 12,
    fontFamily: Font.InterMedium500,
    color: '#00204DF2',
    marginBottom: 4,
    lineHeight: 22,
  },

  ctnCaption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    columnGap: 10,
    marginTop: 4,
  },

  textCaption: {
    fontSize: 12,
    fontFamily: Font.InterMedium500,
    color: '#E14337',
  },
});
