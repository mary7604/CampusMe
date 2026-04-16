import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, Switch
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { globalStyles } from '../styles/globalStyles';
import { profileStyles } from '../styles/ProfileStyles';
// import { useTranslation } from 'react-i18next';

export default function NotificationsScreen() {
  // const { t } = useTranslation(); 
  const [alerteAbsences, setAlerteAbsences] = useState(true);
  const [rappelCours, setRappelCours] = useState(true);

  useEffect(() => {
    const load = async () => {
      const a = await AsyncStorage.getItem('notif_absences');
      const b = await AsyncStorage.getItem('notif_annonce');
      const c = await AsyncStorage.getItem('notif_note');
      const d = await AsyncStorage.getItem('notif_cours');
      if (a !== null) setAlerteAbsences(a === 'true');
      if (b !== null) setNouvelleAnnonce(b === 'true');
      if (c !== null) setNouvelleNote(c === 'true');
      if (d !== null) setRappelCours(d === 'true');
    };
    load();
  }, []);

  const toggle = async (key, value, setter) => {
    setter(value);
    await AsyncStorage.setItem(key, String(value));
  };

  const notifications = [
  {
    label: 'Alerte absences',
    description: 'Recevoir une alerte si ton taux passe sous 75%',
    value: alerteAbsences,
    key: 'notif_absences',
    setter: setAlerteAbsences,
  },
  {
    label: 'Rappel cours',
    description: 'Recevoir un rappel 15 min avant chaque cours',
    value: rappelCours,
    key: 'notif_cours',
    setter: setRappelCours,
  },
];

  return (
    <ScrollView style={globalStyles.container} showsVerticalScrollIndicator={false}>
      <View style={{ padding: 20 }}>

        <Text style={globalStyles.sectionTitle}>Préférences de notifications</Text>
        <View style={profileStyles.infoCard}>
          {notifications.map((item, i) => (
            <View
              key={i}
              style={[
                i === notifications.length - 1 ? profileStyles.infoRowLast : profileStyles.infoRow,
                { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 14 }
              ]}
            >
              <View style={{ flex: 1, marginRight: 10 }}>
                <Text style={{ fontWeight: '600', color: '#0D47A1', fontSize: 14 }}>{item.label}</Text>
                <Text style={{ color: '#888', fontSize: 12, marginTop: 2 }}>{item.description}</Text>
              </View>
              <Switch
                value={item.value}
                onValueChange={(val) => toggle(item.key, val, item.setter)}
                trackColor={{ false: '#ccc', true: '#90CAF9' }}
                thumbColor={item.value ? '#0D47A1' : '#f4f3f4'}
              />
            </View>
          ))}
        </View>

      </View>
    </ScrollView>
  );
}