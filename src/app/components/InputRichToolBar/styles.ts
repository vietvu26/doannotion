import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  toolbarContainer: {
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fff',
    flexDirection: 'row',
    width: '100%',
    marginBottom: 8,
  },

  toolbar: {
    backgroundColor: '#fff',
    color: 'black'
  },
  bodyInput: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    columnGap: 10,
  },
});
export default styles;
