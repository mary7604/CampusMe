import { useState, useEffect } from 'react';
import {
  View, Text, TouchableOpacity,
  ScrollView, Alert, ActivityIndicator
} from 'react-native';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';
import { mapStyles } from '../styles/MapStyles';

const FSTM_CENTER = { latitude: 33.70651, longitude: -7.35316 };

const CAMPUS_PLACES = [
  { id: 1,  name: "Amphi Alpha",      icon: "🎓", color: "#0D47A1", latitude: 33.70580, longitude: -7.35458 },
  { id: 2,  name: "Amphi Beta",       icon: "🎓", color: "#0D47A1", latitude: 33.70588, longitude: -7.35439 },
  { id: 3,  name: "Amphi Delta",      icon: "🎓", color: "#0D47A1", latitude: 33.70596, longitude: -7.35420 },
  { id: 4,  name: "Amphi Lambda",     icon: "🎓", color: "#0D47A1", latitude: 33.70604, longitude: -7.35401 },
  { id: 5,  name: "Amphi Omega",      icon: "🎓", color: "#0D47A1", latitude: 33.70612, longitude: -7.35382 },
  { id: 6,  name: "BAT X",            icon: "🏫", color: "#1565C0", latitude: 33.70630, longitude: -7.35480 },
  { id: 7,  name: "BAT Y",            icon: "🏫", color: "#1565C0", latitude: 33.70620, longitude: -7.35460 },
  { id: 8,  name: "BAT C",            icon: "🏫", color: "#1565C0", latitude: 33.70640, longitude: -7.35440 },
  { id: 9,  name: "BAT D",            icon: "🏫", color: "#1565C0", latitude: 33.70650, longitude: -7.35420 },
  { id: 10, name: "BAT E",            icon: "🏫", color: "#1565C0", latitude: 33.70660, longitude: -7.35400 },
  { id: 11, name: "BAT F",            icon: "🏫", color: "#1565C0", latitude: 33.70670, longitude: -7.35380 },
  { id: 12, name: "Decanat",          icon: "🏛️", color: "#1E88E5", latitude: 33.70700, longitude: -7.35350 },
  { id: 13, name: "Bibliotheque",     icon: "📚", color: "#1565C0", latitude: 33.70690, longitude: -7.35360 },
  { id: 14, name: "Scolarite",        icon: "📋", color: "#1E88E5", latitude: 33.70680, longitude: -7.35370 },
  { id: 15, name: "Buvette",          icon: "☕", color: "#42A5F5", latitude: 33.70560, longitude: -7.35500 },
  { id: 16, name: "Centre Copie",     icon: "🖨️", color: "#42A5F5", latitude: 33.70550, longitude: -7.35480 },
  { id: 17, name: "Centre Recherche", icon: "🔬", color: "#1E88E5", latitude: 33.70710, longitude: -7.35340 },
  { id: 18, name: "Parking",          icon: "🅿️", color: "#78909C", latitude: 33.70520, longitude: -7.35520 },
];

