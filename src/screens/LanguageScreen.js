import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { globalStyles } from '../styles/globalStyles';
import { profileStyles } from '../styles/ProfileStyles';

const languages = [
  { label: 'Français', code: 'fr', available: true },
  { label: 'English', code: 'en', available: false },
  { label: 'العربية', code: 'ar', available: false },
];

export default function LanguageScreen() {
  return (
    <ScrollView style={globalStyles.container} showsVerticalScrollIndicator={false}>
      <View style={{ padding: 20 }}>

        <Text style={globalStyles.sectionTitle}>Choisir la langue</Text>
        <View style={profileStyles.infoCard}>
          {languages.map((lang, i) => (
            <View
              key={i}
              style={[
                i === languages.length - 1 ? profileStyles.infoRowLast : profileStyles.infoRow,
                { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 16 }
              ]}
            >
              <View>
                <Text style={{
                  fontSize: 15,
                  fontWeight: '600',
                  color: lang.available ? '#0D47A1' : '#aaa'
                }}>
                  {lang.label}
                </Text>
                {!lang.available && (
                  <Text style={{ fontSize: 12, color: '#bbb', marginTop: 2 }}>
                    Bientôt disponible
                  </Text>
                )}
              </View>
              {lang.available && (
                <View style={{
                  width: 20, height: 20, borderRadius: 10,
                  backgroundColor: '#0D47A1',
                  justifyContent: 'center', alignItems: 'center'
                }}>
                  <View style={{
                    width: 8, height: 8, borderRadius: 4,
                    backgroundColor: '#fff'
                  }} />
                </View>
              )}
            </View>
          ))}
        </View>

      </View>
    </ScrollView>
  );
}