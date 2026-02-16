import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Form, InputGroup, Button } from 'react-bootstrap';
import { Search, Home, Bed, Bath, Tag, Filter, Grid, List } from 'lucide-react';
import { Link } from 'react-router-dom';
import axiosInstance from '../api/axiosInstance';
import { Property } from '../types/property';

const PropertySearch = ({ initialLayout = 'grid' }: { initialLayout?: 'grid' | 'list' }) => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [layout, setLayout] = useState<'grid' | 'list'>(initialLayout);
  const [filters, setFilters] = useState({
    type: 'all',
    status: 'all',
    minPrice: '',
    maxPrice: '',
    minBeds: 'all'
  });
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await axiosInstance.get('/properties');
        if (Array.isArray(response.data)) {
          const sorted = response.data.sort((a: any, b: any) => 
            new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
          );
          setProperties(sorted);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching properties:', error);
        setLoading(false);
      }
    };
    fetchProperties();
  }, []);

  const filteredProperties = properties.filter(p => {
    try {
      if (!p) return false;
      const sTerm = typeof searchTerm === 'string' ? searchTerm.toLowerCase().trim() : '';
      const sAddress = typeof p.address === 'string' ? p.address.toLowerCase() : '';
      const sDesc = typeof p.description === 'string' ? p.description.toLowerCase() : '';
      
      const matchesSearch = !sTerm || sAddress.includes(sTerm) || sDesc.includes(sTerm);
      const matchesType = filters.type === 'all' || p.type === filters.type;
      const matchesStatus = filters.status === 'all' || p.status === filters.status;
      
      const minP = filters.minPrice ? Number(filters.minPrice) : 0;
      const maxP = filters.maxPrice ? Number(filters.maxPrice) : Infinity;
      const matchesPrice = p.price >= minP && p.price <= maxP;

      const minB = filters.minBeds === 'all' ? 0 : Number(filters.minBeds);
      const matchesBeds = p.bedrooms >= minB;

      return matchesSearch && matchesType && matchesStatus && matchesPrice && matchesBeds;
    } catch (e) {
      return false;
    }
  });

  return (
    <Container id="properties" className="py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 className="mb-0 d-flex align-items-center fw-bold text-dark">
          <Home className="me-2 text-primary" /> Browse Listings
        </h2>
        <div className="d-flex gap-2">
          <Button 
            variant="light" 
            size="sm" 
            className="rounded-pill px-3 me-2 border shadow-sm fw-bold text-muted"
            onClick={() => {
              setLoading(true);
              const refresh = async () => {
                const response = await axiosInstance.get('/properties');
                setProperties(response.data);
                setLoading(false);
              };
              refresh();
            }}
          >
            Refresh
          </Button>
          <div className="bg-white border rounded-pill p-1 d-flex shadow-sm me-3">
            <Button 
              variant={layout === 'grid' ? "primary" : "link"} 
              size="sm" 
              className={`rounded-pill px-3 ${layout !== 'grid' && 'text-muted'}`}
              onClick={() => setLayout('grid')}
            >
              <Grid size={18} />
            </Button>
            <Button 
              variant={layout === 'list' ? "primary" : "link"} 
              size="sm" 
              className={`rounded-pill px-3 ${layout !== 'list' && 'text-muted'}`}
              onClick={() => setLayout('list')}
            >
              <List size={18} />
            </Button>
          </div>
          <Button 
            variant={showFilters ? "primary" : "outline-primary"} 
            onClick={() => setShowFilters(!showFilters)}
            className="d-flex align-items-center rounded-pill px-4 fw-bold"
          >
            <Filter size={18} className="me-2" /> {showFilters ? "Hide Filters" : "Filter"}
          </Button>
        </div>
      </div>
      
      <InputGroup className="mb-4 shadow-sm glass-panel border-0 rounded-4 overflow-hidden p-1" style={{ background: 'white' }}>
        <InputGroup.Text className="bg-white border-0 ps-3">
          <Search size={22} className="text-muted" />
        </InputGroup.Text>
        <Form.Control
          placeholder="Search by neighborhood or city in Jordan..."
          className="border-0 ps-0 py-3 fs-5"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ boxShadow: 'none' }}
        />
      </InputGroup>

      {showFilters && (
        <Card className="mb-4 shadow-sm border-0 bg-white p-4 rounded-4 animate__animated animate__fadeIn">
          <Row className="g-3">
            <Col md={3}><Form.Label className="small fw-bold text-muted">PROPERTY TYPE</Form.Label><Form.Select className="bg-light border-0 py-2" value={filters.type} onChange={(e) => setFilters({...filters, type: e.target.value})}><option value="all">All Types</option><option value="apartment">Apartment</option><option value="house">House</option></Form.Select></Col>
            <Col md={3}><Form.Label className="small fw-bold text-muted">OFFER STATUS</Form.Label><Form.Select className="bg-light border-0 py-2" value={filters.status} onChange={(e) => setFilters({...filters, status: e.target.value})}><option value="all">Sale & Rent</option><option value="for-sale">For Sale</option><option value="for-rent">For Rent</option></Form.Select></Col>
            <Col md={2}><Form.Label className="small fw-bold text-muted">MIN JOD</Form.Label><Form.Control className="bg-light border-0 py-2" type="number" value={filters.minPrice} onChange={(e) => setFilters({...filters, minPrice: e.target.value})} /></Col>
            <Col md={2}><Form.Label className="small fw-bold text-muted">MAX JOD</Form.Label><Form.Control className="bg-light border-0 py-2" type="number" value={filters.maxPrice} onChange={(e) => setFilters({...filters, maxPrice: e.target.value})} /></Col>
            <Col md={2}><Form.Label className="small fw-bold text-muted">BEDROOMS</Form.Label><Form.Select className="bg-light border-0 py-2" value={filters.minBeds} onChange={(e) => setFilters({...filters, minBeds: e.target.value})}><option value="all">Any</option><option value="1">1+</option><option value="2">2+</option><option value="3">3+</option></Col>
          </Row>
        </Card>
      )}

      {loading ? (
        <div className="text-center py-5"><div className="spinner-border text-primary" role="status"></div></div>
      ) : filteredProperties.length === 0 ? (
        <Card className="text-center py-5 border-0 shadow-sm rounded-4 bg-white">
          <Card.Body>
            <Home size={48} className="text-muted mb-3 opacity-25" />
            <h4 className="fw-bold">No properties found</h4>
            <p className="text-muted mb-4 mx-auto" style={{ maxWidth: '400px' }}>
              Try adjusting your filters or search term to find what you're looking for.
            </p>
            <Button variant="primary" onClick={() => {
              setSearchTerm('');
              setFilters({ type: 'all', status: 'all', minPrice: '', maxPrice: '', minBeds: 'all' });
            }}>Reset All Filters</Button>
          </Card.Body>
        </Card>
      ) : (
        <>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <p className="text-muted mb-0 fw-semibold">{filteredProperties.length} matches found</p>
          </div>
          
          <Row className="g-4">
            {filteredProperties.map(property => (
              <Col key={property._id} xs={12} md={layout === 'grid' ? 6 : 12} lg={layout === 'grid' ? 4 : 12}>
                <Card className={`h-100 shadow-sm hover-lift border-0 overflow-hidden rounded-4 transition ${layout === 'list' && 'flex-md-row'}`}>
                  <div className="position-relative" style={{ 
                    height: layout === 'grid' ? '240px' : '280px', 
                    width: layout === 'grid' ? '100%' : '450px',
                    minWidth: layout === 'list' ? '450px' : 'auto',
                    overflow: 'hidden' 
                  }}>
                    <Card.Img 
                      src={property.images[0] || 'https://via.placeholder.com/400x240'} 
                      style={{ objectFit: 'cover', height: '100%', width: '100%' }}
                    />
                    <Badge bg={property.status === 'for-sale' ? "primary" : "success"} className="position-absolute top-0 start-0 m-3 py-2 px-3 shadow-sm rounded-pill fw-bold" style={{ fontSize: '11px' }}>
                      {property.status === 'for-sale' ? 'FOR SALE' : 'FOR RENT'}
                    </Badge>
                  </div>
                  
                  <div className="d-flex flex-column flex-grow-1">
                    <Card.Body className="p-4">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <h3 className="h4 mb-0 text-primary fw-bold">JOD {property.price.toLocaleString()}</h3>
                      </div>
                      <Card.Title className="h6 mb-3 fw-bold">
                        <Link to={`/property/${property._id}`} className="text-decoration-none text-dark hover-primary">{property.address}</Link>
                      </Card.Title>
                      
                      <div className="d-flex text-muted small mb-4 gap-4 fw-semibold">
                        <span className="d-flex align-items-center"><Bed size={18} className="me-2 text-primary opacity-75" /> {property.bedrooms} Beds</span>
                        <span className="d-flex align-items-center"><Bath size={18} className="me-2 text-primary opacity-75" /> {property.bathrooms} Baths</span>
                        <span className="d-flex align-items-center text-capitalize"><Tag size={18} className="me-2 text-primary opacity-75" /> {property.type}</span>
                      </div>

                      <Card.Text className={`text-secondary small ${layout === 'grid' ? 'line-clamp-2' : ''}`} style={{ lineHeight: '1.6' }}>
                        {property.description}
                      </Card.Text>
                    </Card.Body>
                    <Card.Footer className="bg-white border-0 p-4 pt-0 text-end">
                      <Button as={Link} to={`/property/${property._id}`} variant="outline-primary" className="fw-bold rounded-pill px-4 py-2 border-2">View Property</Button>
                    </Card.Footer>
                  </div>
                </Card>
              </Col>
            ))}
          </Row>
        </>
      )}
    </Container>
  );
};

export default PropertySearch;