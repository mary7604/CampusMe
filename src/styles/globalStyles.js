import { StyleSheet } from 'react-native';
import colors from './colors';

export const globalStyles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    paddingHorizontal: 20,
  },
  header: {
    backgroundColor: colors.dark,
    paddingTop: 55,
    paddingBottom: 22,
    paddingHorizontal: 22,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.white,
  },
  headerSubtitle: {
    fontSize: 13,
    color: colors.light,
    marginTop: 4,
  },
  primaryButton: {
    backgroundColor: colors.dark,
    borderRadius: 14,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
  },
  primaryButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  outlineButton: {
    borderWidth: 1.5,
    borderColor: colors.dark,
    borderRadius: 14,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
  },
  outlineButtonText: {
    color: colors.dark,
    fontSize: 16,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 15,
    borderWidth: 1,
    borderColor: colors.light,
    elevation: 2,
  },
  sectionTitle: {
    color: colors.dark,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 14,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 14,
    paddingHorizontal: 15,
    marginBottom: 15,
    borderWidth: 1.5,
    borderColor: colors.primary,
    height: 58,
  },
  input: {
    flex: 1,
    color: colors.dark,
    fontSize: 15,
  },
  inputIcon: {
    fontSize: 18,
    marginRight: 10,
  },
});