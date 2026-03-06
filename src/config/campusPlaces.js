// Coordonnées des lieux de la FST Mohammedia
// ⚠️ À affiner avec Google Maps pour chaque bâtiment exact

const CAMPUS_PLACES = [
  // AMPHITHÉÂTRES
  { id: 1,  name: "Amphi Ω (Omega)",   icon: "🎓", color: "#0D47A1", latitude: 33.6988, longitude: -7.3855 },
  { id: 2,  name: "Amphi λ (Lambda)",  icon: "🎓", color: "#0D47A1", latitude: 33.6990, longitude: -7.3852 },
  { id: 3,  name: "Amphi δ (Delta)",   icon: "🎓", color: "#0D47A1", latitude: 33.6983, longitude: -7.3858 },
  { id: 4,  name: "Amphi β (Beta)",    icon: "🎓", color: "#0D47A1", latitude: 33.6982, longitude: -7.3848 },
  { id: 5,  name: "Amphi α (Alpha)",   icon: "🎓", color: "#0D47A1", latitude: 33.6981, longitude: -7.3845 },

  // BÂTIMENTS
  { id: 6,  name: "BAT X",             icon: "🏫", color: "#1565C0", latitude: 33.6992, longitude: -7.3848 },
  { id: 7,  name: "BAT Y",             icon: "🏫", color: "#1565C0", latitude: 33.6988, longitude: -7.3865 },
  { id: 8,  name: "BAT C",             icon: "🏫", color: "#1565C0", latitude: 33.6984, longitude: -7.3845 },
  { id: 9,  name: "BAT D",             icon: "🏫", color: "#1565C0", latitude: 33.6984, longitude: -7.3852 },
  { id: 10, name: "BAT E",             icon: "🏫", color: "#1565C0", latitude: 33.6984, longitude: -7.3858 },
  { id: 11, name: "BAT F",             icon: "🏫", color: "#1565C0", latitude: 33.6984, longitude: -7.3864 },

  // SERVICES
  { id: 12, name: "Décanat",           icon: "🏛️", color: "#1E88E5", latitude: 33.6982, longitude: -7.3854 },
  { id: 13, name: "Bibliothèque",      icon: "📚", color: "#1565C0", latitude: 33.6982, longitude: -7.3842 },
  { id: 14, name: "Scolarité",         icon: "📋", color: "#1E88E5", latitude: 33.6979, longitude: -7.3842 },
  { id: 15, name: "Buvette",           icon: "☕", color: "#42A5F5", latitude: 33.6992, longitude: -7.3843 },
  { id: 16, name: "Centre Copie",      icon: "🖨️", color: "#42A5F5", latitude: 33.6990, longitude: -7.3841 },
  { id: 17, name: "Centre Recherche",  icon: "🔬", color: "#1E88E5", latitude: 33.6994, longitude: -7.3860 },
  { id: 18, name: "Association AE",    icon: "🎯", color: "#0D47A1", latitude: 33.6994, longitude: -7.3842 },

  // ENTRÉE
  { id: 19, name: "Entrée Principale", icon: "🚪", color: "#0D47A1", latitude: 33.6977, longitude: -7.3850 },
  { id: 20, name: "Parking",           icon: "🅿️", color: "#42A5F5", latitude: 33.6975, longitude: -7.3855 },
];

export default CAMPUS_PLACES;