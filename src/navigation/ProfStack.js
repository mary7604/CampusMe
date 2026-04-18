import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { View, Text, ActivityIndicator } from 'react-native';
import useAuth from '../hooks/useAuth';
import AppStack from './AppStack'; // Reuse existing AppStack as prof navig

// Prof-only guard component
function ProfGuard({ children }) {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <ActivityIndicator size="large" />
      <Text>Chargement...</Text>
    </View>;
  }
  
  if (!user || user.role !== 'professeur') {
    // Redirect logic handled by parent nav
   return (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
    <Text style={{ fontSize: 16, textAlign: 'center' }}>
       Accès réservé aux professeurs
    </Text>
  </View>
);
  }
  return children;
}

const Stack = createNativeStackNavigator();

export default function ProfStack() {
  return (
    <ProfGuard>
      <AppStack />
    </ProfGuard>
  );
}
