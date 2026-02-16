import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, Text, TextInput } from 'react-native';
import { Card, Button, IconButton } from 'react-native-paper';
import { Bed, Bath, Tag, Search } from 'lucide-react-native';
import axiosInstance from '../api/axiosInstance';
import { Property } from '../types/property';

const HomeScreen = ({ navigation }: any) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAISearch, setIsAISearch] = useState(false);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axiosInstance.get('/properties');
        setProperties(response.data);
      } catch (error) {
        console.error('Error fetching properties:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  const renderProperty = ({ item }: { item: Property }) => (
    <Card 
      style={styles.card} 
      onPress={() => navigation.navigate('Details', { id: item._id })}
    >
      <View style={styles.imageContainer}>
        <Image 
          source={{ uri: item.images[0] || 'https://via.placeholder.com/400x200' }} 
          style={styles.image} 
        />
        <View style={[styles.statusLabel, { backgroundColor: item.status === 'for-rent' ? '#10b981' : '#ff6b00' }]}>
          <Text style={styles.statusText}>{item.status === 'for-sale' ? 'FOR SALE' : 'FOR RENT'}</Text>
        </View>
      </View>
      
      <Card.Content style={styles.content}>
        <Text style={styles.price}>JOD {item.price.toLocaleString()}</Text>
        <Text style={styles.address} numberOfLines={1}>{item.address}</Text>
        
        <View style={styles.specs}>
          <View style={styles.specItem}>
            <Bed size={16} color="#64748b" />
            <Text style={styles.specText}>{item.bedrooms}</Text>
          </View>
          <View style={styles.specItem}>
            <Bath size={16} color="#64748b" />
            <Text style={styles.specText}>{item.bathrooms}</Text>
          </View>
          <View style={styles.specItem}>
            <Tag size={16} color="#64748b" />
            <Text style={styles.specText}>{item.type}</Text>
          </View>
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.title}>Property Finder</Text>
            <Text style={styles.subtitle}>Jordan's AI Real Estate Hub</Text>
          </View>
          <IconButton icon="map-marker" iconColor="#ff6b00" size={24} onPress={() => {}} />
        </View>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.aiToggle}>
          <TouchableOpacity 
            onPress={() => setIsAISearch(true)}
            style={[styles.toggleBtn, isAISearch && styles.toggleBtnActive]}
          >
            <Text style={[styles.toggleText, isAISearch && styles.toggleTextActive]}>AI Agent</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            onPress={() => setIsAISearch(false)}
            style={[styles.toggleBtn, !isAISearch && styles.toggleBtnActive]}
          >
            <Text style={[styles.toggleText, !isAISearch && styles.toggleTextActive]}>Classic</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchBarWrap}>
          <Search size={20} color={isAISearch ? "#ff6b00" : "#64748b"} style={styles.searchIcon} />
          <TextInput
            placeholder={isAISearch ? "Describe your needs..." : "Search areas..."}
            onChangeText={setSearchQuery}
            value={searchQuery}
            style={styles.textInput}
            placeholderTextColor="#94a3b8"
          />
        </View>
      </View>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator animating={true} color="#ff6b00" size="large" />
        </View>
      ) : (
        <FlatList
          data={properties}
          renderItem={renderProperty}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.list}
          ListHeaderComponent={() => <Text style={styles.listTitle}>Latest in Amman</Text>}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { padding: 20, paddingTop: 60, backgroundColor: '#ffffff' },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 26, fontWeight: 'bold', color: '#0f172a' },
  subtitle: { fontSize: 14, color: '#64748b' },
  searchContainer: { backgroundColor: '#ffffff', paddingBottom: 20, borderBottomLeftRadius: 30, borderBottomRightRadius: 30, elevation: 4 },
  aiToggle: { flexDirection: 'row', backgroundColor: '#f1f5f9', marginHorizontal: 20, marginBottom: 15, borderRadius: 12, padding: 4 },
  toggleBtn: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 10 },
  toggleBtnActive: { backgroundColor: '#ff6b00' },
  toggleText: { fontWeight: '600', color: '#64748b' },
  toggleTextActive: { color: '#ffffff' },
  searchBarWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f8fafc', marginHorizontal: 20, borderRadius: 12, paddingHorizontal: 15, borderWidth: 1, borderColor: '#e2e8f0' },
  searchIcon: { marginRight: 10 },
  textInput: { flex: 1, height: 50, color: '#0f172a', fontWeight: '500' },
  list: { padding: 20 },
  listTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, color: '#0f172a' },
  card: { marginBottom: 20, borderRadius: 20, backgroundColor: '#ffffff', elevation: 2, overflow: 'hidden' },
  imageContainer: { height: 200 },
  image: { width: '100%', height: '100%' },
  statusLabel: { position: 'absolute', top: 12, left: 12, paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  statusText: { color: '#ffffff', fontWeight: 'bold', fontSize: 10 },
  content: { paddingTop: 15 },
  price: { fontSize: 22, fontWeight: 'bold', color: '#ff6b00' },
  address: { fontSize: 16, color: '#334155', marginVertical: 4, fontWeight: '600' },
  specs: { flexDirection: 'row', marginTop: 10, gap: 20 },
  specItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  specText: { color: '#64748b', fontSize: 14, fontWeight: '600' },
  loader: { flex: 1, justifyContent: 'center' },
});

export default HomeScreen;
