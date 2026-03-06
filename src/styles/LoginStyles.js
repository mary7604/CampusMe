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
});