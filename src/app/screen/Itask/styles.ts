import { StyleSheet } from 'react-native';
import { Color, Font } from '../../../constants';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.White,
    paddingHorizontal: 16,
  },
  load: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Color.White,
  },
  ctnBody: {
    paddingHorizontal: 16,
    backgroundColor: '#fff',
  },
  txtHeader: {
    fontSize: 16,
    fontFamily: Font.InterSemiBold600,
    marginVertical: 10,
    color: Color.TextPrimary,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 0,
    borderBottomWidth: 1,
    borderBottomColor: Color.borderColor,
  },
  menuItemSelected: {
    borderLeftWidth: 3,
    borderLeftColor: '#7C3AED',
    paddingLeft: 13, // 16 - 3 để giữ nguyên padding
  },
  menuItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuItemIcon: {
    width: 20,
    height: 20,
    marginRight: 12,
  },
  menuItemText: {
    fontSize: 14,
    fontFamily: Font.InterRegular400,
    color: Color.TextPrimary,
  },
  menuItemTextSelected: {
    fontFamily: Font.InterSemiBold600,
    color: Color.TextPrimary,
  },
  chevronIcon: {
    width: 20,
    height: 20,
  },
  topContent: {
    flexDirection: 'row',
    margin: 20,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 8,
  },
  textHeader: {
    fontFamily: Font.InterSemiBold600,
  },
  cardGap: {
    flexDirection: 'row',
    gap: 12,
  },
  noSpace: {
    padding: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  // Card styles
  cardContainer: {
    width: 320,
    borderRadius: 16,
    backgroundColor: Color.pending,
    color: Color.White,
    position: 'relative',
  },
  cardFirst: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: Color.White,
    height: 70,
    paddingBottom: 8,
    padding: 10,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  progressText: {
    color: 'white',
    marginLeft: 6,
    fontSize: 12,
  },
  progressCount: {
    color: 'white',
    fontSize: 12,
  },
  creatorSection: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    backgroundColor: Color.White,
    padding: 10,
    borderBottomEndRadius: 16,
    borderBottomLeftRadius: 16,
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Color.draft02,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  avatarText: {
    fontFamily: Font.InterMedium500,
    color: '#ca1e66',
  },
  creatorText: {
    color: Color.Black,
    fontSize: 13,
  },
  iconMore: {
    width: 25,
    height: 25,
    tintColor: 'white',
  },
  popoverContent: {
    padding: 12,
    borderRadius: 8,
  },
  optionText: {
    paddingVertical: 8,
    fontFamily: Font.InterRegular400,
  },
  headerFirst: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textCenter: {
    color: Color.White,
    fontFamily: Font.InterMedium500,
    paddingBottom: 8,
  },
  textFirst: {
    flex: 1,
    flexShrink: 1,
    marginLeft: 8,
    marginBottom: 6,
  },
  colorText: {
    color: Color.White,
    marginBottom: 6,
  },
  textBold: {
    color: Color.White,
    fontFamily: Font.InterSemiBold600,
    marginBottom: 4,
  },
  // Header styles
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
  },
  text: {
    color: Color.White,
  },
  // Task list styles
  taskListContainer: {
    backgroundColor: Color.White,
  },
  taskLoading: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskEmpty: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskEmptyText: {
    fontSize: 14,
    color: '#999',
    fontFamily: Font.InterRegular400,
  },
});

