import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { globalStyles } from '../../styles/globalStyles';
import colors from '../../styles/colors';
import usersApi from '../../api/usersApi';
import useAuth from '../../hooks/useAuth';

export default function StudentListScreen({ navigation, route }) {
  const { user } = useAuth();
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const filteredStudents = students.filter(s => 
    s.firstName.toLowerCase().includes(search.toLowerCase()) ||
    s.lastName.toLowerCase().includes(search.toLowerCase()) ||
    s.email.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      const res = await usersApi.getStudents();
      setStudents(res.data || []);
    } catch (err) {
      console.log('Students load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const selectStudent = (student) => {
    navigation.navigate('AddGrade', { student });
  };

  const renderStudent = ({ item }) => (
    <TouchableOpacity style={{ 
      flexDirection: 'row', padding: 20, borderBottomWidth: 1, borderBottomColor: colors.gray+'20' 
    }} onPress={() => selectStudent(item)}>
      <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: colors.primary+'20', justifyContent: 'center', alignItems: 'center', marginRight: 15 }}>
        <Text style={{ fontSize: 24 }}>{item.firstName.charAt(0)}{item.lastName.charAt(0)}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.firstName} {item.lastName}</Text>
        <Text style={{ color: colors.gray, fontSize: 14 }}>{item.email}</Text>
        <Text style={{ color: colors.secondary, fontSize: 14 }}>{item.filiere} - {item.niveau} {item.group}</Text>
      </View>
      <Text style={{ color: colors.primary, fontWeight: 'bold' }}>›</Text>
    </TouchableOpacity>
  );

  if (loading) return <ActivityIndicator style={{ flex: 1, justifyContent: 'center' }} color={colors.primary} />;

  return (
    <View style={globalStyles.container}>
      <TextInput
        style={[globalStyles.input, { margin: 20, paddingLeft: 50, backgroundColor: colors.gray+'10' }]}
        placeholder="Rechercher un étudiant..."
        value={search}
        onChangeText={setSearch}
      />
      <FlatList
        data={filteredStudents}
        keyExtractor={item => item.id.toString()}
        renderItem={renderStudent}
        ListEmptyComponent={<Text style={{ textAlign: 'center', color: colors.gray, marginTop: 50 }}>Aucun étudiant trouvé.</Text>}
      />
    </View>
  );
}

