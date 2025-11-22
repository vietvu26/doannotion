import {StyleSheet} from 'react-native';
import {Color} from '../../../../constants';
import FontSize, {SizeDP} from '../../../../constants/Size';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.White,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: SizeDP(16),
  },
  emptyListContainer: {
    flex: 1,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SizeDP(64),
  },
  emptyText: {
    fontSize: FontSize.FontBase,
    color: '#9CA3AF',
    marginTop: SizeDP(16),
  },
  notificationItem: {
    flexDirection: 'row',
    backgroundColor: Color.White,
    borderRadius: SizeDP(12),
    padding: SizeDP(16),
    marginBottom: SizeDP(12),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    borderLeftWidth: SizeDP(4),
    borderLeftColor: 'transparent',
  },
  notificationItemUnread: {
    backgroundColor: '#F3F4F6',
    borderLeftColor: '#7C3AED',
  },
  notificationIcon: {
    marginRight: SizeDP(12),
    justifyContent: 'center',
  },
  notificationContent: {
    flex: 1,
  },
  notificationTitle: {
    fontSize: FontSize.FontBase,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: SizeDP(4),
  },
  notificationTitleUnread: {
    fontWeight: '700',
    color: '#7C3AED',
  },
  notificationMessage: {
    fontSize: FontSize.FontSmall,
    color: '#6B7280',
    marginBottom: SizeDP(8),
  },
  notificationTime: {
    fontSize: FontSize.FontTiniest,
    color: '#9CA3AF',
  },
  unreadDot: {
    width: SizeDP(8),
    height: SizeDP(8),
    borderRadius: SizeDP(4),
    backgroundColor: '#7C3AED',
    alignSelf: 'center',
  },
  filterButton: {
    padding: SizeDP(4),
    justifyContent: 'center',
    alignItems: 'center',
  },
  filterMenu: {
    backgroundColor: Color.White,
    borderRadius: SizeDP(8),
    minWidth: SizeDP(150),
    zIndex: 9999,
  },
  filterMenuContent: {
    backgroundColor: Color.White,
    borderRadius: SizeDP(8),
    padding: SizeDP(4),
  },
  filterOptionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SizeDP(16),
    paddingHorizontal: SizeDP(4),
    borderBottomWidth: 1,
    borderBottomColor: Color.Background,
  },
  filterOptionText: {
    fontSize: FontSize.FontSmall,
    color: Color.colorText,
  },
  notificationContentWrapper: {
    flex: 1,
    flexDirection: 'row',
  },
  optionButton: {
    padding: SizeDP(8),
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: SizeDP(8),
  },
  filterDivider: {
    height: 1,
    backgroundColor: Color.Background,
    marginVertical: SizeDP(8),
  },
});


