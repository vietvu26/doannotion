import {StyleSheet} from 'react-native';
import FontSize, {SizeDP} from '../../../constants/Size';
import {Color, Font} from '../../../constants';

export default StyleSheet.create({
  btnDefault: {
    height: SizeDP(40),
    borderRadius: SizeDP(8),
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SizeDP(20),
    flexDirection: 'row',
    backgroundColor: Color.BgPrimary,
  },
  btnDisable: {
    opacity: 0.5,
  },
  txtDefault: {
    fontSize: FontSize.FontSmall,
    color: Color.White,
    fontFamily: Font.InterMedium500,
    textAlign: 'center',
  },
  txtWhite: {
    color: Color.White,
  },
});
