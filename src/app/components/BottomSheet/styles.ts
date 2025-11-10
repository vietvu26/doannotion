import {StyleSheet} from 'react-native';
import {Color, Font} from '../../../constants';
import FontSize, {SizeDP} from '../../../constants/Size';

export default StyleSheet.create({
  ctnContainer: {
    flex: 1,
    backgroundColor: Color.borderColor,
  },
  ctnTop: {
    flex: 1,
  },
  ctnContent: {
    backgroundColor: Color.White,
    borderTopStartRadius: SizeDP(16),
    borderTopEndRadius: SizeDP(16),
  },
  txtTitle: {
    // textAlign: 'center',
    color: Color.colorText,
    fontFamily: Font.InterSemiBold600,
    fontSize: FontSize.FontBase,
  },
  txtRight: {
    textAlign: 'right',
    color: Color.add,
    fontFamily: Font.InterMedium500,
    fontSize: FontSize.FontSmall,
  },
  viewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: SizeDP(15),
    borderBottomColor: Color.Background,
    borderBottomWidth: 0.5,
  },
  viewBody: {
    padding: SizeDP(16),
    gap: SizeDP(16),
  },
});
