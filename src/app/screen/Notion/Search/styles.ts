import { StyleSheet, Platform } from 'react-native';
import { Color, Font } from '../../../../constants';
import FontSize, { ScreenHeight } from '../../../../constants/Size';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.White,
  },
  keyboardView: {
    flex: 1,
  },
  content: {
    flex: 1,
    backgroundColor: Color.White,
  },
  ctnLeft: {
    alignItems: 'center',
    columnGap: 14,
    flexDirection: 'row',
    marginTop: 3,
  },
  ctnImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarIcon: {
    width: 24,
    height: 24,
  },
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
    flexGrow: 1,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Color.White,
  },
  sectionHeaderText: {
    fontSize: FontSize.FontMedium,
    fontFamily: Font.InterSemiBold600,
    color: '#666',
  },
  itemContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Color.White,
  },
  itemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  itemIcon: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  icon: {
    width: 24,
    height: 24,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: FontSize.FontMedium,
    fontFamily: Font.InterMedium500,
    color: '#333',
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: FontSize.FontSmall,
    fontFamily: Font.InterRegular400,
    color: '#999',
  },
  separator: {
    height: 1,
    backgroundColor: '#f0f0f0',
    marginLeft: 52, // Align with item content
    marginRight: 16,
  },
  searchBarContainer: {
    backgroundColor: Color.White,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  searchIcon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: FontSize.FontMedium,
    fontFamily: Font.InterRegular400,
    color: '#333',
    padding: 0,
  },
  clearButton: {
    padding: 4,
    marginLeft: 8,
  },
  clearIcon: {
    width: 20,
    height: 20,
  },
  filterButton: {
    padding: 4,
    marginLeft: 8,
  },
  filterIcon: {
    width: 20,
    height: 20,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 20,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: FontSize.FontMedium,
    fontFamily: Font.InterSemiBold600,
    color: '#666',
    marginTop: 12,
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: FontSize.FontSmall,
    fontFamily: Font.InterRegular400,
    color: '#999',
    marginTop: 8,
    textAlign: 'center',
  },
});
