import {StyleSheet} from 'react-native';
import FontSize, {SizeDP} from '../../../constants/Size';
import {Color, Font} from '../../../constants';

export default StyleSheet.create({
  ctnMain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  ctnCard: {
    backgroundColor: Color.White,
    overflow: 'hidden',
    borderRadius: SizeDP(10),
    marginVertical: SizeDP(12),
    shadowColor: Color.Black,
    shadowOffset: {
      width: 2,
      height: 2,
    },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },

  ctnHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SizeDP(16),
    paddingVertical: SizeDP(12),
  },

  ctnTitle: {
    paddingHorizontal: SizeDP(16),
    rowGap: SizeDP(16),
    paddingVertical: SizeDP(16),
  },

  ctnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  ctnImage: {
    width: SizeDP(40),
    height: SizeDP(40),
    backgroundColor: 'red',
    borderRadius: SizeDP(20),
    marginRight: SizeDP(12),
  },

  name: {
    fontFamily: Font.InterMedium500,
    color: Color.TextPrimary,
  },

  group: {
    color: Color.Text,
    fontSize: FontSize.FontTiny,
  },

  handleNewGroup: {
    color: Color.Text,
    fontSize: FontSize.FontTiny,
    width: SizeDP(130),
    textAlign: 'right',
  },
});
