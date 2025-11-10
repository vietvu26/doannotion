import {StyleSheet} from 'react-native';
import {Color, Font} from '../../../constants';

export default StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  container: {
    backgroundColor: '#fff',
    borderRadius: 8,
    overflow: 'hidden',
    width: '90%',
    height: 400,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    marginBottom: 8,
    borderBottomColor: '#e2e5e9',
  },
  toggle: {
    justifyContent: 'flex-start',
    margin: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 12,
    alignItems: 'center',
    borderTopWidth: 1,
    borderColor: '#eee',
  },
  footerText: {
    fontSize: 16,
  },
  footerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  btnDelete: {
    backgroundColor: '#f1f1f1',
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 4,
  },

  btnConfirm: {
    backgroundColor: Color.primary01,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  signText: {
    flex: 1,
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  inputSign: {
    fontSize: 60,
    fontFamily: Font.StyleScript,
    textAlign: 'center',
    borderWidth: 0,
    backgroundColor: 'transparent',
    padding: 0,
    height: 200,
  },
  whiteImg: {
    width: 300,
    height: 200,
    backgroundColor: 'white',
    position: 'absolute',
    top: -9999,
  },
});
