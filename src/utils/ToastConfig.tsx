import {
  BaseToast,
  ErrorToast,
  InfoToast,
  ToastConfig,
} from 'react-native-toast-message';
import {Font} from '../constants';
import {Icon} from '@ui-kitten/components';

/*
  1. Create the config
*/
const toastConfig: ToastConfig = {
  /*
    Overwrite 'success' type,
    by modifying the existing `BaseToast` component
  */
  success: props => (
    <BaseToast
      {...props}
      style={{
        backgroundColor: '#39AC6D',
        borderRadius: 10,
        borderLeftColor: '#39AC6D',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      renderLeadingIcon={() => (
        <Icon fill={'#fff'} width={30} height={30} name="checkmark-circle-2" />
      )}
      contentContainerStyle={{paddingHorizontal: 8}}
      text1Style={{
        fontSize: 14,
        color: '#fff',
        fontFamily: Font.InterSemiBold600,
      }}
      text2Style={{
        fontSize: 12,
        color: '#fff',
        fontFamily: Font.InterRegular400,
      }}
    />
  ),
  /*
    Overwrite 'error' type,
    by modifying the existing `ErrorToast` component
  */
  error: props => (
    <ErrorToast
      {...props}
      style={{
        backgroundColor: '#E14337',
        borderRadius: 10,
        borderLeftColor: '#E14337',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      renderLeadingIcon={() => (
        <Icon fill={'#fff'} width={30} height={30} name="close-circle" />
      )}
      contentContainerStyle={{paddingHorizontal: 8}}
      text1Style={{
        fontSize: 14,
        color: '#fff',
        fontFamily: Font.InterSemiBold600,
      }}
      text2Style={{
        fontSize: 12,
        color: '#fff',
        fontFamily: Font.InterRegular400,
      }}
    />
  ),

  info: props => (
    <InfoToast
      {...props}
      style={{
        backgroundColor: 'rgb(54, 106, 226)',
        borderRadius: 10,
        borderLeftColor: 'rgb(54, 106, 226)',
        alignItems: 'center',
        justifyContent: 'center',
      }}
      renderLeadingIcon={() => (
        <Icon fill={'#fff'} width={30} height={30} name="alert-circle" />
      )}
      contentContainerStyle={{paddingHorizontal: 8}}
      text1Style={{
        fontSize: 14,
        color: '#fff',
        fontFamily: Font.InterSemiBold600,
      }}
      text2Style={{
        fontSize: 12,
        color: '#fff',
        fontFamily: Font.InterRegular400,
      }}
    />
  ),
  /*
    Or create a completely new type - `tomatoToast`,
    building the layout from scratch.

    I can consume any custom `props` I want.
    They will be passed when calling the `show` method (see below)
  */
};

export default toastConfig;
