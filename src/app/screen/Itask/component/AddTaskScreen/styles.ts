import { StyleSheet } from 'react-native';
import { Color } from '../../../../../constants';

export default StyleSheet.create({
  dateInput: {
    flex: 1,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: Color.borderColor,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    minHeight: 40,
    justifyContent: 'center',
  },
  dateText: {
    fontSize: 14,
    color: Color.TextPrimary,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 8,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: Color.borderColor,
  },
  button: {
    flex: 1,
    height: 48,
    borderRadius: 8,
    backgroundColor: Color.BgPrimary,
  },
  buttonCancel: {
    backgroundColor: Color.BgPrimary,
  },
  buttonSave: {
    backgroundColor: Color.BgPrimary,
  },
});

