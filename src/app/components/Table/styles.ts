import {StyleSheet} from 'react-native';
import {Font, FontSize} from '../../../constants';
import {SizeDP} from '../../../constants/Size';

export default StyleSheet.create({
  container: {
    flex: 1,
  },
  tableBody: {
    flexDirection: 'row',
    flex: 1,
  },
  stickyColumnScroll: {
    position: 'absolute',
    right: 0,
    zIndex: 10,
    minWidth: SizeDP(80),
    maxWidth: SizeDP(120),
    flex: 1,
  },
  stickyHeader: {
    minWidth: SizeDP(100),
    padding: SizeDP(10),
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: '#F2ECFD',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#00358014',
    color: 'white'
  },
  stickyColumn: {
    minWidth: SizeDP(70),
    // maxWidth: SizeDP(200),
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    padding: SizeDP(10),
    minHeight: SizeDP(50),
  },
  headerRow: {
    flexDirection: 'row',
    marginRight: SizeDP(100),
  },
  headerCell: {
    minWidth: SizeDP(100),
    padding: SizeDP(10),
    justifyContent: 'center',
    alignItems: 'flex-start',
    backgroundColor: '#F2ECFD',
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#00358014',
  },
  headerText: {
    fontSize: FontSize.FontTiny,
    fontFamily: Font.InterMedium500,
    color: '#00204DB2',
  },
  row: {
    flexDirection: 'row',
    marginRight: SizeDP(100),
  },
  cell: {
    minWidth: SizeDP(100),
    padding: SizeDP(10),
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
  cellText: {
    textAlign: 'left',
    fontSize: FontSize.FontTiny,
    fontFamily: Font.InterRegular400,
    color: '#00204DCC',
  },
  box: {
    shadowColor: '#2D3239',
    shadowOffset: {width: -1, height: 0}, // -1px 0px
    shadowOpacity: 0.1, // Dựa trên giá trị alpha của màu (0F trong mã hex = 15 trong hệ thập phân, tương đương với 0.1 opacity)
    shadowRadius: 6, // 6px
    elevation: 3, // Chỉ dành cho Android để tạo đổ bóng
  },
});
