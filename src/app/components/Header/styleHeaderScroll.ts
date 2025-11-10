import {StyleSheet} from 'react-native';
export const HEADER_MAX_HEIGHT = 240;
export const HEADER_MIN_HEIGHT = 84;
export const HEADER_SCROLL_DISTANCE = HEADER_MAX_HEIGHT - HEADER_MIN_HEIGHT;
export default StyleSheet.create({
  saveArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: '#62d1bc',
    overflow: 'hidden',
    height: HEADER_MAX_HEIGHT,
  },
  headerBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    width: null,
    height: HEADER_MAX_HEIGHT,
    resizeMode: 'cover',
  },
  topBar: {
    marginTop: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
  },
  title: {
    color: 'white',
    fontSize: 20,
    paddingHorizontal: 30,
  },
  avatar: {
    height: 54,
    width: 54,
    resizeMode: 'contain',
    borderRadius: 54 / 2,
  },
  fullNameText: {
    fontSize: 16,
    marginLeft: 24,
  },
  colorbgctn: {
    // backgroundColor: Color.BgBlur,
    height: 90,
    margin: 10,
     marginBottom: 20,
  },
  colorGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8, 
    justifyContent: 'center'
  },
  colorBox: {
    width: 70,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
  },
   selectedColorBox: {
    borderWidth: 2,
    borderColor: '#000', 
  },
  imgBox: {
    width: 100,
    height: 60,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center'
  }
});
