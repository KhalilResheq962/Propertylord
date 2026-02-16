import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Container, Card, Badge, Button } from 'react-bootstrap';
import { Navigation } from 'lucide-react';
import 'leaflet/dist/leaflet.css';
import axiosInstance from '../api/axiosInstance';
import { Property } from '../types/property';
import { createPropertyIcon } from '../utils/mapIcons';
import { Link } from 'react-router-dom';

const MapComponent = () => {
  const [properties, setProperties] = useState<Property[]>([
    {
      _id: '65c8f8f8f8f8f8f8f8f8f8f1',
      address: 'The Ritz-Carlton Residences, Amman, Jordan',
      description: 'Experience unparalleled luxury in the heart of Amman.',
      price: 1500000,
      type: 'apartment',
      status: 'for-sale',
      bedrooms: 4,
      bathrooms: 5,
      images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=2070'],
      location: { type: 'Point', coordinates: [35.885, 31.955] }
    },
    {
      _id: '65c8f8f8f8f8f8f8f8f8f8f2',
      address: 'Luxury Villa, Abdoun, Amman',
      description: 'Modern villa with a private pool.',
      price: 850000,
      type: 'house',
      status: 'for-sale',
      bedrooms: 5,
      bathrooms: 4,
      images: ['https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&q=80&w=2071'],
      location: { type: 'Point', coordinates: [35.885, 31.935] }
    }
  ]);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await axiosInstance.get('/properties');
        if (Array.isArray(response.data)) {
          setProperties(prev => {
            const apiProps = response.data.filter(p => 
              !prev.find(existing => existing.address === p.address)
            );
            return [...prev, ...apiProps];
          });
        }
      } catch (error) {
        console.error('Error fetching map markers:', error);
      }
    };
    fetchLocations();
  }, []);

  return (
    <Container id="map" className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0 d-flex align-items-center fw-bold text-dark">
          <Navigation className="me-2 text-primary" /> Property Map Explorer
        </h2>
        <div className="small text-muted bg-white px-3 py-1 rounded-pill shadow-sm border fw-bold">
          {properties.length} Properties in View
        </div>
      </div>
      
      <Card className="shadow-sm overflow-hidden border-0" style={{ height: '600px', borderRadius: '24px' }}>
        <MapContainer 
          center={[31.9454, 35.9284]} 
          zoom={12} 
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={false}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
          />
          
          {properties.map(property => (
            property.location?.coordinates && property.location.coordinates.length === 2 && (
              <Marker 
                key={property._id} 
                position={[property.location.coordinates[1], property.location.coordinates[0]] as [number, number]}
                icon={createPropertyIcon(property.price, property.status, true)}
              >
                <Popup className="property-popup">
                  <div className="p-2" style={{ minWidth: '180px' }}>
                    <div className="mb-2 overflow-hidden rounded-3" style={{ height: '100px' }}>
                      <img src={property.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    </div>
                    <h6 className="fw-bold mb-1 text-dark small text-truncate">{property.address}</h6>
                    <div className="d-flex justify-content-between align-items-center mt-2">
                      <span className="text-primary fw-bold small">JOD {property.price.toLocaleString()}</span>
                      <Badge bg={property.status === 'for-sale' ? 'primary' : 'success'} className="small rounded-pill" style={{ fontSize: '9px' }}>
                        {property.status === 'for-sale' ? 'Sale' : 'Rent'}
                      </Badge>
                    </div>
                    <Button as={Link} to={`/property/${property._id}`} size="sm" variant="primary" className="w-100 mt-2 rounded-pill fw-bold" style={{ fontSize: '10px' }}>
                      View Property
                    </Button>
                  </div>
                </Popup>
              </Marker>
            )
          ))}
        </MapContainer>
      </Card>
    </Container>
  );
};

export default MapComponent;
