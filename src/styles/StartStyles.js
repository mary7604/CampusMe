import { StyleSheet } from 'react-native';
import colors from './colors';

export const startStyles = StyleSheet.create({

  // CONTENEUR PRINCIPAL
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },

  // PARTIE HAUTE — fond bleu arrondi
  topSection: {
    backgroundColor: colors.dark,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 70,
    paddingBottom: 50,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    elevation: 8,
  },
  emoji: {
    fontSize: 60,
    marginBottom: 15,
  },
  appName: {
    fontSize: 42,
    fontWeight: 'bold',
    color: colors.white,
    letterSpacing: 2,
  },
  tagline: {
    fontSize: 14,
    color: colors.light,
    marginTop: 8,
    letterSpacing: 1,
  },

  // PARTIE MILIEU — photo
  imageContainer: {
    marginHorizontal: 30,
    marginTop: 30,
    borderRadius: 25,
    overflow: 'hidden',
    height: 200,
    elevation: 8,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: colors.light,
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(13, 71, 161, 0.3)', // ← léger bleu sur photo
  },
  overlayText: {
    fontSize: 50,
  },

  // TEXTE SOUS LA PHOTO
  welcomeTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.dark,
    textAlign: 'center',
    marginTop: 25,
    marginHorizontal: 30,
  },
  welcomeText: {
    fontSize: 13,
    color: colors.gray,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 8,
    marginHorizontal: 30,
  },

  // PARTIE BAS — boutons
  bottomSection: {
    paddingHorizontal: 30,
    paddingBottom: 40,
    marginTop: 25,
  },
  startButton: {
    backgroundColor: colors.dark,
    height: 56,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    marginBottom: 15,
  },
  startButtonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  loginText: {
    textAlign: 'center',
    color: colors.gray,
    fontSize: 14,
  },
  loginLink: {
    color: colors.dark,
    fontWeight: 'bold',
  },
});