function getDistance(lat1, lon1, lat2, lon2) {
  const R = 6371000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

const FILTERS = [
  { label: 'Tous',         value: 'Tous' },
  { label: '🎓 Amphis',    value: '🎓' },
  { label: '🏫 Batiments', value: '🏫' },
  { label: '📚 Biblio',    value: '📚' },
  { label: '☕ Buvette',   value: '☕' },
  { label: '🅿️ Parking',  value: '🅿️' },
];

function buildMapHTML(places, userLat, userLon) {
  const markers = places.map(p => `
    L.marker([${p.latitude}, ${p.longitude}])
      .addTo(map)
      .bindPopup('<b>${p.name}</b>')
      .on('click', function() {
        window.ReactNativeWebView.postMessage(JSON.stringify({id: ${p.id}}));
      });
  `).join('');

  const userMarker = userLat ? `
    L.circleMarker([${userLat}, ${userLon}], {
      radius: 10,
      fillColor: '#1565C0',
      color: '#ffffff',
      weight: 3,
      opacity: 1,
      fillOpacity: 0.9
    }).addTo(map).bindPopup('<b>Vous etes ici</b>');
  ` : '';

  return `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { width: 100vw; height: 100vh; overflow: hidden; }
    #map { width: 100%; height: 100%; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    var map = L.map('map', { zoomControl: true }).setView([${FSTM_CENTER.latitude}, ${FSTM_CENTER.longitude}], 17);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'OpenStreetMap contributors',
      maxZoom: 19,
    }).addTo(map);
    ${markers}
    ${userMarker}
  </script>
</body>
</html>`;
}

export default function MapScreen({ route }) {
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [activeFilter, setActiveFilter] = useState('Tous');

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission refusee', 'Activez la localisation pour utiliser la carte.');
        setLoading(false);
        return;
      }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      setLocation(loc.coords);
      setLoading(false);
    })();
  }, []);

  const filteredPlaces = activeFilter === 'Tous'
    ? CAMPUS_PLACES
    : CAMPUS_PLACES.filter(p => p.icon === activeFilter);

  const handleWebViewMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      const place = CAMPUS_PLACES.find(p => p.id === data.id);
      if (place) setSelectedPlace(place);
    } catch (e) {}
  };

  return (
    <View style={mapStyles.container}>

      <View style={mapStyles.header}>
        <Text style={mapStyles.headerTitle}>🗺️ Campus Navigator</Text>
        <Text style={mapStyles.headerSub}>FST Mohammedia — Trouve ton chemin</Text>
      </View>

      <View style={mapStyles.mapContainer}>
        {loading ? (
          <View style={mapStyles.loadingContainer}>
            <ActivityIndicator size="large" color="#0D47A1" />
            <Text style={mapStyles.loadingText}>Localisation en cours...</Text>
          </View>
        ) : (
          <WebView
            style={{ flex: 1 }}
            source={{ html: buildMapHTML(filteredPlaces, location?.latitude, location?.longitude) }}
            onMessage={handleWebViewMessage}
            javaScriptEnabled={true}
            domStorageEnabled={true}
            startInLoadingState={true}
            renderLoading={() => (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#0D47A1" />
              </View>
            )}
          />
        )}
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={mapStyles.filtersContainer}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f.value}
            style={[mapStyles.filterBtn, activeFilter === f.value && mapStyles.filterBtnActive]}
            onPress={() => setActiveFilter(f.value)}
          >
            <Text style={[mapStyles.filterText, activeFilter === f.value && mapStyles.filterTextActive]}>
              {f.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {selectedPlace && (
        <View style={mapStyles.selectedCard}>
          <View style={mapStyles.selectedHeader}>
            <Text style={mapStyles.selectedIcon}>{selectedPlace.icon}</Text>
            <View style={mapStyles.selectedInfo}>
              <Text style={mapStyles.selectedName}>{selectedPlace.name}</Text>
              {location && (
                <Text style={mapStyles.selectedDistance}>
                  📍 {getDistance(location.latitude, location.longitude, selectedPlace.latitude, selectedPlace.longitude)} metres de toi
                </Text>
              )}
            </View>
            <TouchableOpacity onPress={() => setFavorites(prev =>
              prev.includes(selectedPlace.id)
                ? prev.filter(f => f !== selectedPlace.id)
                : [...prev, selectedPlace.id]
            )}>
              <Text style={mapStyles.favoriteBtn}>
                {favorites.includes(selectedPlace.id) ? '⭐' : '☆'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={mapStyles.selectedActions}>
            <TouchableOpacity style={mapStyles.actionBtnOutline} onPress={() => setSelectedPlace(null)}>
              <Text style={mapStyles.actionBtnOutlineText}>✕ Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {!selectedPlace && (
        <ScrollView style={mapStyles.placesList} showsVerticalScrollIndicator={false}>
          <Text style={mapStyles.placesTitle}>Lieux — FST Mohammedia</Text>
          {filteredPlaces.map((place) => (
            <TouchableOpacity key={place.id} style={mapStyles.placeCard} onPress={() => setSelectedPlace(place)}>
              <View style={[mapStyles.placeIconBox, { backgroundColor: place.color }]}>
                <Text style={{ fontSize: 20 }}>{place.icon}</Text>
              </View>
              <View style={mapStyles.placeInfo}>
                <Text style={mapStyles.placeName}>{place.name}</Text>
                {location && (
                  <Text style={mapStyles.placeDistance}>
                    {getDistance(location.latitude, location.longitude, place.latitude, place.longitude)} m
                  </Text>
                )}
              </View>
              <TouchableOpacity onPress={() => setFavorites(prev =>
                prev.includes(place.id)
                  ? prev.filter(f => f !== place.id)
                  : [...prev, place.id]
              )}>
                <Text style={{ fontSize: 22 }}>{favorites.includes(place.id) ? '⭐' : '☆'}</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
          <View style={{ height: 30 }} />
        </ScrollView>
      )}
    </View>
  );
}