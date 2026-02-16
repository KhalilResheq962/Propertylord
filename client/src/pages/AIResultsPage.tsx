import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { Sparkles, Bed, Bath, ChevronLeft, Info, Search } from 'lucide-react';
import axiosInstance from '../api/axiosInstance';
import { Property } from '../types/property';

const AIResultsPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const prompt = searchParams.get('q') || '';

  const [loading, setLoading] = useState(true);
  const [recommendation, setRecommendation] = useState<any>(null);
  const [allProperties, setAllProperties] = useState<Property[]>([]);
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);

  useEffect(() => {
    const getRecommendations = async () => {
      try {
        // 1. Get AI to parse requirements
        const recResponse = await axiosInstance.post('/ai/recommend', { requirements: prompt });
        const filters = recResponse.data;
        setRecommendation(filters);

        // 2. Fetch all properties
        const propResponse = await axiosInstance.get('/properties');
        const data = Array.isArray(propResponse.data) ? propResponse.data : [];
        setAllProperties(data);
        
        // Strict but flexible filtering
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

    if (prompt) getRecommendations();
  }, [prompt]);

  if (loading) {
    return (
      <Container className="py-5 text-center my-5 animate__animated animate__fadeIn">
        <Sparkles size={64} className="text-primary mb-4 animate__animated animate__pulse animate__infinite" />
        <h2 className="fw-extrabold text-dark mb-2">AI Concierge is Curating Results...</h2>
        <p className="text-muted fs-5">Matching Jordan's premium listings with your lifestyle requirements.</p>
      </Container>
    );
  }

  return (
    <div className="bg-light min-vh-100 pb-5 animate__animated animate__fadeIn">
      <div className="bg-white border-bottom py-5 mb-5 shadow-sm">
        <Container>
          <Link to="/" className="text-decoration-none d-flex align-items-center mb-4 text-muted small fw-bold hover-primary">
            <ChevronLeft size={16} className="me-1" /> BACK TO PORTAL
          </Link>
          <div className="d-flex align-items-center gap-3">
            <div className="bg-primary text-white p-3 rounded-4 shadow-sm">
              <Sparkles size={28} />
            </div>
            <div>
              <h1 className="h2 fw-extrabold mb-1 text-dark text-uppercase" style={{ letterSpacing: '-1px' }}>AI Recommended Matches</h1>
              <p className="text-muted mb-0 fw-medium">Tailored results for: "<strong>{prompt}</strong>"</p>
            </div>
          </div>
        </Container>
      </div>

      <Container>
        {recommendation && (
          <div className="alert bg-white shadow-lg border-start border-primary border-5 rounded-4 p-4 mb-5 d-flex align-items-start animate__animated animate__fadeInLeft">
            <Info className="text-primary me-3 mt-1 flex-shrink-0" size={32} />
            <div>
              <h6 className="fw-extrabold text-dark mb-2 uppercase" style={{ fontSize: '12px', letterSpacing: '1px' }}>AI LOGIC & INSIGHTS</h6>
              <p className="mb-0 text-secondary fs-5 lh-base fw-medium italic italic">{recommendation.explanation}</p>
            </div>
          </div>
        )}

        {filteredProperties.length > 0 ? (
          <>
            <h5 className="fw-bold mb-4 text-dark">{filteredProperties.length} Properties strictly match your criteria</h5>
            <Row xs={1} md={2} lg={3} className="g-4">
              {filteredProperties.map(property => (
                <Col key={property._id}>
                  <Card className="h-100 border-0 shadow-sm rounded-5 overflow-hidden hover-lift transition">
                    <div style={{ height: '240px', overflow: 'hidden' }}>
                      <Card.Img variant="top" src={property.images[0]} style={{ height: '100%', objectFit: 'cover' }} />
                    </div>
                    <Card.Body className="p-4">
                      <h4 className="h4 fw-extrabold text-primary mb-2">JOD {property.price.toLocaleString()}</h4>
                      <Card.Title className="h6 fw-bold text-truncate mb-4 text-dark opacity-75">{property.address}</Card.Title>
                      <div className="d-flex gap-4 text-muted small fw-bold border-top pt-3">
                        <span className="d-flex align-items-center"><Bed size={18} className="me-2 text-primary" /> {property.bedrooms} Beds</span>
                        <span className="d-flex align-items-center"><Bath size={18} className="me-2 text-primary" /> {property.bathrooms} Baths</span>
                      </div>
                    </Card.Body>
                    <Card.Footer className="bg-white border-0 p-4 pt-0">
                      <Button as={Link} to={`/property/${property._id}`} variant="primary" className="w-100 fw-bold rounded-pill py-2 shadow-sm">View Full Details</Button>
                    </Card.Footer>
                  </Card>
                </Col>
              ))}
            </Row>
          </>
        ) : (
          <div className="text-center py-5">
            <div className="bg-white p-5 rounded-5 shadow-lg border-0 d-inline-block w-100 max-width-800">
              <Search size={80} className="text-primary mb-4 opacity-25" />
              <h3 className="fw-extrabold text-dark mb-3">No direct matches found</h3>
              <p className="text-muted mb-5 mx-auto fs-5" style={{ maxWidth: '600px' }}>
                We couldn't find a property that perfectly meets every requirement. 
                However, our AI suggests these premium alternatives currently available in Jordan:
              </p>
              
              <Row xs={1} md={2} lg={3} className="g-4 text-start">
                {allProperties.slice(0, 3).map(property => (
                  <Col key={property._id}>
                    <Card className="h-100 border-0 shadow-sm rounded-4 overflow-hidden grayscale-hover transition">
                      <Card.Body className="p-4">
                        <h6 className="fw-extrabold mb-2 text-dark text-truncate">{property.address}</h6>
                        <p className="text-primary fw-bold mb-3">JOD {property.price.toLocaleString()}</p>
                        <div className="text-muted extra-small fw-bold mb-3">{property.bedrooms} Bedrooms • {property.type}</div>
                        <Button as={Link} to={`/property/${property._id}`} variant="outline-primary" className="w-100 rounded-pill small fw-bold border-2">View Property</Button>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
              <div className="mt-5 pt-4">
                <Button as={Link} to="/" variant="primary" className="rounded-pill px-5 py-3 fw-extrabold shadow-lg">Try New AI Search</Button>
              </div>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};

export default AIResultsPage;
