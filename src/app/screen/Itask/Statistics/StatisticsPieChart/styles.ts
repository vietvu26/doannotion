import {StyleSheet} from 'react-native';
import {Color} from '../../../../../constants';
import FontSize, {SizeDP} from '../../../../../constants/Size';

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
});

