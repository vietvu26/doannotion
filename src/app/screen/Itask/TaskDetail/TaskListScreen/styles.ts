import {StyleSheet} from 'react-native';
import {Color} from '../../../../../constants';
import FontSize, {SizeDP} from '../../../../../constants/Size';

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
  taskItem: {
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
    borderLeftColor: '#E5E7EB',
  },
  taskHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: SizeDP(8),
  },
  taskName: {
    flex: 1,
    fontSize: FontSize.FontLarge,
    fontWeight: '600',
    color: '#1F2937',
    marginRight: SizeDP(8),
  },
  statusBadge: {
    paddingHorizontal: SizeDP(8),
    paddingVertical: SizeDP(4),
    borderRadius: SizeDP(4),
  },
  statusText: {
    fontSize: FontSize.FontTiniest,
    fontWeight: '600',
  },
  taskDescription: {
    fontSize: FontSize.FontSmall,
    color: '#6B7280',
    marginBottom: SizeDP(12),
  },
  taskFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskInfo: {
    flexDirection: 'row',
    flex: 1,
    gap: SizeDP(16),
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SizeDP(4),
  },
  infoText: {
    fontSize: FontSize.FontSmall,
    color: '#6B7280',
  },
  overdueText: {
    color: '#EF4444',
    fontWeight: '600',
  },
});

