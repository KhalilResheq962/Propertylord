import React from 'react';
import { View, StyleSheet, ScrollView, Image, Dimensions } from 'react-native';
import { Text, Button, Divider } from 'react-native-paper';
import { MapPin, Bed, Bath, Tag, Share2, Heart } from 'lucide-react-native';

const { width } = Dimensions.get('window');

const PropertyDetailsScreen = ({ route, navigation }: any) => {
  const { id } = route.params;
  
  // Placeholder - In real app, fetch by ID
  const property = {
    address: 'The Ritz-Carlton Residences, Amman',
    price: 1500000,
    bedrooms: 4,
    bathrooms: 5,
    description: 'Experience unparalleled luxury in the heart of Amman. Fully serviced by Ritz-Carlton staff with world-class amenities.',
    type: 'Apartment',
    status: 'for-sale',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=2070'
  };

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: property.image }} style={styles.image} />
          <View style={styles.statusLabel}>
            <Text style={styles.statusText}>PREMIUM</Text>
          </View>
        </View>

        <View style={styles.detailsContainer}>
          <View style={styles.headerRow}>
            <Text style={styles.price}>JOD {property.price.toLocaleString()}</Text>
            <View style={styles.actionButtons}>
              <Heart size={24} color="#0f172a" />
              <Share2 size={24} color="#0f172a" style={{ marginLeft: 16 }} />
            </View>
          </View>

          <Text style={styles.address}>{property.address}</Text>
          <View style={styles.locationRow}>
            <MapPin size={16} color="#64748b" />
            <Text style={styles.locationText}>Amman, Jordan</Text>
          </View>

          <View style={styles.grid}>
            <View style={styles.gridItem}>
              <Bed size={24} color="#ff6b00" />
              <Text style={styles.gridValue}>{property.bedrooms}</Text>
              <Text style={styles.gridLabel}>Beds</Text>
            </View>
            <View style={styles.gridItem}>
              <Bath size={24} color="#ff6b00" />
              <Text style={styles.gridValue}>{property.bathrooms}</Text>
              <Text style={styles.gridLabel}>Baths</Text>
            </View>
            <View style={styles.gridItem}>
              <Tag size={24} color="#ff6b00" />
              <Text style={styles.gridValue}>{property.type}</Text>
              <Text style={styles.gridLabel}>Type</Text>
            </View>
          </View>

          <Divider style={styles.divider} />

          <Text style={styles.sectionTitle}>Description</Text>
          <Text style={styles.description}>{property.description}</Text>

          <Button 
            mode="contained" 
            onPress={() => {}} 
            style={styles.aiButton}
          >
            AI Interior Redesign
          </Button>
        </View>
      </ScrollView>

      <View style={styles.footer}>
        <Button mode="outlined" style={styles.whatsappButton} textColor="#10b981">
          WhatsApp
        </Button>
        <Button mode="contained" style={styles.callButton}>
          Call Agent
        </Button>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  imageContainer: {
    width: width,
    height: 300,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  statusLabel: {
    position: 'absolute',
    top: 20,
    right: 20,
    backgroundColor: '#ff6b00',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 10,
  },
  detailsContainer: {
    padding: 20,
    marginTop: -20,
    backgroundColor: '#ffffff',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#ff6b00',
  },
  actionButtons: {
    flexDirection: 'row',
  },
  address: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#0f172a',
    marginTop: 10,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  locationText: {
    color: '#64748b',
    marginLeft: 4,
    fontSize: 14,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  gridItem: {
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 16,
    borderRadius: 16,
    width: (width - 60) / 3,
  },
  gridValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
    marginTop: 8,
  },
  gridLabel: {
    fontSize: 12,
    color: '#64748b',
  },
  divider: {
    marginVertical: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 12,
  },
  description: {
    fontSize: 15,
    lineHeight: 24,
    color: '#475569',
  },
  aiButton: {
    marginTop: 30,
    paddingVertical: 8,
    borderRadius: 12,
    backgroundColor: '#0f172a',
  },
  footer: {
    padding: 20,
    paddingBottom: 30,
    flexDirection: 'row',
    gap: 12,
    borderTopWidth: 1,
    borderTopColor: '#f1f5f9',
  },
  whatsappButton: {
    flex: 1,
    borderRadius: 12,
    borderColor: '#10b981',
    borderWidth: 1.5,
  },
  callButton: {
    flex: 1,
    borderRadius: 12,
    backgroundColor: '#ff6b00',
  },
});

export default PropertyDetailsScreen;
