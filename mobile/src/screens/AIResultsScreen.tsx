import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, Image, ScrollView, ActivityIndicator } from 'react-native';
import { Text, Card, Button, IconButton } from 'react-native-paper';
import { Bed, Bath, Tag, Sparkles, ChevronLeft, Info, Search } from 'lucide-react-native';
import axiosInstance from '../api/axiosInstance';
import { Property } from '../types/property';

const AIResultsScreen = ({ route, navigation }: any) => {
  const { q } = route.params;
  const [loading, setLoading] = useState(true);
  const [recommendation, setRecommendation] = useState<any>(null);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);
  const [allProperties, setAllProperties] = useState<Property[]>([]);

  useEffect(() => {
    const getRecommendations = async () => {
      try {
        const recResponse = await axiosInstance.post('/ai/recommend', { requirements: q });
        const filters = recResponse.data;
        setRecommendation(filters);

        const propResponse = await axiosInstance.get('/properties');
        const data = Array.isArray(propResponse.data) ? propResponse.data : [];
        setAllProperties(data);
        
        const filtered = data.filter((p: Property) => {
          let match = true;
          if (filters.minBedrooms && p.bedrooms < filters.minBedrooms) match = false;
          if (filters.minPrice && p.price < filters.minPrice) match = false;
          if (filters.maxPrice && p.price > filters.maxPrice) match = false;
          if (filters.propertyType && p.type !== filters.propertyType) match = false;
          if (filters.status && p.status !== filters.status) match = false;
          if (filters.area && !p.address.toLowerCase().includes(filters.area.toLowerCase())) match = false;
          return match;
        });

        setFilteredProperties(filtered);
      } catch (error) {
        console.error('AI Recommendation failed:', error);
      } finally {
        setLoading(false);
      }
    };

    getRecommendations();
  }, [q]);

  const renderProperty = ({ item }: { item: Property }) => (
    <Card 
      style={styles.card} 
      onPress={() => navigation.navigate('Details', { id: item._id })}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: item.images[0] }} style={styles.image} />
        <View style={styles.priceBadge}>
          <Text style={styles.priceText}>JOD {item.price.toLocaleString()}</Text>
        </View>
      </View>
      <Card.Content style={styles.content}>
        <Text style={styles.address} numberOfLines={1}>{item.address}</Text>
        <View style={styles.specs}>
          <View style={styles.specItem}><Bed size={14} color="#64748b" /><Text style={styles.specText}>{item.bedrooms}</Text></View>
          <View style={styles.specItem}><Bath size={14} color="#64748b" /><Text style={styles.specText}>{item.bathrooms}</Text></View>
          <View style={styles.typeLabel}><Text style={styles.typeText}>{item.type}</Text></View>
        </View>
      </Card.Content>
    </Card>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Sparkles size={60} color="#ff6b00" />
        <Text style={styles.loadingTitle}>AI Agent is thinking...</Text>
        <Text style={styles.loadingSubtitle}>Finding your perfect match in Jordan</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <IconButton icon="chevron-left" size={28} onPress={() => navigation.goBack()} />
        <View style={styles.headerText}>
          <Text style={styles.title}>AI Recommendations</Text>
          <Text style={styles.subtitle} numberOfLines={1}>"{q}"</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {recommendation && (
          <View style={styles.aiInsight}>
            <View style={styles.insightHeader}>
              <Sparkles size={18} color="#ff6b00" />
              <Text style={styles.insightTitle}>AI INSIGHT</Text>
            </View>
            <Text style={styles.insightText}>{recommendation.explanation}</Text>
          </View>
        )}

        {filteredProperties.length > 0 ? (
          <>
            <Text style={styles.resultsLabel}>{filteredProperties.length} Perfect Matches</Text>
            {filteredProperties.map(item => (
              <View key={item._id}>{renderProperty({ item })}</View>
            ))}
          </>
        ) : (
          <View style={styles.emptyContainer}>
            <Search size={60} color="#e2e8f0" />
            <Text style={styles.emptyTitle}>No direct matches</Text>
            <Text style={styles.emptySubtitle}>But here are some similar premium options:</Text>
            
            <View style={styles.alternatives}>
              {allProperties.slice(0, 3).map(item => (
                <View key={item._id}>{renderProperty({ item })}</View>
              ))}
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  loadingTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginTop: 20,
    color: '#0f172a',
  },
  loadingSubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 50,
    paddingBottom: 15,
    backgroundColor: '#ffffff',
    paddingHorizontal: 10,
  },
  headerText: {
    marginLeft: 4,
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748b',
  },
  scrollContent: {
    padding: 20,
  },
  aiInsight: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 20,
    marginBottom: 24,
    borderLeftWidth: 5,
    borderLeftColor: '#ff6b00',
    elevation: 2,
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    gap: 8,
  },
  insightTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#ff6b00',
    letterSpacing: 1,
  },
  insightText: {
    fontSize: 15,
    color: '#334155',
    lineHeight: 22,
    fontWeight: '500',
  },
  resultsLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#0f172a',
  },
  card: {
    marginBottom: 16,
    borderRadius: 16,
    backgroundColor: '#ffffff',
    overflow: 'hidden',
  },
  imageContainer: {
    height: 160,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  priceBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: '#ff6b00',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  priceText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 12,
  },
  content: {
    paddingTop: 12,
  },
  address: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  specs: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 12,
  },
  specItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  specText: {
    color: '#64748b',
    fontWeight: '600',
    fontSize: 12,
  },
  typeLabel: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
  },
  typeText: {
    color: '#475569',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'capitalize',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 16,
    color: '#0f172a',
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#64748b',
    marginTop: 8,
    marginBottom: 30,
    textAlign: 'center',
  },
  alternatives: {
    width: '100%',
  }
});

export default AIResultsScreen;