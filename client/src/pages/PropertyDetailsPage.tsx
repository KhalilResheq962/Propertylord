import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, Tabs, Tab, Button, Table, Form, Modal } from 'react-bootstrap';
import { MapPin, Home, ChevronLeft, Calendar, Bed, Bath, Tag, Maximize, Share2, Heart, Sparkles, Navigation } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import axiosInstance from '../api/axiosInstance';
import { Property } from '../types/property';
import { createPropertyIcon } from '../utils/mapIcons';
import InteriorDesigner from '../components/InteriorDesigner';
import ThreeDAnalysis from '../components/ThreeDAnalysis';

const PropertyDetailsPage = () => {
  const { id } = useParams<{ id: string }>();
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDesignerModal, setShowDesignerModal] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('tour');

  useEffect(() => {
    if (property) {
      setActiveTab(property.virtualTourUrl ? 'tour' : 'map');
    }
  }, [property]);

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await axiosInstance.get('/properties');
        const apiData = Array.isArray(response.data) ? response.data : [];
        let found = apiData.find((p: Property) => p._id === id);
        
        // Demo Fallback for Ritz-Carlton
        if (!found && id === '65c8f8f8f8f8f8f8f8f8f8f1') {
          found = {
            _id: '65c8f8f8f8f8f8f8f8f8f8f1',
            address: 'The Ritz-Carlton Residences, Amman, Jordan',
            description: 'Experience unparalleled luxury in the heart of Amman.',
            price: 1500000,
            type: 'apartment',
            status: 'for-sale',
            bedrooms: 4,
            bathrooms: 5,
            virtualTourUrl: 'https://my.matterport.com/show/?m=9S6nKxWfW5n',
            images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=2070'],
            createdAt: new Date().toISOString()
          };
        }
        
        setProperty(found);
        setLoading(false);
      } catch (error) {
        console.error('API Error:', error);
        setLoading(false);
      }
    };
    fetchProperty();
  }, [id]);

  if (loading) return <Container className="py-5 text-center my-5"><div className="spinner-border text-primary" style={{ width: '3rem', height: '30rem' }}></div></Container>;
  if (!property) return <Container className="py-5 text-center"><h2>Property Not Found</h2><Link to="/" className="btn btn-primary mt-3 text-white">Back to Search</Link></Container>;

  return (
    <div className="bg-light pb-5 animate__animated animate__fadeIn">
      {/* Property Header */}
      <div className="bg-white border-bottom py-4 mb-4 shadow-sm">
        <Container>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <Link to="/" className="text-decoration-none text-muted small d-flex align-items-center fw-bold hover-primary transition">
              <ChevronLeft size={16} className="me-1" /> Back to Search
            </Link>
            <div className="d-flex gap-2">
              <Button variant="light" size="sm" className="rounded-pill border shadow-sm px-3"><Share2 size={14} className="me-1" /> Share</Button>
              <Button variant="light" size="sm" className="rounded-pill border shadow-sm px-3 text-danger"><Heart size={14} className="me-1" /> Save</Button>
            </div>
          </div>
          <Row className="align-items-end">
            <Col md={8}>
              <h1 className="display-6 fw-extrabold mb-2 text-dark">{property.address}</h1>
              <p className="text-muted mb-0 d-flex align-items-center fs-5">
                <MapPin size={20} className="me-2 text-primary" /> {property.address}
              </p>
            </Col>
            <Col md={4} className="text-md-end mt-3 mt-md-0">
              <h2 className="text-primary fw-extrabold mb-0 display-6">JOD {property.price.toLocaleString()}</h2>
              <Badge bg={property.status === 'for-sale' ? "primary" : "success"} className="px-4 py-2 mt-2 rounded-pill shadow-sm fw-bold">
                {property.status === 'for-sale' ? 'FOR SALE' : 'FOR RENT'}
              </Badge>
            </Col>
          </Row>
        </Container>
      </div>

      <Container>
        <Row>
          <Col lg={8}>
            {/* Main Image with Floating Button */}
            <Card className="border-0 shadow-lg rounded-5 overflow-hidden mb-4 position-relative">
              <div style={{ height: '550px', overflow: 'hidden', position: 'relative' }}>
                <Card.Img 
                  src={property.images[0] || 'https://via.placeholder.com/1200x600'} 
                  style={{ objectFit: 'cover', height: '100%', width: '100%' }}
                />
                
                <div className="position-absolute top-0 end-0 m-4">
                  <Button 
                    variant="primary" 
                    className="rounded-pill shadow-lg d-flex align-items-center px-4 py-3 fw-bold border-white border-2 hover-lift animate__animated animate__pulse animate__infinite animate__slow"
                    onClick={() => setShowDesignerModal(true)}
                  >
                    <Sparkles size={22} className="me-2 text-warning" /> AI Interior Redesign
                  </Button>
                </div>

                <div className="position-absolute bottom-0 start-0 m-4">
                  <Button variant="dark" className="bg-opacity-75 border-0 d-flex align-items-center rounded-pill px-4 py-2">
                    <Maximize size={18} className="me-2" /> View All Photos
                  </Button>
                </div>
              </div>
            </Card>

            {/* AI Designer Modal */}
            <Modal show={showDesignerModal} onHide={() => setShowDesignerModal(false)} size="lg" centered className="rounded-5">
              <Modal.Body className="p-0 overflow-hidden rounded-5">
                <div className="p-4 p-md-5">
                  <InteriorDesigner initialImageUrl={property.images[0]} onClose={() => setShowDesignerModal(false)} />
                </div>
              </Modal.Body>
            </Modal>

            {/* Overview Grid */}
            <Row className="mb-4 g-4 text-dark">
              <Col xs={4}>
                <div className="bg-white p-4 rounded-5 shadow-sm text-center border-bottom border-primary border-4 hover-lift h-100 transition">
                  <Bed className="text-primary mb-3" size={32} />
                  <div className="fw-extrabold fs-4">{property.bedrooms}</div>
                  <div className="small text-muted fw-bold">Bedrooms</div>
                </div>
              </Col>
              <Col xs={4}>
                <div className="bg-white p-4 rounded-5 shadow-sm text-center border-bottom border-primary border-4 hover-lift h-100 transition">
                  <Bath className="text-primary mb-3" size={32} />
                  <div className="fw-extrabold fs-4">{property.bathrooms}</div>
                  <div className="small text-muted fw-bold">Bathrooms</div>
                </div>
              </Col>
              <Col xs={4}>
                <div className="bg-white p-4 rounded-5 shadow-sm text-center border-bottom border-primary border-4 hover-lift h-100 transition">
                  <Tag className="text-primary mb-3" size={32} />
                  <div className="fw-extrabold fs-4 text-capitalize">{property.type}</div>
                  <div className="small text-muted fw-bold">Property Type</div>
                </div>
              </Col>
            </Row>

            {/* Description */}
            <Card className="border-0 shadow-sm rounded-5 p-4 p-md-5 mb-4">
              <h4 className="fw-extrabold mb-4 text-dark border-start border-primary border-4 ps-3">Property Description</h4>
              <p className="text-secondary fs-5 mb-0" style={{ lineHeight: '1.8', whiteSpace: 'pre-line' }}>
                {property.description}
              </p>
            </Card>

            {/* Property Details Table */}
            <Card className="border-0 shadow-sm rounded-5 p-4 p-md-5 mb-4 text-dark">
              <h4 className="fw-extrabold mb-4 border-start border-primary border-4 ps-3">Technical Specifications</h4>
              <Table responsive borderless className="mb-0 fs-5">
                <tbody>
                  <tr className="border-bottom border-light">
                    <td className="py-3 text-muted fw-bold" style={{ width: '40%' }}>Property ID:</td>
                    <td className="py-3 fw-bold text-primary">{property._id.slice(-8).toUpperCase()}</td>
                  </tr>
                  <tr className="border-bottom border-light">
                    <td className="py-3 text-muted fw-bold">Market Price:</td>
                    <td className="py-3 fw-bold">JOD {property.price.toLocaleString()}</td>
                  </tr>
                  <tr className="border-bottom border-light">
                    <td className="py-3 text-muted fw-bold">Status:</td>
                    <td className="py-3 text-capitalize fw-bold">{property.status.replace('-', ' ')}</td>
                  </tr>
                  <tr>
                    <td className="py-3 text-muted fw-bold">Year Built:</td>
                    <td className="py-3 fw-bold">2024 (Modern Construction)</td>
                  </tr>
                </tbody>
              </Table>
            </Card>

            {/* Interactive Tabs */}
            <div className="mb-4">
              <Card className="border-0 shadow-lg rounded-5 overflow-hidden">
                <Card.Body className="p-0">
                  <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k || 'map')} id="ai-tabs" className="custom-tabs-detailed" fill>
                    {property.virtualTourUrl && (
                      <Tab eventKey="tour" title={<span>🌐 3D Virtual Tour</span>}>
                        <div style={{ height: '550px' }}>
                          <iframe src={property.virtualTourUrl} width="100%" height="100%" frameBorder="0" allowFullScreen allow="xr-spatial-tracking"></iframe>
                        </div>
                      </Tab>
                    )}
                    {property.location?.coordinates && (
                      <Tab eventKey="map" title={<span>📍 Neighbourhood Map</span>}>
                        <div style={{ height: '550px' }}>
                          {activeTab === 'map' && (
                            <MapContainer center={[property.location.coordinates[1], property.location.coordinates[0]]} zoom={15} style={{ height: '100%', width: '100%' }}>
                              <TileLayer attribution='&copy; CARTO' url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
                              <Marker position={[property.location.coordinates[1], property.location.coordinates[0]]} icon={createPropertyIcon(property.price, property.status)}>
                                <Popup>{property.address}</Popup>
                              </Marker>
                            </MapContainer>
                          )}
                        </div>
                      </Tab>
                    )}
                    <Tab eventKey="3d" title={<span>🔍 Spatial Analysis</span>}>
                      <div className="p-4 p-md-5 bg-white"><ThreeDAnalysis /></div>
                    </Tab>
                  </Tabs>
                </Card.Body>
              </Card>
            </div>
          </Col>

          {/* Sidebar */}
          <Col lg={4}>
            <div className="sticky-top" style={{ top: '110px' }}>
              <Card className="border-0 shadow-lg rounded-5 mb-4 overflow-hidden">
                <div className="bg-primary text-white p-3 text-center fw-bold small">OFFICIAL ADVERTISER</div>
                <Card.Body className="p-4">
                  <h5 className="fw-extrabold mb-4 text-dark">Reserve a Viewing</h5>
                  <Form>
                    <Form.Group className="mb-3"><Form.Control type="text" placeholder="Full Name" className="py-3 bg-light border-0 rounded-3 px-3 fw-semibold" /></Form.Group>
                    <Form.Group className="mb-3"><Form.Control type="tel" placeholder="Mobile Number" className="py-3 bg-light border-0 rounded-3 px-3 fw-semibold" /></Form.Group>
                    <Form.Group className="mb-4"><Form.Control as="textarea" rows={3} placeholder="Message" className="py-3 bg-light border-0 rounded-3 px-3 fw-semibold" /></Form.Group>
                    <Button variant="primary" className="w-100 py-3 fw-bold rounded-pill shadow-lg mb-3">Send Direct Inquiry</Button>
                    <div className="d-flex gap-2">
                      <Button variant="outline-success" className="w-50 py-2 fw-bold rounded-pill border-2 transition">WhatsApp</Button>
                      <Button variant="outline-primary" className="w-50 py-2 fw-bold rounded-pill border-2 transition">Call Now</Button>
                    </div>
                  </Form>
                </Card.Body>
              </Card>

              <Card className="border-0 shadow-lg rounded-5 bg-dark text-white overflow-hidden hover-lift transition">
                <div className="bg-primary p-2 text-center small fw-extrabold" style={{ letterSpacing: '1px' }}>AI-POWERED INSIGHTS</div>
                <Card.Body className="p-4 text-center">
                  <Sparkles size={40} className="mb-3 text-warning" />
                  <h5 className="fw-extrabold">Virtual Furnishing</h5>
                  <p className="small mb-0 opacity-75 fw-medium">Redesign this apartment in real-time with our AI Designer to see how your furniture fits.</p>
                </Card.Body>
              </Card>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default PropertyDetailsPage;