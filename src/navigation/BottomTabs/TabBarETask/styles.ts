import {StyleSheet} from 'react-native';
import {Color, Font} from '../../../constants';
import FontSize, {SizeDP} from '../../../constants/Size';

export default StyleSheet.create({
  ctnSafeTabBottom: {
    backgroundColor: Color.White,
    shadowColor: '#002766',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
  },
  ctnTabBottom: {
    flexDirection: 'row',
    height: SizeDP(56),
    backgroundColor: Color.White,
    justifyContent: 'space-around',
    paddingHorizontal: SizeDP(20),
  },
  ctnItemTabBottom: {
    // width: SizeDP(90),
    gap: SizeDP(4),
    justifyContent: 'center',
    alignItems: 'center',
  },
  txtLabel: {
    fontSize: FontSize.FontTiniest,
    fontFamily: Font.InterRegular400,
    color: 'rgba(0, 32, 77, 0.7)',
    textAlign: 'center',
  },
  txtLabelSelect: {
    fontSize: FontSize.FontTiniest,
    fontFamily: Font.InterSemiBold600,
    color: '#7C3AED',
    textAlign: 'center',
  },
  ctnLine: {
    height: SizeDP(3),
    width: SizeDP(70),
    backgroundColor: '#396961',
    position: 'absolute',
    bottom: 0,
  },
});
