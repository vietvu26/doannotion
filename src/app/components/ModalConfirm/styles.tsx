import {StyleSheet} from 'react-native';
import {Color, Font} from '../../../constants';
import FontSize, {SizeDP} from '../../../constants/Size';

export default StyleSheet.create({
  ctnContainer: {
    flex: 1,
    backgroundColor: '#000810B2',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: Color.White,
    margin: SizeDP(20),
    borderRadius: SizeDP(8),
    padding: SizeDP(16),
    paddingVertical: SizeDP(24),
    minWidth: 300,
  },
  body: {
    justifyContent: 'center',
    alignItems: 'center',
    gap: SizeDP(8),
  },
  viewBtn: {
    marginTop: SizeDP(16),
    flexDirection: 'row',
    gap: SizeDP(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
  btn: {
    flex: 1,
  },
  btnLeft: {
    backgroundColor: Color.BtnDisable,
  },
  labelStyleLeft: {
    color: Color.Text,
  },
  txtTitle: {
    fontSize: FontSize.FontBase,
    fontFamily: Font.InterSemiBold600,
    color: Color.Text,
    textAlign: 'center',
  },
  txtContent: {
    textAlign: 'center',
    fontFamily: Font.InterRegular400,
    color: Color.Text07,
  },
  viewIconDelete: {
    marginVertical: SizeDP(10),
  },
});
