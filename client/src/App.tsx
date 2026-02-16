import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavbarComponent from './components/NavbarComponent';
import HomePage from './pages/HomePage';
import PropertyDetailsPage from './pages/PropertyDetailsPage';
import CreatePropertyPage from './pages/CreatePropertyPage';
import AIResultsPage from './pages/AIResultsPage';
import ListingsPage from './pages/ListingsPage';
import ErrorBoundary from './components/ErrorBoundary';
import { Container } from 'react-bootstrap';
import './styles/App.css';

function App() {
  return (
    <Router>
      <div className="app-container bg-light min-vh-100">
        <NavbarComponent />
        
        <main>
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/create" element={<CreatePropertyPage />} />
              <Route path="/property/:id" element={<PropertyDetailsPage />} />
              <Route path="/ai-results" element={<AIResultsPage />} />
              <Route path="/listings" element={<ListingsPage />} />
            </Routes>
          </ErrorBoundary>
        </main>

        <footer className="bg-dark text-white py-5 mt-5 border-top border-secondary border-opacity-10">
          <Container className="py-4">
            <div className="row g-5">
              <div className="col-md-4">
                <h5 className="fw-extrabold text-primary mb-4" style={{ letterSpacing: '-1px' }}>PROPERTY FINDER AI</h5>
                <p className="text-muted small lh-lg">
                  Jordan's most advanced real estate ecosystem. We leverage Gemini AI to transform how you find and visualize your future home.
                </p>
              </div>
              <div className="col-md-2">
                <h6 className="fw-bold mb-4 small text-uppercase" style={{ letterSpacing: '1px' }}>Discover</h6>
                <ul className="list-unstyled small">
                  <li className="mb-3"><Link to="/listings" className="text-muted text-decoration-none hover-primary">Buy Properties</Link></li>
                  <li className="mb-3"><Link to="/listings" className="text-muted text-decoration-none hover-primary">Rentals</Link></li>
                  <li className="mb-3"><Link to="/listings" className="text-muted text-decoration-none hover-primary">New Projects</Link></li>
                </ul>
              </div>
              <div className="col-md-2">
                <h6 className="fw-bold mb-4 small text-uppercase" style={{ letterSpacing: '1px' }}>Support</h6>
                <ul className="list-unstyled small">
                  <li className="mb-3"><Link to="/create" className="text-muted text-decoration-none hover-primary">Add a property</Link></li>
                  <li className="mb-3"><a href="#" className="text-muted text-decoration-none hover-primary">Privacy Policy</a></li>
                  <li className="mb-3"><a href="#" className="text-muted text-decoration-none hover-primary">Terms of Use</a></li>
                </ul>
              </div>
              <div className="col-md-4 text-md-end">
                <h6 className="fw-bold mb-4 small text-uppercase" style={{ letterSpacing: '1px' }}>Powered by</h6>
                <p className="text-muted small">Google Gemini AI & Matterport 3D</p>
                <div className="pt-4 mt-4 border-top border-secondary border-opacity-25">
                  <p className="mb-0 text-muted extra-small">&copy; 2026 Property Finder AI. Built for the future of Real Estate.</p>
                </div>
              </div>
            </div>
          </Container>
        </footer>
      </div>
    </Router>
  );
}

// Simple link helper since I missed it in footer
import { Link } from 'react-router-dom';

export default App;