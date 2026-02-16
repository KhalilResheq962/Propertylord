import { Container } from 'react-bootstrap';
import PropertySearch from '../components/PropertySearch';
import MapComponent from '../components/MapComponent';

const ListingsPage = () => {
  return (
    <div className="bg-light min-vh-100 pb-5">
      <div className="bg-white border-bottom py-4 mb-4">
        <Container>
          <h1 className="fw-bold mb-0">All Properties in Jordan</h1>
          <p className="text-muted mb-0">Browse through our curated list of luxury apartments, villas, and more.</p>
        </Container>
      </div>
      
      <PropertySearch initialLayout="list" />
      
      <div className="bg-white py-5 mt-5">
        <MapComponent />
      </div>
    </div>
  );
};

export default ListingsPage;
