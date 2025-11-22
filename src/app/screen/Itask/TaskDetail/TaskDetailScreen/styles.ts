import { StyleSheet } from 'react-native';
import { Color } from '../../../../../constants';

const styles = StyleSheet.create({
  divider: {
    height: 6,
  },
  ctnTaskInfo: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    rowGap: 10,
  },
  ctnItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ctnTextItem: {
    fontSize: 14,
    fontWeight: '500',
    color: Color.Text,
    flex: 1,
  },
  ctnStatus: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  styleStatus: {
    padding: 6,
    borderBottomLeftRadius: 8,
    borderTopLeftRadius: 8,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
  styleStatusSelect: {
    padding: 6,
    borderTopRightRadius: 8,
    borderBottomRightRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  diviverHeight: {
    width: 2,
    backgroundColor: '#fff',
  },
  viewPriority: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
  },
  placeholderText: {
    fontSize: 14,
    color: '#00204D47',
  },
  ctnDescription: {
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  ctnOpenDescription: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 8,
  },
  ctnTaskDate: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    flexDirection: 'row',
    columnGap: 8,
  },
  viewDate: {
    flex: 1,
    rowGap: 6,
  },
  dateText: {
    fontSize: 14,
    fontWeight: '500',
    color: Color.Black,
  },
  userAvatars: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  userAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: Color.White,
  },
  userAvatarMore: {
    backgroundColor: '#F2F4F7',
    justifyContent: 'center',
    alignItems: 'center',
    borderColor: Color.White,
  },
  userAvatarMoreText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#606C80',
  },
  assignedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  assignedBadgeText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#22C55E',
  },
});

export default styles;

