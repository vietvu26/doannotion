import {StyleSheet} from 'react-native';
import {Font, Color} from '../../../../../constants';

export default StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flex: 1,
  },

  ctnListAuthor: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  txtAuthor: {
    fontSize: 14,
    fontFamily: Font.InterMedium500,
    color: Color.Text,
  },

  viewClearAll: {
    padding: 6,
    borderRadius: 4,
    backgroundColor: '#CA1E66',
  },

  txtClear: {
    color: '#fff',
    fontSize: 14,
    fontFamily: Font.InterRegular400,
  },

  ctnUserAcl: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 8,
  },

  viewAcl: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    columnGap: 8,
    marginTop: 8,
    flex: 1,
    paddingLeft: 20,
  },
  viewSubAcl: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 8,
    flex: 1,
  },

  viewPeople: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ca1e66',
  },

  viewImg: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },

  viewUserAcls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 10,
  },

  ctnUserAcls: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  viewOrgIn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    columnGap: 8,
  },

  ctnAddAll: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    backgroundColor: '#ca1e66',
  },
  txtAddAll: {
    color: Color.White,
    fontSize: 14,
    fontFamily: Font.InterMedium500,
  },

  ctnSelect: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    columnGap: 8,
    marginBottom: 12,
  },

  ctnViewGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 8,
  },

  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
});
