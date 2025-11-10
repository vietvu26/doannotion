import { StyleSheet } from 'react-native';
import { Color, Font } from '../../../../constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Color.White,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  contentContainer: {
    width: '100%',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: Font.InterBold700,
  },
  instructionText: {
    fontSize: 14,
    lineHeight: 20,
    color: Color.Text07,
    marginBottom: 8,
    textAlign: 'center',
  },
  emailText: {
    fontSize: 16,
    fontFamily: Font.InterSemiBold600,
    color: '#7C3AED',
    marginBottom: 40,
    textAlign: 'center',
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
    paddingHorizontal: 8,
  },
  otpInput: {
    width: 48,
    height: 56,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    fontSize: 24,
    fontFamily: Font.InterSemiBold600,
    color: Color.TextPrimary,
    backgroundColor: Color.White,
    textAlign: 'center',
  },
  otpInputFilled: {
    borderColor: '#7C3AED',
    borderWidth: 2,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  resendLink: {
    fontSize: 14,
    color: '#7C3AED',
    fontFamily: Font.InterRegular400,
  },
  resendLinkDisabled: {
    color: Color.textDisableColor,
  },
  timerText: {
    fontSize: 14,
    color: Color.Text07,
    fontFamily: Font.InterRegular400,
  },
  backToLoginContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  backToLoginLink: {
    fontSize: 14,
    color: '#7C3AED',
    fontFamily: Font.InterRegular400,
  },
  nextButton: {
    height: 52,
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  nextButtonActive: {
    backgroundColor: '#7C3AED',
  },
  nextButtonText: {
    fontSize: 16,
    fontFamily: Font.InterSemiBold600,
    color: Color.White,
  },
});

export default styles;






