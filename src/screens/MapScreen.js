import { useState, useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity,
  ScrollView, Alert, ActivityIndicator
} from 'react-native';
import MapView, { Marker, Circle, Callout } from 'react-native-maps';
import * as Location from 'expo-location';
import { mapStyles } from '../styles/MapStyles';

// ─── Coordonnées réelles FSTM Mohammedia ────────────────────────
const FSTM_CENTER = { latitude: 33.70651, longitude: -7.35316 };

const CAMPUS_PLACES = [
  // AMPHITHÉÂTRES
  { id: 1,  name: "Amphi Ω (Omega)",   icon: "🎓", color: "#0D47A1", latitude: 33.70700, longitude: -7.35290 },
  { id: 2,  name: "Amphi λ (Lambda)",  icon: "🎓", color: "#0D47A1", latitude: 33.70720, longitude: -7.35260 },
  { id: 3,  name: "Amphi δ (Delta)",   icon: "🎓", color: "#0D47A1", latitude: 33.70640, longitude: -7.35370 },
  { id: 4,  name: "Amphi β (Beta)",    icon: "🎓", color: "#0D47A1", latitude: 33.70610, longitude: -7.35280 },
  { id: 5,  name: "Amphi α (Alpha)",   icon: "🎓", color: "#0D47A1", latitude: 33.70600, longitude: -7.35250 },
  // BÂTIMENTS
  { id: 6,  name: "BAT X",             icon: "🏫", color: "#1565C0", latitude: 33.70730, longitude: -7.35250 },
  { id: 7,  name: "BAT Y",             icon: "🏫", color: "#1565C0", latitude: 33.70700, longitude: -7.35380 },
  { id: 8,  name: "BAT C",             icon: "🏫", color: "#1565C0", latitude: 33.70630, longitude: -7.35240 },
  { id: 9,  name: "BAT D",             icon: "🏫", color: "#1565C0", latitude: 33.70640, longitude: -7.35300 },
  { id: 10, name: "BAT E",             icon: "🏫", color: "#1565C0", latitude: 33.70640, longitude: -7.35350 },
  { id: 11, name: "BAT F",             icon: "🏫", color: "#1565C0", latitude: 33.70640, longitude: -7.35410 },
  // SERVICES
  { id: 12, name: "Décanat",           icon: "🏛️", color: "#1E88E5", latitude: 33.70620, longitude: -7.35310 },
  { id: 13, name: "Bibliothèque",      icon: "📚", color: "#1565C0", latitude: 33.70600, longitude: -7.35210 },
  { id: 14, name: "Scolarité",         icon: "📋", color: "#1E88E5", latitude: 33.70580, longitude: -7.35210 },
  { id: 15, name: "Buvette",           icon: "☕", color: "#42A5F5", latitude: 33.70740, longitude: -7.35220 },
  { id: 16, name: "Centre Copie",      icon: "🖨️", color: "#42A5F5", latitude: 33.70720, longitude: -7.35200 },
  { id: 17, name: "Centre Recherche",  icon: "🔬", color: "#1E88E5", latitude: 33.70760, longitude: -7.35360 },
  { id: 18, name: "Association AE",    icon: "🎯", color: "#0D47A1", latitude: 33.70750, longitude: -7.35210 },
  // ENTRÉE
  { id: 19, name: "Entrée Principale", icon: "🚪", color: "#0D47A1", latitude: 33.70550, longitude: -7.35310 },
  { id: 20, name: "Parking",           icon: "🅿️", color: "#42A5F5", latitude: 33.70530, longitude: -7.35340 },
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

const FILTERS = ['Tous', '🎓', '🏫', '📚', '☕', '🅿️'];

export default function MapScreen({ route }) {
  const mapRef = useRef(null);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [activeFilter, setActiveFilter] = useState('Tous');

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission refusée', 'Activez la localisation pour utiliser la carte.');
        setLoading(false);
        return;
      }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High });
      setLocation(loc.coords);
      setLoading(false);
    })();
  }, []);

  // Naviguer depuis l'emploi du temps
  useEffect(() => {
    const destination = route?.params?.destination;
    if (destination && !loading) {
      const place = CAMPUS_PLACES.find(p => p.name === destination.name)
        || { ...destination, icon: "📍", color: "#0D47A1" };
      setSelectedPlace(place);
      mapRef.current?.animateToRegion({
        latitude: destination.latitude,
        longitude: destination.longitude,
        latitudeDelta: 0.002,
        longitudeDelta: 0.002,
      }, 800);
    }
  }, [route?.params?.destination, loading]);

  const toggleFavorite = (id) =>
    setFavorites(prev => prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]);

  const goToPlace = (place) => {
    setSelectedPlace(place);
    mapRef.current?.animateToRegion({
      latitude: place.latitude, longitude: place.longitude,
      latitudeDelta: 0.002, longitudeDelta: 0.002,
    }, 800);
  };

  const goToMyLocation = () => {
    if (!location) return;
    mapRef.current?.animateToRegion({
      latitude: location.latitude, longitude: location.longitude,
      latitudeDelta: 0.004, longitudeDelta: 0.004,
    }, 800);
  };

  const filteredPlaces = activeFilter === 'Tous'
    ? CAMPUS_PLACES
    : CAMPUS_PLACES.filter(p => p.icon === activeFilter);

  // Centré sur FSTM avec le bon zoom pour voir tout le campus
  const initialRegion = {
    latitude: FSTM_CENTER.latitude,
    longitude: FSTM_CENTER.longitude,
    latitudeDelta: 0.004,
    longitudeDelta: 0.004,
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
          <MapView
            ref={mapRef}
            style={mapStyles.map}
            initialRegion={initialRegion}
            showsUserLocation={true}
            showsMyLocationButton={false}
          >
            {location && (
              <Circle
                center={{ latitude: location.latitude, longitude: location.longitude }}
                radius={60}
                fillColor="rgba(21, 101, 192, 0.15)"
                strokeColor="rgba(21, 101, 192, 0.5)"
                strokeWidth={2}
              />
            )}
            {filteredPlaces.map((place) => (
              <Marker
                key={place.id}
                coordinate={{ latitude: place.latitude, longitude: place.longitude }}
                onPress={() => goToPlace(place)}
              >
                <View style={[mapStyles.markerContainer, { backgroundColor: place.color }]}>
                  <Text style={mapStyles.markerIcon}>{place.icon}</Text>
                </View>
                <Callout>
                  <View style={mapStyles.callout}>
                    <Text style={mapStyles.calloutTitle}>{place.name}</Text>
                    {location && (
                      <Text style={mapStyles.calloutDistance}>
                        📍 {getDistance(location.latitude, location.longitude, place.latitude, place.longitude)}m
                      </Text>
                    )}
                  </View>
                </Callout>
              </Marker>
            ))}
          </MapView>
        )}
        <TouchableOpacity style={mapStyles.myLocationBtn} onPress={goToMyLocation}>
          <Text style={{ fontSize: 22 }}>📍</Text>
        </TouchableOpacity>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={mapStyles.filtersContainer}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            style={[mapStyles.filterBtn, activeFilter === f && mapStyles.filterBtnActive]}
            onPress={() => setActiveFilter(f)}
          >
            <Text style={[mapStyles.filterText, activeFilter === f && mapStyles.filterTextActive]}>{f}</Text>
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
                  📍 {getDistance(location.latitude, location.longitude, selectedPlace.latitude, selectedPlace.longitude)} mètres de toi
                </Text>
              )}
            </View>
            <TouchableOpacity onPress={() => toggleFavorite(selectedPlace.id)}>
              <Text style={mapStyles.favoriteBtn}>
                {favorites.includes(selectedPlace.id) ? '⭐' : '☆'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={mapStyles.selectedActions}>
            <TouchableOpacity style={mapStyles.actionBtn}>
              <Text style={mapStyles.actionBtnText}>🗺️ Itinéraire</Text>
            </TouchableOpacity>
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
            <TouchableOpacity key={place.id} style={mapStyles.placeCard} onPress={() => goToPlace(place)}>
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
              <TouchableOpacity onPress={() => toggleFavorite(place.id)}>
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