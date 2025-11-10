import {Dimensions, StyleSheet} from 'react-native';
import {Color, Font} from '../../../constants';

export default StyleSheet.create({
  modal: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modelEdit: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    width: '90%',
    position: 'relative',
    maxHeight: '70%',
  },
  modelHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    marginBottom: 12,
  },
  textHeaderEdit: {
    fontFamily: Font.InterBold700,
    marginBottom: 12,
    fontSize: 16,
  },
  textDescription: {
    minHeight: 120,
    paddingVertical: 12,
    textAlignVertical: 'top',
  },
  bottomEdit: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginTop: 10,
  },
  keyctn: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  icon: {
    width: 16,
    height: 16,
  },
  listSelectCtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  addSelect: {
    marginTop: 10,
    color: Color.BgPrimary,
    fontFamily: Font.InterSemiBold600,
  },
});
