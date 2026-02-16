import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView, TextInput, Alert, Image } from 'react-native';
import { WebView } from 'react-native-webview';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';

// Leaflet Map HTML for WebView
const getMapHTML = (lat: number, lng: number) => `
  <!DOCTYPE html>
  <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        body { margin: 0; padding: 0; }
        #map { height: 100vh; width: 100vw; }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var map = L.map('map', {
          center: [${lat}, ${lng}],
          zoom: 17,
          zoomControl: false,
          attributionControl: false
        });
        
        // Detailed Roadmap style with cafes, shops, and labels
        L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}').addTo(map);
        
        var marker = L.marker([${lat}, ${lng}], { draggable: true }).addTo(map);
        
        function onMapClick(e) {
          marker.setLatLng(e.latlng);
          // Do NOT call setView here to preserve zoom
          window.ReactNativeWebView.postMessage(JSON.stringify({
            lat: e.latlng.lat,
            lng: e.latlng.lng
          }));
        }

        map.on('click', onMapClick);
        marker.on('dragend', function(e) {
          window.ReactNativeWebView.postMessage(JSON.stringify({
            lat: e.target.getLatLng().lat,
            lng: e.target.getLatLng().lng
          }));
        });
      </script>
    </body>
  </html>
`;

// --- MOCK API DATA ---
const mockProperties = [
  { _id: '65c8f8f8f8f8f8f8f8f8f8f1', address: 'The Ritz-Carlton, Amman', price: 1500000, bedrooms: 4, bathrooms: 5, images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=2070'] }
];

export default function App() {
  const [view, setView] = useState<'home' | 'details' | 'login' | 'signup' | 'create' | 'ai-results'>('home');
  const [selectedProperty, setSelectedProperty] = useState<any>(null);
  const [properties, setProperties] = useState(mockProperties);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // AI Search State
  const [aiMode, setAiMode] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [recommendations, setRecommendations] = useState([]);
  const [aiExplanation, setAiExplanation] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  // AI Redesign State
  const [redesignImage, setRedesignImage] = useState<any>(null);
  const [redesignResult, setRedesignResult] = useState<any>(null);
  const [redesignLoading, setRedesignLoading] = useState(false);

  // Detail View Tabs
  const [detailTab, setDetailTab] = useState<'info' | 'map' | 'tour'>('info');

  // Form States
  const [pass, setPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');

  // Create Property Form
  const [newProp, setNewProp] = useState({
    address: '',
    price: '',
    description: '',
    bedrooms: '1',
    bathrooms: '1',
    type: 'apartment',
    status: 'for-sale',
    virtualTourUrl: '',
    lat: 31.9454,
    lng: 35.9284
  });
  const [images, setImages] = useState<any[]>([]);

  // Memoize the Map HTML at the top level so it never changes order
  const memoizedMap = useMemo(() => getMapHTML(31.9454, 35.9284), []);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get('http://10.0.2.2:3000/properties');
        setProperties(res.data);
      } catch (e) {
        console.log("Using mock data");
      }
    };
    fetch();
  }, []);

  const handleAISearch = async () => {
    if (!prompt.trim()) return;
    setAiLoading(true);
    setView('ai-results');
    try {
      const response = await axios.post('http://10.0.2.2:3000/ai/recommend', { requirements: prompt });
      const filters = response.data;
      setAiExplanation(filters.explanation);
      
      const matched = properties.filter((p: any) => {
        let m = true;
        if (filters.minBedrooms && p.bedrooms < filters.minBedrooms) m = false;
        if (filters.area && !p.address.toLowerCase().includes(filters.area.toLowerCase())) m = false;
        return m;
      });
      setRecommendations(matched as any);
    } catch (e) {
      setAiExplanation("I'll show you similar premium properties.");
      setRecommendations(properties.slice(0, 2) as any);
    } finally {
      setAiLoading(false);
    }
  };

  const pickImages = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsMultipleSelection: true,
      selectionLimit: 5,
      quality: 0.7,
    });
    if (!result.canceled) setImages(result.assets);
  };

  const handleCreateProperty = async () => {
    if (!newProp.address || !newProp.price || images.length === 0) {
      Alert.alert("Error", "Fill details and add images.");
      return;
    }
    const data = new FormData();
    Object.keys(newProp).forEach(key => data.append(key, (newProp as any)[key]));
    data.append('location', JSON.stringify({ type: 'Point', coordinates: [newProp.lng, newProp.lat] }));
    images.forEach((img, i) => {
      data.append('images', { uri: img.uri, type: 'image/jpeg', name: `p_${i}.jpg` } as any);
    });

    try {
      setLoading(true);
      await axios.post('http://10.0.2.2:3000/properties', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      Alert.alert("Success", "Listing published!");
      setView('home');
    } catch (e) {
      Alert.alert("Error", "Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleRedesign = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled) {
      setRedesignImage(result.assets[0].uri);
      setRedesignLoading(true);
      
      const data = new FormData();
      data.append('image', {
        uri: result.assets[0].uri,
        type: 'image/jpeg',
        name: 'room.jpg',
      } as any);
      data.append('style', 'Modern Scandinavian');

      try {
        const res = await axios.post('http://10.0.2.2:3000/ai/redesign', data, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        setRedesignResult(res.data);
      } catch (e) {
        Alert.alert("Error", "AI analysis failed.");
      } finally {
        setRedesignLoading(false);
      }
    }
  };

  const onMapMessage = (event: any) => {
    const coords = JSON.parse(event.nativeEvent.data);
    setNewProp(prev => ({ ...prev, lat: coords.lat, lng: coords.lng }));
    axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${coords.lat}&lon=${coords.lng}`)
      .then(res => setNewProp(prev => ({ ...prev, address: res.data.display_name })));
  };

  if (view === 'create') {
    return (
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <TouchableOpacity style={styles.backBtn} onPress={() => setView('home')}><Text style={styles.backText}>← Cancel</Text></TouchableOpacity>
          <Text style={styles.title}>Add Property</Text>
          <View style={styles.inputWrap}>
            <Text style={styles.label}>Location (Tap to Pin)</Text>
            <View style={{ height: 300, borderRadius: 20, overflow: 'hidden', marginBottom: 15, borderWidth: 1, borderColor: '#eee' }}>
              <WebView 
                source={{ html: memoizedMap }} 
                onMessage={onMapMessage}
                scrollEnabled={false}
              />
            </View>
            <Text style={styles.label}>Address</Text>
            <TextInput style={styles.input} value={newProp.address} onChangeText={t => setNewProp({...newProp, address: t})} />
            <Text style={styles.label}>Price (JOD)</Text>
            <TextInput style={styles.input} keyboardType="numeric" value={newProp.price} onChangeText={t => setNewProp({...newProp, price: t})} />
            <Text style={styles.label}>Photos</Text>
            <TouchableOpacity style={styles.imagePicker} onPress={pickImages}><Text style={{color:'#ff6b00', fontWeight:'bold'}}>+ Select Photos</Text></TouchableOpacity>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              {images.map((img, i) => <Image key={i} source={{ uri: img.uri }} style={{ width: 50, height: 50, borderRadius: 10 }} />)}
            </View>
          </View>
          <TouchableOpacity style={styles.primaryBtn} onPress={handleCreateProperty}>
            <Text style={styles.btnText}>{loading ? 'Publishing...' : 'Publish Ad'}</Text>
          </TouchableOpacity>
          <View style={{ height: 50 }} />
        </ScrollView>
      </View>
    );
  }

  if (view === 'ai-results') {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.backBtn} onPress={() => setView('home')}><Text style={styles.backText}>← Back</Text></TouchableOpacity>
        <Text style={styles.title}>AI Results</Text>
        <View style={styles.insightCard}><Text style={styles.insightTitle}>✨ INSIGHT</Text><Text style={styles.insightText}>{aiExplanation}</Text></View>
        <FlatList data={recommendations} keyExtractor={(item:any)=>item._id} renderItem={({item})=>(
          <TouchableOpacity style={styles.card} onPress={()=>{setSelectedProperty(item); setView('details');}}>
            <Text style={styles.price}>JOD {item.price}</Text><Text>{item.address}</Text>
          </TouchableOpacity>
        )}/>
      </View>
    );
  }

  if (view === 'details' && selectedProperty) {
    return (
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <TouchableOpacity style={styles.backBtn} onPress={() => { setView('home'); setDetailTab('info'); setRedesignResult(null); setRedesignImage(null); }}>
            <Text style={styles.backText}>← Back to Amman Listings</Text>
          </TouchableOpacity>
          
          <Image source={{ uri: selectedProperty.images?.[0] || 'https://via.placeholder.com/400x200' }} style={{ width: '100%', height: 250, borderRadius: 25, marginBottom: 20 }} />

          <View style={styles.tabToggle}>
            <TouchableOpacity style={[styles.tabBtn, detailTab === 'info' && styles.tabBtnActive]} onPress={() => setDetailTab('info')}><Text style={[styles.tabText, detailTab === 'info' && styles.tabTextActive]}>Explorer</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.tabBtn, detailTab === 'map' && styles.tabBtnActive]} onPress={() => setDetailTab('map')}><Text style={[styles.tabText, detailTab === 'map' && styles.tabTextActive]}>Map</Text></TouchableOpacity>
            {selectedProperty.virtualTourUrl ? (
              <TouchableOpacity style={[styles.tabBtn, detailTab === 'tour' && styles.tabBtnActive]} onPress={() => setDetailTab('tour')}><Text style={[styles.tabText, detailTab === 'tour' && styles.tabTextActive]}>3D Tour</Text></TouchableOpacity>
            ) : null}
          </View>

          {detailTab === 'info' && (
            <View>
              <Text style={styles.detailPrice}>JOD {selectedProperty.price.toLocaleString()}</Text>
              <Text style={styles.detailAddress}>{selectedProperty.address}</Text>
              
              <View style={styles.specsRow}>
                <View style={styles.specBox}><Text style={styles.specBoxVal}>{selectedProperty.bedrooms}</Text><Text style={styles.specBoxLab}>Beds</Text></View>
                <View style={styles.specBox}><Text style={styles.specBoxVal}>{selectedProperty.bathrooms}</Text><Text style={styles.specBoxLab}>Baths</Text></View>
                <View style={styles.specBox}><Text style={styles.specBoxVal}>{selectedProperty.type}</Text><Text style={styles.specBoxLab}>Type</Text></View>
              </View>

              <Text style={styles.sectionTitle}>Description</Text>
              <Text style={styles.description}>{selectedProperty.description || "No description available."}</Text>

              <View style={styles.aiRedesignCard}>
                <Text style={styles.aiRedesignTitle}>✨ AI Interior Designer</Text>
                <Text style={styles.aiRedesignSub}>Upload a photo of any room to get instant AI furniture & style suggestions.</Text>
                
                {redesignImage && <Image source={{ uri: redesignImage }} style={{ width: '100%', height: 180, borderRadius: 15, marginVertical: 15 }} />}
                
                {redesignLoading ? <Text style={{color: '#ff6b00', fontWeight: 'bold'}}>AI is analyzing your room...</Text> : (
                  redesignResult ? (
                    <View style={styles.resultBox}>
                      <Text style={styles.resultText}>{redesignResult.suggestions}</Text>
                    </View>
                  ) : (
                    <TouchableOpacity style={styles.aiActionBtn} onPress={handleRedesign}>
                      <Text style={styles.btnText}>Start AI Redesign</Text>
                    </TouchableOpacity>
                  )
                )}
              </View>
            </View>
          )}

          {detailTab === 'map' && (
            <View style={{ height: 400, borderRadius: 25, overflow: 'hidden', backgroundColor: '#eee' }}>
              <WebView 
                source={{ html: getMapHTML(selectedProperty.location?.coordinates?.[1] || 31.9454, selectedProperty.location?.coordinates?.[0] || 35.9284) }} 
                scrollEnabled={true}
              />
            </View>
          )}

          {detailTab === 'tour' && (
            <View style={{ height: 500, borderRadius: 25, overflow: 'hidden' }}>
              <WebView source={{ uri: selectedProperty.virtualTourUrl }} />
            </View>
          )}

          <View style={{ height: 100 }} />
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity style={[styles.primaryBtn, { flex: 1, backgroundColor: '#10b981' }]} onPress={() => Alert.alert("WhatsApp", "Opening WhatsApp...")}>
            <Text style={styles.btnText}>WhatsApp</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.primaryBtn, { flex: 1 }]} onPress={() => Alert.alert("Call", "Calling Agent...")}>
            <Text style={styles.btnText}>Call Agent</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (view === 'login') {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.backBtn} onPress={() => setView('home')}><Text style={styles.backText}>← Cancel</Text></TouchableOpacity>
        <Text style={styles.title}>Login</Text>
        <View style={styles.inputWrap}>
          <Text style={styles.label}>Email</Text>
          <TextInput style={styles.input} placeholder="Email..." />
          <Text style={styles.label}>Password</Text>
          <TextInput style={styles.input} secureTextEntry placeholder="Password..." />
        </View>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => { setUser({name: 'Demo'}); setView('home'); }}><Text style={styles.btnText}>Sign In</Text></TouchableOpacity>
        <TouchableOpacity style={{ marginTop: 20, alignItems: 'center' }} onPress={() => setView('signup')}><Text style={{ color: '#64748b' }}>No account? <Text style={{ color: '#ff6b00', fontWeight: 'bold' }}>Sign Up</Text></Text></TouchableOpacity>
      </View>
    );
  }

  if (view === 'signup') {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.backBtn} onPress={() => setView('login')}><Text style={styles.backText}>← Back</Text></TouchableOpacity>
        <Text style={styles.title}>Join Us</Text>
        <View style={styles.inputWrap}>
          <Text style={styles.label}>Name</Text><TextInput style={styles.input} />
          <Text style={styles.label}>Email</Text><TextInput style={styles.input} />
          <Text style={styles.label}>Password</Text><TextInput style={styles.input} secureTextEntry value={pass} onChangeText={setPass} />
          <Text style={styles.label}>Confirm</Text><TextInput style={styles.input} secureTextEntry value={confirmPass} onChangeText={setConfirmPass} />
        </View>
        <TouchableOpacity style={styles.primaryBtn} onPress={() => { if(pass!==confirmPass) return Alert.alert("Error","Mismatch"); setUser({name: 'New'}); setView('home'); }}><Text style={styles.btnText}>Register</Text></TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <View>
            <Text style={styles.title}>Property Finder</Text>
            <Text style={styles.subtitle}>Jordan's AI Portal</Text>
          </View>
          <TouchableOpacity style={styles.authBtn} onPress={() => user ? setUser(null) : setView('login')}>
            <Text style={styles.authBtnText}>{user ? 'Log Out' : 'Log In'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.searchWrap}>
        <View style={styles.tabToggle}>
          <TouchableOpacity style={[styles.tabBtn, aiMode && styles.tabBtnActive]} onPress={() => setAiMode(true)}><Text style={[styles.tabText, aiMode && styles.tabTextActive]}>AI Agent</Text></TouchableOpacity>
          <TouchableOpacity style={[styles.tabBtn, !aiMode && styles.tabBtnActive]} onPress={() => setAiMode(false)}><Text style={[styles.tabText, !aiMode && styles.tabTextActive]}>Classic</Text></TouchableOpacity>
        </View>
        <TextInput style={styles.searchInput} placeholder={aiMode ? "Tell AI your needs..." : "Search..."} value={prompt} onChangeText={setPrompt} />
        {aiMode && prompt.length > 0 && <TouchableOpacity style={styles.aiActionBtn} onPress={handleAISearch}><Text style={styles.btnText}>Ask AI agent</Text></TouchableOpacity>}
      </View>

      <TouchableOpacity style={styles.fab} onPress={() => setView('create')}><Text style={styles.fabText}>+ Add Property</Text></TouchableOpacity>

      <FlatList
        data={properties}
        keyExtractor={(item) => item._id}
        contentContainerStyle={{ paddingBottom: 40 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => { setSelectedProperty(item); setView('details'); }}>
            <Text style={styles.price}>JOD {item.price?.toLocaleString()}</Text>
            <Text style={styles.address}>{item.address}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc', paddingHorizontal: 20, paddingTop: 60 },
  header: { marginBottom: 20 },
  title: { fontSize: 26, fontWeight: 'bold', color: '#0f172a' },
  subtitle: { fontSize: 14, color: '#64748b' },
  card: { backgroundColor: '#fff', padding: 20, borderRadius: 20, marginBottom: 15, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10 },
  price: { color: '#ff6b00', fontWeight: 'bold', fontSize: 20, marginBottom: 5 },
  address: { fontSize: 15, color: '#334155', fontWeight: '500' },
  backBtn: { marginBottom: 15 },
  backText: { color: '#ff6b00', fontWeight: 'bold' },
  detailAddress: { fontSize: 22, fontWeight: 'bold', color: '#0f172a', marginBottom: 5 },
  detailPrice: { fontSize: 20, color: '#ff6b00', fontWeight: 'bold' },
  authBtn: { backgroundColor: '#f1f5f9', paddingHorizontal: 15, paddingVertical: 8, borderRadius: 10 },
  authBtnText: { color: '#0f172a', fontWeight: '600', fontSize: 13 },
  fab: { backgroundColor: '#ff6b00', padding: 15, borderRadius: 15, marginBottom: 20, alignItems: 'center' },
  fabText: { color: '#fff', fontWeight: 'bold' },
  inputWrap: { marginTop: 20, marginBottom: 20 },
  label: { fontSize: 11, fontWeight: 'bold', color: '#64748b', marginBottom: 8, textTransform: 'uppercase' },
  input: { backgroundColor: '#fff', height: 50, borderRadius: 12, paddingHorizontal: 15, marginBottom: 15, borderWidth: 1, borderColor: '#e2e8f0' },
  primaryBtn: { backgroundColor: '#ff6b00', height: 55, borderRadius: 15, justifyContent: 'center', alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: 'bold' },
  imagePicker: { backgroundColor: '#fff', borderStyle: 'dashed', borderWidth: 2, borderColor: '#ff6b00', height: 60, borderRadius: 15, justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  searchWrap: { backgroundColor: '#fff', paddingBottom: 20, marginBottom: 20, borderRadius: 20, elevation: 3 },
  tabToggle: { flexDirection: 'row', backgroundColor: '#f1f5f9', marginHorizontal: 15, marginBottom: 15, marginTop: 15, borderRadius: 12, padding: 4 },
  tabBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 10 },
  tabBtnActive: { backgroundColor: '#ff6b00' },
  tabText: { fontWeight: '600', color: '#64748b', fontSize: 12 },
  tabTextActive: { color: '#fff' },
  searchInput: { backgroundColor: '#f8fafc', height: 50, marginHorizontal: 15, borderRadius: 12, paddingHorizontal: 15, borderWidth: 1, borderColor: '#e2e8f0' },
  aiActionBtn: { backgroundColor: '#ff6b00', marginHorizontal: 15, marginTop: 12, height: 50, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  insightCard: { backgroundColor: '#fff', padding: 20, borderRadius: 20, marginBottom: 20, borderLeftWidth: 5, borderLeftColor: '#ff6b00' },
    insightTitle: { fontSize: 11, fontWeight: 'bold', color: '#ff6b00', marginBottom: 5 },
    insightText: { fontSize: 14, color: '#334155', fontWeight: '500' },
    specsRow: { flexDirection: 'row', gap: 12, marginTop: 20, marginBottom: 25 },
    specBox: { flex: 1, backgroundColor: '#f1f5f9', padding: 15, borderRadius: 18, alignItems: 'center' },
    specBoxVal: { fontSize: 18, fontWeight: 'bold', color: '#0f172a' },
    specBoxLab: { fontSize: 12, color: '#64748b', marginTop: 2 },
    sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#0f172a', marginBottom: 10 },
    description: { fontSize: 15, color: '#475569', lineHeight: 24 },
    aiRedesignCard: { backgroundColor: '#0f172a', padding: 20, borderRadius: 25, marginTop: 30 },
    aiRedesignTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
    aiRedesignSub: { color: '#94a3b8', fontSize: 14, lineHeight: 20 },
    resultBox: { backgroundColor: 'rgba(255,255,255,0.05)', padding: 15, borderRadius: 15, marginTop: 15 },
    resultText: { color: '#e2e8f0', fontSize: 14, lineHeight: 22 },
    footer: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#fff', padding: 20, paddingBottom: 40, flexDirection: 'row', gap: 15, borderTopWidth: 1, borderTopColor: '#f1f5f9' }
  });
  