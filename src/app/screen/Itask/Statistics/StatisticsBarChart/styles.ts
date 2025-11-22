import {StyleSheet} from 'react-native';
import {Color} from '../../../../../constants';
import FontSize, {SizeDP} from '../../../../../constants/Size';
import {Font} from '../../../../../constants';

export default StyleSheet.create({
  container: {
    backgroundColor: Color.White,
    padding: SizeDP(20),
    alignItems: 'center',
    borderRadius: SizeDP(10),
    margin: SizeDP(10),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    overflow: 'hidden',
  },
  emptyContainer: {
    padding: SizeDP(40),
    alignItems: 'center',
  },
  emptyText: {
    fontSize: FontSize.FontMedium,
    color: '#9CA3AF',
  },
  chartWrapper: {
    width: '100%',
    alignItems: 'center',
    paddingLeft: SizeDP(10),
    paddingRight: SizeDP(10),
    marginTop: SizeDP(20),
  },
  axisText: {
    color: '#555',
    fontSize: 10,
    fontFamily: Font.InterRegular400,
  },
});

