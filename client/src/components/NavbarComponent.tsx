import { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Button, Dropdown } from 'react-bootstrap';
import { Home, PlusCircle, Menu, User, LogOut } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import AuthModal from './AuthModal';

const NavbarComponent = () => {
  const location = useLocation();
  const [showAuth, setShowAuth] = useState(false);
  const [userName, setUserName] = useState<string | null>(localStorage.getItem('userName'));

  const handleAuthSuccess = (userData: { name: string, token: string }) => {
    setUserName(userData.name);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    setUserName(null);
    window.location.reload();
  };

  return (
    <>
      <Navbar expand="lg" sticky="top" className="glass-panel py-3 shadow-sm border-bottom border-secondary border-opacity-10">
        <Container>
          <Navbar.Brand as={Link} to="/" className="d-flex align-items-center fw-bold text-white fs-4">
            <div className="bg-primary text-white p-2 rounded-3 me-2 shadow-sm">
              <Home size={22} />
            </div>
            <span style={{ letterSpacing: '-1px' }}>PROPERTY<span className="text-primary">FINDER</span></span>
          </Navbar.Brand>
          
          <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-0 shadow-none bg-light bg-opacity-10">
            <Menu size={24} className="text-white" />
          </Navbar.Toggle>

          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mx-auto align-items-center">
              <Nav.Link as={Link} to="/listings" className={`px-3 fw-semibold ${location.pathname === '/listings' ? 'text-primary' : 'text-white'}`}>Buy</Nav.Link>
              <Nav.Link as={Link} to="/listings" className="px-3 fw-semibold text-white">Rent</Nav.Link>
              <Nav.Link href="#commercial" className="px-3 fw-semibold text-white">Commercial</Nav.Link>
              <Nav.Link href="#projects" className="px-3 fw-semibold text-white">Projects</Nav.Link>
            </Nav>
            
            <div className="d-flex align-items-center gap-3 mt-3 mt-lg-0">
              {userName ? (
                <Dropdown align="end">
                  <Dropdown.Toggle variant="link" className="text-white p-0 d-flex align-items-center text-decoration-none fw-semibold">
                    <User size={18} className="me-2 text-primary" /> {userName}
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="shadow-lg border-0 rounded-3 mt-2">
                    <Dropdown.Item className="small py-2"><User size={14} className="me-2"/> Profile</Dropdown.Item>
                    <Dropdown.Divider />
                    <Dropdown.Item onClick={handleLogout} className="small py-2 text-danger"><LogOut size={14} className="me-2"/> Log Out</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              ) : (
                <Button 
                  variant="link" 
                  className="text-white p-0 text-decoration-none fw-semibold opacity-75 hover-opacity-100"
                  onClick={() => setShowAuth(true)}
                >
                  Log In
                </Button>
              )}
              
              <Button 
                as={Link} 
                to="/create" 
                variant="primary" 
                className="px-4 py-2 d-flex align-items-center fw-bold shadow-sm"
              >
                <PlusCircle size={18} className="me-2" /> Add a property
              </Button>
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <AuthModal 
        show={showAuth} 
        onHide={() => setShowAuth(false)} 
        onSuccess={handleAuthSuccess}
      />
    </>
  );
};

export default NavbarComponent;