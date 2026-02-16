import { useState, useEffect } from 'react';
import { Carousel, Badge, Button, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { Bed, Bath, ChevronRight } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';
import { Property } from '../types/property';

const FeaturedCarousel = () => {
  const [properties, setProperties] = useState<Property[]>([]);

  useEffect(() => {
    const fetchLatest = async () => {
      try {
        const response = await axiosInstance.get('/properties');
        if (Array.isArray(response.data)) {
          const ritz = response.data.find(p => p._id === '65c8f8f8f8f8f8f8f8f8f8f1');
          const others = response.data.filter(p => p._id !== '65c8f8f8f8f8f8f8f8f8f8f1');
          
          const combined = ritz ? [ritz, ...others] : others;
          setProperties(combined.slice(0, 5));
        }
      } catch (error) {
        console.error('Error fetching carousel data:', error);
      }
    };
    fetchLatest();
  }, []);

  return (
    <Container className="my-5">
      <div className="d-flex justify-content-between align-items-end mb-4">
        <div>
          <Badge bg="primary" className="mb-2 px-3 py-2 rounded-pill fw-bold" style={{ fontSize: '10px', letterSpacing: '1px' }}>FEATURED SELECTIONS</Badge>
          <h2 className="fw-bold mb-0 text-dark">Discover Luxury in Jordan</h2>
        </div>
        <Button as={Link} to="/listings" variant="link" className="text-primary fw-bold text-decoration-none d-flex align-items-center hover-lift">
          Explore All Listings <ChevronRight size={18} className="ms-1" />
        </Button>
      </div>

      <Carousel interval={6000} indicators={false} className="shadow-lg rounded-5 overflow-hidden featured-carousel border-0">
        {properties.map(property => (
          <Carousel.Item key={property._id} style={{ height: '550px' }}>
            <img
              className="d-block w-100"
              src={property.images[0]}
              alt={property.address}
              style={{ objectFit: 'cover', height: '100%', filter: 'brightness(0.65)' }}
            />
            <Carousel.Caption className="text-start start-0 bottom-0 w-100 p-5" style={{ background: 'linear-gradient(transparent, rgba(15,23,42,0.9))' }}>
              <Container className="px-md-5">
                <div className="mb-3 animate__animated animate__fadeInUp">
                  <Badge bg="primary" className="me-2 px-3 py-2 rounded-pill fw-bold shadow-sm">{property.status === 'for-sale' ? 'FOR SALE' : 'FOR RENT'}</Badge>
                  <Badge bg="white" text="dark" className="px-3 py-2 rounded-pill fw-bold shadow-sm text-capitalize">{property.type}</Badge>
                </div>
                <h2 className="display-4 fw-extrabold mb-3 text-white animate__animated animate__fadeInUp animate__delay-1s" style={{ letterSpacing: '-1px' }}>{property.address}</h2>
                <div className="d-flex gap-4 mb-4 opacity-90 text-white animate__animated animate__fadeInUp animate__delay-1s">
                  <span className="d-flex align-items-center fw-semibold"><Bed size={22} className="me-2 text-primary" /> {property.bedrooms} Bedrooms</span>
                  <span className="d-flex align-items-center fw-semibold"><Bath size={22} className="me-2 text-primary" /> {property.bathrooms} Bathrooms</span>
                </div>
                <div className="d-flex align-items-center gap-4 animate__animated animate__fadeInUp animate__delay-2s">
                  <h3 className="text-white fw-extrabold mb-0 fs-2">JOD {property.price.toLocaleString()}</h3>
                  <Button as={Link} to={`/property/${property._id}`} variant="primary" size="lg" className="rounded-pill px-5 py-3 fw-bold shadow-lg border-2 border-white border-opacity-10">
                    View Residence
                  </Button>
                </div>
              </Container>
            </Carousel.Caption>
          </Carousel.Item>
        ))}
      </Carousel>
    </Container>
  );
};

export default FeaturedCarousel;