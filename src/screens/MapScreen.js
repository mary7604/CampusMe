import { useState, useEffect, useRef } from 'react';
import {
  View, Text, TouchableOpacity,
  ScrollView, Alert, ActivityIndicator
} from 'react-native';
import { WebView } from 'react-native-webview';
import * as Location from 'expo-location';
import { SafeAreaView } from 'react-native-safe-area-context';

const FSTM_CENTER = { latitude: 33.70651, longitude: -7.35316 };

const CAMPUS_PLACES = [
  { id: 1,  name: "Amphi α (Alpha)",   latitude: 33.70580, longitude: -7.35458, icon: "🎓" },
  { id: 2,  name: "Amphi β (Beta)",    latitude: 33.70588, longitude: -7.35439, icon: "🎓" },
  { id: 12, name: "Décanat",           latitude: 33.70620, longitude: -7.35380, icon: "🏛️" },
  { id: 13, name: "Bibliothèque",      latitude: 33.70600, longitude: -7.35400, icon: "📚" },
  { id: 14, name: "Scolarité",         latitude: 33.70610, longitude: -7.35420, icon: "📋" },
  { id: 15, name: "Buvette",           latitude: 33.70540, longitude: -7.35500, icon: "☕" },
  { id: 16, name: "Centre Copie",      latitude: 33.70530, longitude: -7.35510, icon: "🖨️" },
  { id: 17, name: "Centre Recherche",  latitude: 33.70630, longitude: -7.35360, icon: "🔬" },
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

const buildMapHTML = (places, userLat, userLon) => `
<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"/>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body, #map { width: 100%; height: 100%; }
  </style>
</head>
<body>
  <div id="map"></div>
  <script>
    var map = L.map('map', { zoomControl: true }).setView(
      [${FSTM_CENTER.latitude}, ${FSTM_CENTER.longitude}], 17
    );

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
      maxZoom: 20,
    }).addTo(map);

    // Marqueur utilisateur
    ${userLat && userLon ? `
    var userIcon = L.divIcon({
      html: '<div style="width:16px;height:16px;border-radius:50%;background:#0D47A1;border:3px solid white;box-shadow:0 0 6px rgba(0,0,0,0.4)"></div>',
      iconSize: [16, 16], iconAnchor: [8, 8], className: ''
    });
    var userMarker = L.marker([${userLat}, ${userLon}], { icon: userIcon })
      .addTo(map)
      .bindPopup('📍 Ma position');
    L.circle([${userLat}, ${userLon}], {
      radius: 40, color: '#0D47A1',
      fillColor: '#0D47A1', fillOpacity: 0.15, weight: 2
    }).addTo(map);
    ` : ''}

    // Marqueurs lieux
    var places = ${JSON.stringify(places)};
    var routeLayer = null;

    places.forEach(function(p) {
      var icon = L.divIcon({
        html: '<div style="font-size:22px;line-height:1;filter:drop-shadow(0 2px 3px rgba(0,0,0,0.3))">' + p.icon + '</div>',
        iconSize: [30, 30], iconAnchor: [15, 15], className: ''
      });
      L.marker([p.latitude, p.longitude], { icon: icon })
        .addTo(map)
        .bindPopup('<b>' + p.name + '</b>')
        .on('click', function() {
          window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'placeClick', id: p.id }));
        });
    });

    // ── Dessiner l'itinéraire reçu depuis RN ──────────────────
    function drawRoute(coords) {
      if (routeLayer) { map.removeLayer(routeLayer); }
      routeLayer = L.polyline(coords, {
        color: '#0D47A1',
        weight: 5,
        opacity: 0.85,
        lineJoin: 'round',
        lineCap: 'round',
      }).addTo(map);
      map.fitBounds(routeLayer.getBounds(), { padding: [40, 40] });
    }

    function clearRoute() {
      if (routeLayer) { map.removeLayer(routeLayer); routeLayer = null; }
    }

    // ── Messages depuis RN ────────────────────────────────────
    document.addEventListener('message', handleMsg);
    window.addEventListener('message', handleMsg);
    function handleMsg(e) {
      try {
        var data = JSON.parse(e.data);
        if (data.type === 'flyTo') {
          map.flyTo([data.lat, data.lng], 19, { animate: true, duration: 1 });
        }
        if (data.type === 'drawRoute') {
          drawRoute(data.coords);
        }
        if (data.type === 'clearRoute') {
          clearRoute();
        }
        if (data.type === 'fitUser') {
          map.flyTo([data.lat, data.lng], 17, { animate: true, duration: 1 });
        }
      } catch(err) {}
    }
  </script>
</body>
</html>
`;

export default function MapScreen({ route }) {
  const webViewRef = useRef(null);
  const [location, setLocation]           = useState(null);
  const [loading, setLoading]             = useState(true);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [favorites, setFavorites]         = useState([]);
  const [mapReady, setMapReady]           = useState(false);
  const [routeLoading, setRouteLoading]   = useState(false);
  const [routeInfo, setRouteInfo]         = useState(null); // { distance, duration }

  // ── Localisation ──────────────────────────────────────────────
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission refusée', 'Activez la localisation.');
        setLoading(false);
        return;
      }
      const loc = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      setLocation(loc.coords);
      setLoading(false);
    })();
  }, []);

  // ── Navigation depuis Timetable ───────────────────────────────
  useEffect(() => {
    const destination = route?.params?.destination;
    if (destination && mapReady) {
      const place = CAMPUS_PLACES.find(p => p.name === destination.name)
        || { ...destination, icon: '📍', id: 99 };
      setSelectedPlace(place);
      flyTo(place.latitude, place.longitude);
    }
  }, [route?.params?.destination, mapReady]);

  // ── Commandes vers WebView ────────────────────────────────────
  const sendToMap = (data) => {
    webViewRef.current?.injectJavaScript(`
      handleMsg({ data: '${JSON.stringify(data).replace(/'/g, "\\'")}' });
      true;
    `);
  };

  const flyTo = (lat, lng) => sendToMap({ type: 'flyTo', lat, lng });

  const goToMyLocation = () => {
    if (!location) return;
    setSelectedPlace(null);
    setRouteInfo(null);
    sendToMap({ type: 'clearRoute' });
    sendToMap({ type: 'fitUser', lat: location.latitude, lng: location.longitude });
  };

  // ── Fetch itinéraire OSRM ─────────────────────────────────────
  const fetchRoute = async (place) => {
    if (!location) {
      Alert.alert('Position inconnue', 'Active la localisation d\'abord.');
      return;
    }
    setRouteLoading(true);
    setRouteInfo(null);
    sendToMap({ type: 'clearRoute' });
    try {
      const url =
        `https://router.project-osrm.org/route/v1/foot/` +
        `${location.longitude},${location.latitude};` +
        `${place.longitude},${place.latitude}` +
        `?overview=full&geometries=geojson`;

      const res  = await fetch(url);
      const data = await res.json();

      if (data.code === 'Ok' && data.routes.length > 0) {
        const r = data.routes[0];

        // Convertir GeoJSON [lng, lat] → Leaflet [lat, lng]
        const coords = r.geometry.coordinates.map(([lng, lat]) => [lat, lng]);

        const distanceM  = Math.round(r.distance);
        const durationMin = Math.round(r.duration / 60);

        setRouteInfo({ distance: distanceM, duration: durationMin });
        sendToMap({ type: 'drawRoute', coords });
      } else {
        Alert.alert('Itinéraire', 'Impossible de calculer le chemin.');
      }
    } catch {
      Alert.alert('Erreur réseau', 'Vérifie ta connexion internet.');
    } finally {
      setRouteLoading(false);
    }
  };

  // ── Message WebView → RN ──────────────────────────────────────
  const onMessage = (event) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      if (data.type === 'placeClick') {
        const place = CAMPUS_PLACES.find(p => p.id === data.id);
        if (place) {
          setSelectedPlace(place);
          setRouteInfo(null);
          sendToMap({ type: 'clearRoute' });
        }
      }
    } catch {}
  };

  const toggleFavorite = (id) =>
    setFavorites(prev =>
      prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id]
    );

  const mapHTML = buildMapHTML(
    CAMPUS_PLACES,
    location?.latitude,
    location?.longitude
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }} edges={['top']}>

      {/* HEADER */}
      <View style={{
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#F0F0F0',
      }}>
        <Text style={{ fontSize: 18, fontWeight: '700', color: '#1A1A2E' }}>
          🗺️ Campus Navigator
        </Text>
        <Text style={{ fontSize: 12, color: '#888', marginTop: 2 }}>
          FST Mohammedia — Trouve ton chemin
        </Text>
      </View>

      {/* CARTE */}
      <View style={{ flex: 1 }}>
        {loading ? (
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            <ActivityIndicator size="large" color="#0D47A1" />
            <Text style={{ marginTop: 12, color: '#666' }}>Localisation en cours...</Text>
          </View>
        ) : (
          <WebView
            ref={webViewRef}
            source={{ html: mapHTML }}
            style={{ flex: 1 }}
            onMessage={onMessage}
            onLoadEnd={() => setMapReady(true)}
            javaScriptEnabled
            domStorageEnabled
            originWhitelist={['*']}
          />
        )}

        {/* Bouton ma position */}
        <TouchableOpacity
          onPress={goToMyLocation}
          style={{
            position: 'absolute', bottom: 16, right: 16,
            backgroundColor: '#fff', borderRadius: 30,
            width: 48, height: 48,
            justifyContent: 'center', alignItems: 'center',
            elevation: 5,
            shadowColor: '#000', shadowOpacity: 0.2,
            shadowOffset: { width: 0, height: 2 }, shadowRadius: 4,
          }}
        >
          <Text style={{ fontSize: 22 }}>📍</Text>
        </TouchableOpacity>
      </View>

      {/* CARTE LIEU SÉLECTIONNÉ */}
      {selectedPlace && (
        <View style={{
          backgroundColor: '#fff', padding: 16,
          borderTopWidth: 1, borderTopColor: '#F0F0F0', elevation: 10,
        }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 32, marginRight: 12 }}>{selectedPlace.icon}</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 16, fontWeight: '700', color: '#1A1A2E' }}>
                {selectedPlace.name}
              </Text>
              {location && (
                <Text style={{ fontSize: 13, color: '#666', marginTop: 2 }}>
                  📍 {getDistance(
                    location.latitude, location.longitude,
                    selectedPlace.latitude, selectedPlace.longitude
                  )} m
                </Text>
              )}
            </View>
            <TouchableOpacity onPress={() => toggleFavorite(selectedPlace.id)}>
              <Text style={{ fontSize: 26 }}>
                {favorites.includes(selectedPlace.id) ? '⭐' : '☆'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Info itinéraire */}
          {routeInfo && (
            <View style={{
              flexDirection: 'row', gap: 12, marginTop: 10,
              backgroundColor: '#F0F4FF', borderRadius: 10, padding: 10,
            }}>
              <Text style={{ color: '#0D47A1', fontWeight: '600' }}>
                🚶 {routeInfo.duration} min
              </Text>
              <Text style={{ color: '#0D47A1', fontWeight: '600' }}>
                📏 {routeInfo.distance} m
              </Text>
            </View>
          )}

          {/* Boutons */}
          <View style={{ flexDirection: 'row', gap: 10, marginTop: 12 }}>
            <TouchableOpacity
              onPress={() => fetchRoute(selectedPlace)}
              disabled={routeLoading}
              style={{
                flex: 1, backgroundColor: '#0D47A1',
                borderRadius: 10, paddingVertical: 12,
                alignItems: 'center',
              }}
            >
              {routeLoading
                ? <ActivityIndicator color="#fff" size="small" />
                : <Text style={{ color: '#fff', fontWeight: '700' }}>
                    🗺️ Itinéraire piéton
                  </Text>
              }
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setSelectedPlace(null);
                setRouteInfo(null);
                sendToMap({ type: 'clearRoute' });
              }}
              style={{
                borderRadius: 10, borderWidth: 1, borderColor: '#ddd',
                paddingVertical: 12, paddingHorizontal: 16, alignItems: 'center',
              }}
            >
              <Text style={{ color: '#666', fontWeight: '600' }}>✕</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* LISTE LIEUX */}
      {!selectedPlace && (
        <ScrollView style={{ maxHeight: 220 }} showsVerticalScrollIndicator={false}>
          <Text style={{
            paddingHorizontal: 16, paddingTop: 12,
            fontWeight: '700', color: '#1A1A2E', fontSize: 14,
          }}>
            Lieux — FST Mohammedia
          </Text>
          {CAMPUS_PLACES.map(place => (
            <TouchableOpacity
              key={place.id}
              style={{
                flexDirection: 'row', alignItems: 'center',
                paddingHorizontal: 16, paddingVertical: 10,
                borderBottomWidth: 1, borderBottomColor: '#F5F5F5',
              }}
              onPress={() => {
                setSelectedPlace(place);
                flyTo(place.latitude, place.longitude);
              }}
            >
              <Text style={{ fontSize: 22, marginRight: 12 }}>{place.icon}</Text>
              <View style={{ flex: 1 }}>
                <Text style={{ fontWeight: '600', color: '#1A1A2E' }}>{place.name}</Text>
                {location && (
                  <Text style={{ fontSize: 12, color: '#999' }}>
                    {getDistance(
                      location.latitude, location.longitude,
                      place.latitude, place.longitude
                    )} m
                  </Text>
                )}
              </View>
              <TouchableOpacity onPress={() => toggleFavorite(place.id)}>
                <Text style={{ fontSize: 20 }}>
                  {favorites.includes(place.id) ? '⭐' : '☆'}
                </Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
          <View style={{ height: 20 }} />
        </ScrollView>
      )}

    </SafeAreaView>
  );
}