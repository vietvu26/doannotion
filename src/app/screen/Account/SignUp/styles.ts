import { StyleSheet } from 'react-native';
import { Color, Font } from '../../../../constants';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  imageContainer: {
    width: '100%',
    height: 280,
    backgroundColor: '#F9FAFB',
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  contentWrapper: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    marginTop: -40,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 40,
    paddingHorizontal: 24,
  },
  contentContainer: {
    width: '100%',
    backgroundColor: '#F9FAFB',
    paddingBottom: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#7C3AED',
    textAlign: 'center',
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    height: 48,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 16,
    fontSize: 14,
    color: '#1F2937',
    backgroundColor: '#fff',
  },
  inputError: {
    borderColor: '#EF4444',
    borderWidth: 1.5,
  },
  errorContainer: {
    marginTop: 6,
  },
  errorText: {
    fontSize: 12,
    color: '#EF4444',
    lineHeight: 16,
  },
  infoText: {
    fontSize: 13,
    lineHeight: 18,
    color: '#6B7280',
    marginBottom: 24,
    paddingHorizontal: 4,
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 32,
    marginTop: 8,
  },
  termsTextContainer: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginLeft: 8,
    alignItems: 'center',
  },
  termsText: {
    fontSize: 13,
    lineHeight: 20,
    color: '#6B7280',
  },
  termsLink: {
    fontSize: 13,
    lineHeight: 20,
    color: '#7C3AED',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  signupButton: {
    height: 48,
    backgroundColor: '#7C3AED',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
    shadowColor: '#7C3AED',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  signupButtonDisabled: {
    backgroundColor: '#9CA3AF',
    shadowOpacity: 0,
  },
  signupButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontSize: 14,
    color: '#6B7280',
  },
  loginLink: {
    fontSize: 14,
    color: '#7C3AED',
    fontWeight: '600',
  },
});

export default styles;

