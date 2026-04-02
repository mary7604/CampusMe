import { StyleSheet } from 'react-native';
import colors from './colors';

export const loginStyles = StyleSheet.create({

  header: {
    backgroundColor: colors.dark,
    alignItems: 'center',
    paddingTop: 80,
    paddingBottom: 50,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    elevation: 15,
  },
  logo: { fontSize: 70, marginBottom: 12 },
  appName: {
    fontSize: 38, fontWeight: 'bold',
    color: colors.white, letterSpacing: 2,
  },
  tagline: {
    fontSize: 14, color: colors.light,
    marginTop: 8, fontStyle: 'italic',
  },
  form: {
    paddingHorizontal: 28,
    paddingTop: 35,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28, fontWeight: 'bold',
    color: colors.dark, marginBottom: 6,
  },
  subtitle: {
    fontSize: 14, color: colors.gray, marginBottom: 28,
  },
  forgotContainer: { alignItems: 'flex-end', marginBottom: 28 },
  forgotText: { color: colors.secondary, fontSize: 13, fontWeight: '600' },
  disabled: { opacity: 0.7 },
  separator: {
    flexDirection: 'row', alignItems: 'center', marginVertical: 24,
  },
  separatorLine: { flex: 1, height: 1, backgroundColor: colors.light },
  separatorText: { color: colors.gray, marginHorizontal: 14, fontSize: 13 },
  registerContainer: { alignItems: 'center' },
  registerText: { color: colors.gray, fontSize: 15 },
  registerLink: { color: colors.dark, fontWeight: 'bold', fontSize: 15 },
  roleToggleContainer: {
    flexDirection: 'row',
    backgroundColor: '#EAEAEA',
    borderRadius: 12,
    padding: 4,
    marginBottom: 20,
  },
  roleToggleButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  roleToggleButtonActive: {
    backgroundColor: colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  roleToggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.gray,
  },
  roleToggleTextActive: {
    color: colors.primary,
  },
});