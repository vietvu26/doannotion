import { StyleSheet } from 'react-native';
import { Color, Font } from '../../../../constants';
import FontSize, { ScreenHeight } from '../../../../constants/Size';


export default StyleSheet.create({
  ctnMain: {
    // flex: 1,
    position: 'relative',
    backgroundColor: Color.White,
  },
  ctnHome: {
    position: 'absolute',
    backgroundColor: Color.White,
    width: '100%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    top: 190,
    paddingHorizontal: 16,
    zIndex: 2,
    height: ScreenHeight - 190,
  },

  ctnTextSearch: {
    top: -20,
    zIndex: 1,
    paddingHorizontal: 16,
  },

  noti: {
    position: 'absolute',
    top: -10,
    right: -20,
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: Color.White,
    backgroundColor: '#E14337',
    borderRadius: 100,
    width: 35,
  },

  textNoti: {
    color: Color.White,
    textAlign: 'center',
    fontSize: FontSize.FontTiny,
  },

  ctnHeader: {
    marginHorizontal: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  },

  text: {
    color: Color.White,
  },
  textHead: {
    fontSize: 16,
    fontFamily: Font.InterSemiBold600,
    marginTop: 10,
  },
  iconITask: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
