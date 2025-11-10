import {StyleSheet} from 'react-native';
import {SizeDP} from '../../../constants/Size';

export default StyleSheet.create({
  ctnMain: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  ctnText: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SizeDP(4),
    borderRadius: SizeDP(10),
    marginHorizontal: SizeDP(5),
    minWidth: SizeDP(30),
  },

  ctnSelect: {
    backgroundColor: '#f2ecfd',
    color: '#6f2ced',
  },
});
