import {StyleSheet} from 'react-native';
import {Color, Font} from '../../../constants';
import FontSize, {SizeDP} from '../../../constants/Size';

export default StyleSheet.create({
  ctnContainer: {
    flex: 1,
    backgroundColor: '#000810B2',
  },
  ctnTop: {
    flex: 1,
  },
  ctnContent: {
    backgroundColor: Color.White,
    borderTopStartRadius: SizeDP(16),
    borderTopEndRadius: SizeDP(16),
    padding: SizeDP(18),
  },
  txtTitle: {
    textAlign: 'center',
    color: '#000810',
    fontFamily: Font.InterBold700,
  },
  viewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  viewDate: {
    justifyContent: 'center',
    paddingVertical: SizeDP(16),
  },

  ctnMainTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SizeDP(16),
    borderWidth: 1,
    borderColor: Color.borderColor,
    borderRadius: SizeDP(8),
    paddingHorizontal: SizeDP(16),
    columnGap: SizeDP(20),
    flex: 1,
  },
  textDate: {
    fontSize: FontSize.FontTiny,
  },
});
