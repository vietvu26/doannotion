import {StyleSheet} from 'react-native';
import {Color, Font} from '../../../constants';

export default StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: Color.borderColor,
    width: '90%',
    borderRadius: 8,
    margin: 8,
  },

  connerBlock: {
    position: 'absolute',
    left: -20,
    top: 0,
    borderLeftWidth: 2,
    borderBottomLeftRadius: 10,
    borderLeftColor: '#e2e5e9',
    borderBottomWidth: 2,
    borderBottomColor: '#e2e5e9',
    width: 30,
    height: 32,
  },

  inserVertical: {
    position: 'absolute',
    left: 20,
    bottom: -12,
    height: 20,
    width: 2,
    backgroundColor: '#e2e5e9',
  },
  siblingConnector: {
    position: 'absolute',
    left: -20,
    width: 2,
    backgroundColor: '#e2e5e9',
  },

  headerFirst: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
