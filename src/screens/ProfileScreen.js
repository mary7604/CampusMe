import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import colors from '../styles/colors';
import { globalStyles } from '../styles/globalStyles';
import { profileStyles } from '../styles/ProfileStyles';
import useAuth from '../hooks/useAuth';

const stats = [
  { value: "14.5", label: "Moyenne" },
  { value: "85%",  label: "Présences" },
  { value: "6",    label: "Matières" },
];

const menuItems = [
  { label: "Notifications" },
  { label: "Changer le mot de passe" },
  { label: "Langue" },
  { label: "Aide et support" },
  { label: "Évaluer l'application" },
];

export default function ProfileScreen({ navigation }) {
  const { user, handleLogout } = useAuth();

  const student = {
    name: user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email : "Prénom Nom",
    email: user ? user.email : "email@univ.ma",
    filiere: user?.filiere || "Non précisée",
    niveau: user?.niveau || "Non précisé",
    groupe: user?.group || "N/A",
    matricule: `MAT-${user?.id || '000'}`,
  };

  return (
    <ScrollView
      style={globalStyles.container}
      showsVerticalScrollIndicator={false}
    >

      {/* HEADER */}
      <View style={profileStyles.header}>
        <View style={profileStyles.avatarCircle}>
          <Text style={profileStyles.avatarText}>
            {student.name.charAt(0)}
          </Text>
        </View>

        <Text style={profileStyles.studentName}>{student.name}</Text>
        <Text style={profileStyles.studentEmail}>{student.email}</Text>

        <View style={profileStyles.badgeRow}>
          <View style={profileStyles.badge}>
            <Text style={profileStyles.badgeText}>{student.filiere}</Text>
          </View>
          <View style={profileStyles.badge}>
            <Text style={profileStyles.badgeText}>{student.niveau}</Text>
          </View>
          <View style={profileStyles.badge}>
            <Text style={profileStyles.badgeText}>{student.groupe}</Text>
          </View>
        </View>
      </View>

      {/* STATISTIQUES */}
      <View style={profileStyles.statsRow}>
        {stats.map((s, i) => (
          <View key={i} style={profileStyles.statBox}>
            <Text style={profileStyles.statValue}>{s.value}</Text>
            <Text style={profileStyles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      <View style={profileStyles.content}>

        {/* INFORMATIONS */}
        <Text style={globalStyles.sectionTitle}>Informations personnelles</Text>
        <View style={profileStyles.infoCard}>
          {[
            { label: "Filière", value: student.filiere },
            { label: "Niveau", value: student.niveau },
            { label: "Groupe", value: student.groupe },
            { label: "Matricule", value: student.matricule },
          ].map((item, i, arr) => (
            <View
              key={i}
              style={
                i === arr.length - 1
                  ? profileStyles.infoRowLast
                  : profileStyles.infoRow
              }
            >
              <Text style={profileStyles.infoLabel}>{item.label}</Text>
              <Text style={profileStyles.infoValue}>{item.value}</Text>
            </View>
          ))}
        </View>

        {/* PARAMÈTRES */}
        <Text style={globalStyles.sectionTitle}>Paramètres</Text>
        <View style={profileStyles.menuCard}>
          {menuItems.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={
                i === menuItems.length - 1
                  ? profileStyles.menuItemLast
                  : profileStyles.menuItem
              }
            >
              <Text style={profileStyles.menuLabel}>{item.label}</Text>
              <Text style={profileStyles.menuArrow}>›</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* DÉCONNEXION */}
        <TouchableOpacity style={profileStyles.logoutBtn} onPress={() => handleLogout(navigation)}>
          <Text style={profileStyles.logoutText}>
            Se déconnecter
          </Text>
        </TouchableOpacity>

      </View>
    </ScrollView>
  );
}