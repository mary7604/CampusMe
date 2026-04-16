import { View, Text, TouchableOpacity, Image } from 'react-native';
import { startStyles as styles } from '../styles/StartStyles';
import { SafeAreaView } from 'react-native-safe-area-context';


export default function StartScreen({ navigation }) {
  return (
    <SafeAreaView style={{ flex: 1 }} edges={[]}>
    <View style={styles.container}>
      {/* ── PARTIE HAUTE — fond bleu ── */}
      <View style={styles.topSection}>
        <Text style={styles.emoji}>🎓</Text>
        <Text style={styles.appName}>CampusMe</Text>
        <Text style={styles.tagline}>Votre campus, dans votre poche</Text>
      </View>

      {/* ── PHOTO — milieu ── */}
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800' }}
          style={styles.image}
          blurRadius={1}
        />
        <View style={styles.overlay} />
      </View>

      {/* ── TEXTE MILIEU ── */}
      <View style={styles.middleSection}>
        
      </View>

      {/* ── BOUTON BAS ── */}
      <View style={styles.bottomSection}>
        <TouchableOpacity
          style={styles.startButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.startButtonText}>Commencer →</Text>
        </TouchableOpacity>
      </View>

    </View>
  </SafeAreaView>
  );
}