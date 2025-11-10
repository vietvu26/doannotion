import {StyleSheet} from 'react-native';
import {SizeDP} from '../../../constants/Size';

export default StyleSheet.create({
  ctnListItem: {
    minWidth: SizeDP(30),
    position: 'absolute',
    backgroundColor: 'grey',
    borderRadius: SizeDP(8),
    right: SizeDP(20),
    top: SizeDP(20),
    zIndex: 3,
  },

  item: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    columnGap: SizeDP(10),
  },
  overlay: {
    flex: 1,
  },
  dropdown: {
    position: 'absolute',
    backgroundColor: '#fff',
    minWidth: SizeDP(30),
    maxWidth: SizeDP(200),
    shadowColor: '#000000',
    shadowRadius: 4,
    shadowOffset: {height: 4, width: 0},
    shadowOpacity: 0.5,
    right: SizeDP(10),
    // top: SizeDP(100),
    borderRadius: SizeDP(8),
  },
});
