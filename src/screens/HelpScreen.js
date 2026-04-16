import React from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Linking
} from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import { profileStyles } from '../styles/ProfileStyles';
// import { useTranslation } from 'react-i18next';
const faqs = [
  {
    question: "Comment pointer ma présence ?",
    answer: "Va dans l'onglet Accueil → clique sur 'Scanner QR' → scanne le QR code affiché par ton professeur."
  },
  {
    question: "Comment voir mes notes ?",
    answer: "Va dans l'onglet Notes → tu verras toutes tes notes par semestre avec ta moyenne générale."
  },
  {
    question: "Comment recevoir les notifications ?",
    answer: "Les notifications sont activées automatiquement. Tu recevras une alerte pour chaque nouvelle annonce ou note."
  },
  {
    question: "Mon taux de présence est insuffisant, que faire ?",
    answer: "Contacte le secrétariat de ta filière ou ton professeur directement pour régulariser ta situation."
  },
];

export default function HelpScreen({ navigation }) {
  // const { t } = useTranslation(); 
  return (
    <ScrollView style={globalStyles.container} showsVerticalScrollIndicator={false}>

      <View style={{ padding: 20 }}>

        <Text style={globalStyles.sectionTitle}>Nous contacter</Text>
        <View style={profileStyles.infoCard}>
          {[
            { label: 'Établissement', value: 'FSTM Mohammedia' },
            { label: 'Adresse', value: 'BP 146, Mohammedia 28806, Maroc' },
            { label: 'Téléphone', value: '+212 523 31 47 08' },
            { label: 'Fax', value: '+212 523 31 53 53' },
            { label: 'Site web', value: 'www.fstm.ac.ma' },
          ].map((item, i, arr) => (
            <View
              key={i}
              style={i === arr.length - 1 ? profileStyles.infoRowLast : profileStyles.infoRow}
            >
              <Text style={profileStyles.infoLabel}>{item.label}</Text>
              <Text style={profileStyles.infoValue}>{item.value}</Text>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={[globalStyles.primaryButton, { marginBottom: 10 }]}
          onPress={() => Linking.openURL('mailto:contact@fstm.ac.ma')}
        >
          <Text style={globalStyles.primaryButtonText}>Envoyer un email</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[globalStyles.primaryButton, { marginBottom: 20, backgroundColor: '#1565C0' }]}
          onPress={() => Linking.openURL('tel:+212523314708')}
        >
          <Text style={globalStyles.primaryButtonText}>Appeler</Text>
        </TouchableOpacity>

        <Text style={globalStyles.sectionTitle}>Questions fréquentes</Text>
        {faqs.map((faq, i) => (
          <View key={i} style={[profileStyles.infoCard, { marginBottom: 10 }]}>
            <Text style={{ fontWeight: '600', color: '#0D47A1', marginBottom: 6, fontSize: 14 }}>
              {faq.question}
            </Text>
            <Text style={{ color: '#555', fontSize: 13, lineHeight: 20 }}>
              {faq.answer}
            </Text>
          </View>
        ))}

        <TouchableOpacity
          style={{ marginTop: 10, marginBottom: 30, alignItems: 'center' }}
          onPress={() => navigation.goBack()}
        >
          <Text style={{ color: '#0D47A1', fontSize: 14 }}>Retour</Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}