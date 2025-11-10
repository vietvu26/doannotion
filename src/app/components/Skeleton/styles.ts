import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  skeletonItem: {
    margin: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    columnGap: 8,
    flex: 1,
  },
  skeletonContent: {
    flex: 1,
    rowGap: 6,
  },
  skeletonTitle: {
    backgroundColor: '#E4E9F2',
    padding: 8,
    borderRadius: 4,
  },
  skeletonDescription: {
    backgroundColor: '#E4E9F2',
    borderRadius: 4,
    padding: 6,
  },
});
