import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useTranslation } from 'react-i18next';
import { globalStyles } from '../styles/globalStyles';
import { profileStyles } from '../styles/ProfileStyles';
const languages = [
  { label: 'Français', code: 'fr' },
  { label: 'English', code: 'en' },
];

export default function LanguageScreen() {
  const { i18n } = useTranslation();
  const { t } = useTranslation(); 

  return (
    <ScrollView style={globalStyles.container} showsVerticalScrollIndicator={false}>
      <View style={{ padding: 20 }}>
        <Text style={globalStyles.sectionTitle}>Choisir la langue</Text>
        <View style={profileStyles.infoCard}>
          {languages.map((lang, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => i18n.changeLanguage(lang.code)}
              style={[
                i === languages.length - 1 ? profileStyles.infoRowLast : profileStyles.infoRow,
                { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16 }
              ]}
            >
              <Text style={{ fontSize: 15, fontWeight: '600', color: '#0D47A1' }}>
                {lang.label}
              </Text>

              {i18n.language === lang.code && (
                <View style={{
                  width: 20, height: 20, borderRadius: 10,
                  backgroundColor: '#0D47A1',
                  justifyContent: 'center', alignItems: 'center'
                }}>
                  <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff' }} />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}