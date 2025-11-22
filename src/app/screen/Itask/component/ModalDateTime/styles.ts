import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  ctnView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    columnGap: 10,
    padding: 16,
  },
  ctnTime: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    columnGap: 20,
    padding: 16,
  },
  btnClear: {
    padding: 16,
    alignItems: 'center',
  },
  txtClear: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FF4930',
  },
});

export default styles;

