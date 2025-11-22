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
  content: {
    padding: SizeDP(16),
  },
  sectionTitle: {
    fontSize: FontSize.FontLarge,
    fontWeight: '600',
    marginBottom: SizeDP(16),
    color: '#1F2937',
  },
  statCard: {
    backgroundColor: Color.White,
    borderRadius: SizeDP(12),
    padding: SizeDP(16),
    marginBottom: SizeDP(12),
    borderLeftWidth: SizeDP(4),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statCardDisabled: {
    opacity: 0.5,
  },
  statCardContent: {
    flex: 1,
  },
  statCardArrow: {
    marginLeft: SizeDP(12),
  },
  statCardArrowText: {
    fontSize: FontSize.FontXXLarge,
    fontWeight: '300',
  },
  statTitle: {
    fontSize: FontSize.FontSmall,
    color: '#6B7280',
    marginBottom: SizeDP(8),
  },
  statValue: {
    fontSize: FontSize.FontXXLarge,
    fontWeight: '700',
  },
  progressContainer: {
    marginTop: SizeDP(24),
  },
  progressBar: {
    height: SizeDP(8),
    backgroundColor: '#E5E7EB',
    borderRadius: SizeDP(4),
    overflow: 'hidden',
    marginBottom: SizeDP(8),
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#10B981',
    borderRadius: SizeDP(4),
  },
  progressText: {
    fontSize: FontSize.FontMedium,
    color: '#6B7280',
    textAlign: 'center',
  },
  chartContainer: {
    flexDirection: 'row',
    marginTop: SizeDP(24),
    gap: SizeDP(12),
  },
  chartCard: {
    backgroundColor: Color.White,
    borderRadius: SizeDP(12),
    padding: SizeDP(16),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  chartCardContent: {
    alignItems: 'center',
    gap: SizeDP(8),
  },
  chartCardText: {
    fontSize: FontSize.FontSmall,
    color: '#1F2937',
    textAlign: 'center',
  },
});

