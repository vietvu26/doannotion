import {StyleSheet} from 'react-native';
import {Color, Font, FontSize} from '../../../constants';
import {SizeDP} from '../../../constants/Size';

export default StyleSheet.create({
  ctnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  txtLabel: {
    fontSize: FontSize.FontSmall,
    fontFamily: Font.InterMedium500,
    color: Color.TxtCheckbox,
    marginStart: SizeDP(8),
  },
});
