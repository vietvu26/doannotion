import {StyleSheet} from 'react-native';
import {SizeDP} from '../../../constants/Size';
import {Color} from '../../../constants';

export default StyleSheet.create({
  ctnGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    columnGap: SizeDP(12),
    backgroundColor: Color.White,
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
});
