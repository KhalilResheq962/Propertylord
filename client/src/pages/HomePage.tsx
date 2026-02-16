import { useState } from 'react';
import { Container, Row, Col, Button, Badge } from 'react-bootstrap';
import FeaturedCarousel from '../components/FeaturedCarousel';
import MapComponent from '../components/MapComponent';
import { Search, Sparkles, MapPin, ChevronRight } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

const HomePage = () => {
  const [aiPrompt, setAiPrompt] = useState('');
  const navigate = useNavigate();

  const handleAISearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (aiPrompt.trim()) {
      navigate(`/ai-results?q=${encodeURIComponent(aiPrompt)}`);
    }
  };

  return (
    <div>
      {/* Premium Hero Section */}
      <section className="position-relative overflow-hidden mb-5" style={{ height: '85vh', minHeight: '650px' }}>
        <div 
          className="position-absolute top-0 start-0 w-100 h-100" 
          style={{ 
            backgroundImage: 'url("https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=2070")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            zIndex: -1
          }}
        />
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{ background: 'linear-gradient(to bottom, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.6) 100%)', zIndex: -1 }} />
        
        <Container className="h-100 d-flex flex-column justify-content-center text-center text-white">
          <Row className="justify-content-center animate__animated animate__fadeInUp">
            <Col lg={10}>
              <Badge bg="primary" className="mb-4 px-4 py-2 rounded-pill fs-6 fw-normal shadow-sm" style={{ letterSpacing: '1px' }}>
                JORDAN'S FIRST AI-DRIVEN REAL ESTATE HUB
              </Badge>
              <h1 className="display-2 fw-extrabold mb-4 text-primary" style={{ lineHeight: '1.1' }}>
                Evolve Your Home Search with AI
              </h1>
              <p className="lead fs-4 mb-5 mx-auto opacity-90" style={{ maxWidth: '800px' }}>
                Tell our AI what you need (e.g. "Apartment for family of 4 in Abdoun under 200k") and let Gemini find it for you.
              </p>
              
              <div className="glass-panel p-2 rounded-4 mx-auto shadow-lg border-primary border-opacity-25" style={{ maxWidth: '850px', background: 'rgba(255,255,255,0.9)' }}>
                <form onSubmit={handleAISearch} className="d-flex p-2">
                  <div className="flex-grow-1 text-start ps-3 d-flex align-items-center">
                    <Sparkles className="text-primary me-3" size={28} />
                    <input 
                      type="text" 
                      placeholder="Describe your dream home here..." 
                      className="border-0 bg-transparent w-100 fs-5 text-dark outline-none"
                      style={{ outline: 'none', color: 'black' }}
                      value={aiPrompt}
                      onChange={(e) => setAiPrompt(e.target.value)}
                    />
                  </div>
                  <Button type="submit" variant="primary" className="rounded-3 px-5 py-3 fs-5 d-flex align-items-center fw-bold">
                    Ask AI agent <ChevronRight size={20} className="ms-2" />
                  </Button>
                </form>
              </div>
              
              <div className="mt-4 d-flex justify-content-center gap-3">
                <span className="text-dark small fw-bold">Popular:</span>
                {['Family of 5 in Dabouq', 'Cheap Rent in Weibdeh', 'Luxury Villa with Pool'].map(tag => (
                  <button 
                    key={tag} 
                    className="btn btn-link p-0 text-dark opacity-75 small text-decoration-none hover-opacity-100 transition fw-semibold"
                    onClick={() => setAiPrompt(tag)}
                  >
                    "{tag}"
                  </button>
                ))}
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Main Features */}
      <Container>
        <Row className="mb-5 mt-n5 position-relative" style={{ marginTop: '-100px', zIndex: 10 }}>
          <Col md={4} className="mb-4">
            <div className="bg-white p-4 rounded-4 shadow-sm h-100 border-top border-primary border-4 hover-lift">
              <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-circle d-inline-block mb-3">
                <Sparkles size={32} />
              </div>
              <h4 className="fw-bold">AI Interior Designer</h4>
              <p className="text-muted small">Instantly visualize any room with your preferred furniture style.</p>
            </div>
          </Col>
          <Col md={4} className="mb-4">
            <div className="bg-white p-4 rounded-4 shadow-sm h-100 border-top border-primary border-4 hover-lift">
              <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-circle d-inline-block mb-3">
                <Search size={32} />
              </div>
              <h4 className="fw-bold">3D Spatial Scan</h4>
              <p className="text-muted small">Deep structural and lighting analysis powered by Gemini 3.</p>
            </div>
          </Col>
          <Col md={4} className="mb-4">
            <div className="bg-white p-4 rounded-4 shadow-sm h-100 border-top border-primary border-4 hover-lift">
              <div className="bg-primary bg-opacity-10 text-primary p-3 rounded-circle d-inline-block mb-3">
                <MapPin size={32} />
              </div>
              <h4 className="fw-bold">Interactive Map</h4>
              <p className="text-muted small">Browse Jordanian neighborhoods with real-time price insight.</p>
            </div>
          </Col>
        </Row>
      </Container>

      {/* Featured Properties Carousel */}
      <FeaturedCarousel />
      
      <div className="bg-white py-5 mt-5">
        <MapComponent />
      </div>
      
      <Container className="py-5">
        <Row className="align-items-center bg-dark text-white rounded-5 p-5 shadow-lg mx-0">
          <Col lg={7}>
            <h2 className="display-5 fw-bold mb-4" style={{ color: 'white' }}>Ready to find your future?</h2>
            <p className="lead opacity-75 mb-0" style={{ color: 'rgba(255,255,255,0.8)' }}>Join thousands of homeowners in Jordan using AI to make smarter property decisions.</p>
          </Col>
          <Col lg={5} className="text-lg-end mt-4 mt-lg-0">
            <Button as={Link} to="/listings" variant="light" size="lg" className="rounded-pill px-5 py-3 fw-bold text-primary border-0 me-3 hover-lift">Browse Sales</Button>
            <Button as={Link} to="/create" variant="outline-light" size="lg" className="rounded-pill px-5 py-3 fw-bold border-2 hover-lift">Add a property</Button>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default HomePage;
