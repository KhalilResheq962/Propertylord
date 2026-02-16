import { useState } from 'react';
import { Modal, Button, Form, Alert, Row, Col } from 'react-bootstrap';
import { LogIn, UserPlus, Mail, Lock, Phone, Globe, ChevronLeft } from 'lucide-react';
import axios from 'axios';

interface AuthModalProps {
  show: boolean;
  onHide: () => void;
  onSuccess: (userData: { name: string, token: string }) => void;
}

const AuthModal = ({ show, onHide, onSuccess }: AuthModalProps) => {
  const [view, setView] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    country: 'Jordan'
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (view === 'signup') {
      if (formData.password !== formData.confirmPassword) {
        setError("Passwords do not match.");
        return;
      }
    }

    setLoading(true);
    const endpoint = view === 'login' ? '/auth/login' : '/auth/signup';
    
    try {
      const response = await axios.post(`http://localhost:3000${endpoint}`, formData);
      const { token, name } = response.data;
      
      localStorage.setItem('token', token);
      localStorage.setItem('userName', name);
      
      onSuccess({ name, token });
      onHide();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const toggleView = () => {
    setView(view === 'login' ? 'signup' : 'login');
    setError(null);
  };

  return (
    <Modal show={show} onHide={onHide} centered className="rounded-4 overflow-hidden shadow-lg">
      <Modal.Body className="p-4 p-md-5">
        <div className="text-center mb-4">
          <h2 className="fw-bold text-primary mb-1">
            {view === 'login' ? 'Welcome Back' : 'Create Account'}
          </h2>
          <p className="text-muted small">
            {view === 'login' ? 'Login to manage your properties' : 'Join Jordan\'s premier AI real estate hub'}
          </p>
        </div>

        {error && <Alert variant="danger" className="py-2 small border-0 rounded-3 mb-4">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          {view === 'signup' && (
            <Form.Group className="mb-3">
              <Form.Label className="small fw-bold text-muted">FULL NAME</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Enter full name" 
                className="bg-light border-0 py-2"
                required
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </Form.Group>
          )}

          <Form.Group className="mb-3">
            <Form.Label className="small fw-bold text-muted">EMAIL ADDRESS</Form.Label>
            <Form.Control 
              type="email" 
              placeholder="name@example.com" 
              className="bg-light border-0 py-2"
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
            />
          </Form.Group>

          {view === 'signup' && (
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold text-muted">PHONE NUMBER</Form.Label>
                  <Form.Control 
                    type="tel" 
                    placeholder="07XXXXXXXX" 
                    className="bg-light border-0 py-2"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label className="small fw-bold text-muted">COUNTRY</Form.Label>
                  <Form.Select 
                    className="bg-light border-0 py-2"
                    value={formData.country}
                    onChange={(e) => setFormData({...formData, country: e.target.value})}
                  >
                    <option value="Jordan">🇯🇴 Jordan</option>
                    <option value="UAE">🇦🇪 UAE</option>
                    <option value="Saudi Arabia">🇸🇦 Saudi Arabia</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          )}

          <Row>
            <Col md={view === 'signup' ? 6 : 12}>
              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold text-muted">PASSWORD</Form.Label>
                <Form.Control 
                  type="password" 
                  placeholder="••••••••" 
                  className="bg-light border-0 py-2"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </Form.Group>
            </Col>
            {view === 'signup' && (
              <Col md={6}>
                <Form.Group className="mb-4">
                  <Form.Label className="small fw-bold text-muted">CONFIRM</Form.Label>
                  <Form.Control 
                    type="password" 
                    placeholder="••••••••" 
                    className="bg-light border-0 py-2"
                    required
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                  />
                </Form.Group>
              </Col>
            )}
          </Row>

          <Button variant="primary" type="submit" className="w-100 py-3 fw-bold rounded-3 shadow-sm mb-4" disabled={loading}>
            {loading ? (
              <span className="spinner-border spinner-border-sm me-2"></span>
            ) : (
              view === 'login' ? 'Sign In' : 'Create Account'
            )}
          </Button>

          <div className="text-center pt-2 border-top">
            <p className="text-muted small mb-0">
              {view === 'login' ? "Don't have an account?" : "Already have an account?"}
              <Button variant="link" onClick={toggleView} className="p-0 ps-2 text-primary fw-bold text-decoration-none">
                {view === 'login' ? 'Register Now' : 'Login Instead'}
              </Button>
            </p>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AuthModal;