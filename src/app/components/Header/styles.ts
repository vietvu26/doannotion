import {StyleSheet} from 'react-native';
import {Color, Font} from '../../../constants';
import FontSize, {SizeDP} from '../../../constants/Size';

const styles = StyleSheet.create({
  ctnMain: {
    backgroundColor: Color.BgPrimary,
  },
  ctnHeader: {
    paddingHorizontal: SizeDP(18),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SizeDP(8),
    marginBottom: SizeDP(2),
  },
  ctnLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  txtTitle: {
    marginStart: SizeDP(18),
    color: Color.White,
    fontFamily: Font.InterBold700,
    fontSize: FontSize.FontBase,
    textAlign: 'center',
  },
  
});
export default styles;
