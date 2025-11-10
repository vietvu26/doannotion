import {StyleSheet} from 'react-native';
import {Color, Font} from '../../../constants';
import FontSize, {SizeDP} from '../../../constants/Size';

export default StyleSheet.create({
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 0,
  },
  labelDefault: {
    color: Color.Text055,
    fontFamily: Font.InterRegular400,
    includeFontPadding: false,
    fontSize: FontSize.FontSmall,
  },
  requiredIndicator: {
    marginLeft: SizeDP(4),
    fontSize: FontSize.FontBase,
    color: Color.Red,
    fontFamily: Font.InterRegular400,
    includeFontPadding: false,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: SizeDP(8),
    borderWidth: SizeDP(1),
    borderColor: Color.borderColor,
    height: SizeDP(48),
    paddingHorizontal: SizeDP(16),
    paddingVertical: SizeDP(7),
  },
  textAreaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: SizeDP(8),
    borderWidth: SizeDP(1),
    borderColor: Color.borderColor,
    height: SizeDP(96),
    paddingHorizontal: SizeDP(16),
    paddingVertical: SizeDP(7),
  },
  innerInputContainer: {
    flex: 1,
  },
  textInput: {
    flex: 1,
    fontSize: FontSize.FontBase,
    color: Color.Black,
    fontFamily: Font.InterRegular400,
    includeFontPadding: false,
    paddingVertical: 0,
    paddingLeft: 0,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SizeDP(8),
  },
  errorText: {
    marginLeft: SizeDP(6),
    fontSize: FontSize.FontSmall,
    color: Color.Red,
    fontFamily: Font.InterRegular400,
  },
  iconContainer: {
    width: SizeDP(20),
  },
  textCountContainer: {
    alignItems: 'flex-end',
  },
  textCount: {
    fontFamily: Font.InterRegular400,
    fontSize: FontSize.FontSmall,
    color: '#667085',
  },
});
