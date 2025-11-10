import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  ctn: {paddingHorizontal: 16, paddingVertical: 12},
  body: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    columnGap: 8,
    marginBottom: 12,
    flex: 1,
  },

  bodyView: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 8,
  },

  viewGroup: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ca1e66',
  },

  viewImage: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },

  viewTrash: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 8,
  },

  viewAcl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },
  bodyAcl: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
