import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { globalStyles } from '../../styles/globalStyles';
import colors from '../../styles/colors';
import useAuth from '../../hooks/useAuth';

export default function ManageGradesScreen({ navigation }) {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 }}>
      <Text style={{ fontSize: 40, marginBottom: 16 }}>📊</Text>
      <Text style={{ fontSize: 18, fontWeight: '700', marginBottom: 8 }}>Notes saisies</Text>
      <Text style={{ color: colors.gray, textAlign: 'center', marginBottom: 30 }}>
        Consultez les notes que vous avez ajoutées par étudiant.
      </Text>
      <TouchableOpacity
        style={globalStyles.primaryButton}
        onPress={() => navigation.navigate('StudentList')}
      >
        <Text style={globalStyles.primaryButtonText}>Saisir une nouvelle note</Text>
      </TouchableOpacity>
    </View>
  );
}