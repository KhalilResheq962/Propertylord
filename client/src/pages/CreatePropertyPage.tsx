import { useState, useCallback, useEffect } from 'react';
import { Container, Card, Form, Button, Row, Col, InputGroup, Alert, Image } from 'react-bootstrap';
import { Upload, DollarSign, MapPin, CheckCircle, Bed, Bath, Tag, PlusCircle, AlertCircle, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import { useDropzone } from 'react-dropzone';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axiosInstance from '../api/axiosInstance';
import axios from 'axios'; // For nominatim

// Fix for default marker icon issue
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

const CreatePropertyPage = () => {
  const navigate = useNavigate();
  
  // Auth Check
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please log in to add a property.');
      navigate('/');
    }
  }, [navigate]);

  const [formData, setFormData] = useState({
    address: '',
    price: '',
    description: '',
    type: 'apartment',
    status: 'for-sale',
    bedrooms: '1',
    bathrooms: '1',
    virtualTourUrl: '',
    lng: 35.9284,
    lat: 31.9454
  });

  const [files, setFiles] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<string[]>([]);
  const [validated, setValidated] = useState(false);
  const [isGeocoding, setIsGeocoding] = useState(false);

  // Image Dropzone
  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = [...files, ...acceptedFiles].slice(0, 5); // Max 5 images
    setFiles(newFiles);
    
    const newPreviews = newFiles.map(file => URL.createObjectURL(file));
    setPreviews(newPreviews);
  }, [files]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    maxFiles: 5
  });

  const removeFile = (index: number) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);

    const newPreviews = [...previews];
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
  };

  // Map Click Handler Component with Reverse Geocoding
  const LocationMarker = () => {
    useMapEvents({
      async click(e) {
        const { lat, lng } = e.latlng;
        setFormData(prev => ({ ...prev, lat, lng }));
        
        setIsGeocoding(true);
        try {
          const response = await axios.get(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`);
          if (response.data && response.data.display_name) {
            setFormData(prev => ({
              ...prev,
              address: response.data.display_name
            }));
          }
        } catch (error) {
          console.error('Geocoding error:', error);
        } finally {
          setIsGeocoding(false);
        }
      },
    });

    return (
      <Marker position={[formData.lat, formData.lng]} icon={DefaultIcon} />
    );
  };

  const validateForm = () => {
    const newErrors: string[] = [];
    if (!formData.address.trim()) newErrors.push("Address is required.");
    if (!formData.price || Number(formData.price) <= 0) newErrors.push("Please enter a valid price.");
    if (!formData.description.trim()) newErrors.push("Description is required.");
    if (files.length === 0) newErrors.push("At least one property image is required.");
    
    setErrors(newErrors);
    return newErrors.length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidated(true);
    
    if (!validateForm()) {
      window.scrollTo(0, 0);
      return;
    }

    setLoading(true);
    try {
      const data = new FormData();
      data.append('address', formData.address);
      data.append('price', formData.price);
      data.append('description', formData.description);
      data.append('type', formData.type);
      data.append('status', formData.status);
      data.append('bedrooms', formData.bedrooms);
      data.append('bathrooms', formData.bathrooms);
      data.append('virtualTourUrl', formData.virtualTourUrl);
      
      const location = {
        type: 'Point',
        coordinates: [formData.lng, formData.lat]
      };
      data.append('location', JSON.stringify(location));

      // Append all images
      files.forEach(file => {
        data.append('images', file);
      });

      await axiosInstance.post('/properties', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      setSuccess(true);
      setTimeout(() => navigate('/'), 2000);
    } catch (error: any) {
      console.error('Error creating property:', error);
      setErrors([`Failed to post ad: ${error.response?.data?.message || error.message}`]);
      window.scrollTo(0, 0);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Container className="py-5 text-center animate__animated animate__fadeIn">
        <div className="bg-white p-5 rounded-5 shadow-lg border-0 d-inline-block w-100 max-width-600">
          <CheckCircle size={80} className="text-success mb-4 animate__animated animate__bounceIn" />
          <h2 className="fw-extrabold text-dark mb-2">Listing Published!</h2>
          <p className="text-muted fs-5">Your property is now live on Jordan's premier AI marketplace.</p>
          <div className="mt-4 spinner-border text-primary spinner-border-sm" role="status"></div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5 animate__animated animate__fadeIn">
      <Row className="justify-content-center">
        <Col lg={10}>
          <div className="d-flex align-items-center mb-5">
            <div className="bg-primary text-white p-3 rounded-4 shadow-lg me-4">
              <PlusCircle size={32} />
            </div>
            <div>
              <h1 className="h2 fw-extrabold mb-1 text-dark uppercase" style={{ letterSpacing: '-1px' }}>List Your Property</h1>
              <p className="text-muted mb-0 fw-medium">Provide details below to reach thousands of Jordanian buyers.</p>
            </div>
          </div>

          {errors.length > 0 && (
            <Alert variant="danger" className="border-0 shadow-lg rounded-4 mb-5 p-4 animate__animated animate__shakeX">
              <div className="d-flex align-items-center mb-3 fw-extrabold text-danger uppercase" style={{ fontSize: '12px', letterSpacing: '1px' }}>
                <AlertCircle size={20} className="me-2" /> Action Required: Correct Validation Errors
              </div>
              <ul className="mb-0 fw-bold small opacity-75">
                {errors.map((err, i) => <li key={i} className="mb-1">{err}</li>)}
              </ul>
            </Alert>
          )}

          <Card className="shadow-lg border-0 rounded-5 overflow-hidden">
            <Card.Body className="p-4 p-md-5">
              <Form noValidate onSubmit={handleSubmit}>
                <h5 className="fw-extrabold mb-4 border-start border-primary border-4 ps-3 text-dark">1. LOCATION SELECTION</h5>
                <Row className="mb-5">
                  <Col md={12}>
                    <p className="text-muted mb-4 fs-6 fw-medium">Search for your property on the map and click to pin the exact coordinates.</p>
                    <div style={{ height: '400px', borderRadius: '24px', overflow: 'hidden' }} className="border-0 shadow-sm mb-4 position-relative">
                      {isGeocoding && (
                        <div className="position-absolute top-0 start-0 w-100 h-100 bg-white bg-opacity-50 d-flex align-items-center justify-content-center" style={{ zIndex: 1000 }}>
                          <div className="spinner-border text-primary" role="status"></div>
                        </div>
                      )}
                      <MapContainer 
                        center={[31.9454, 35.9284]} 
                        zoom={12} 
                        style={{ height: '100%', width: '100%' }}
                      >
                        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
                        <LocationMarker />
                      </MapContainer>
                    </div>
                    <Form.Group className="mb-3">
                      <Form.Label className="small fw-extrabold text-muted uppercase">Display Address (Auto-filled)</Form.Label>
                      <InputGroup hasValidation className="shadow-sm rounded-3 overflow-hidden">
                        <InputGroup.Text className="bg-light border-0">
                          {isGeocoding ? <div className="spinner-border spinner-border-sm text-primary"></div> : <MapPin size={20} className="text-primary" />}
                        </InputGroup.Text>
                        <Form.Control 
                          required
                          isInvalid={validated && !formData.address}
                          className="bg-light border-0 py-3 fw-semibold"
                          placeholder="Click map to populate address..." 
                          value={formData.address}
                          onChange={(e) => setFormData({...formData, address: e.target.value})}
                        />
                        <Form.Control.Feedback type="invalid" className="fw-bold">Property address is required.</Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>
                  </Col>
                </Row>

                <h5 className="fw-extrabold mb-4 border-start border-primary border-4 ps-3 text-dark">2. VISUAL MEDIA (MAX 5)</h5>
                
                <div 
                  {...getRootProps()} 
                  className={`p-5 border-2 border-dashed rounded-5 text-center mb-4 transition hover-lift ${isDragActive ? 'bg-primary bg-opacity-10 border-primary' : 'border-secondary border-opacity-25 bg-light'}`}
                  style={{ cursor: 'pointer' }}
                >
                  <input {...getInputProps()} />
                  <Upload size={48} className="text-primary mb-3" />
                  <h6 className="fw-extrabold text-dark">Drop high-res property photos here</h6>
                  <p className="mb-0 small text-muted text-uppercase fw-extrabold" style={{ letterSpacing: '1px' }}>Click to browse your gallery</p>
                </div>

                {previews.length > 0 && (
                  <div className="d-flex flex-wrap gap-4 mb-5 animate__animated animate__fadeIn">
                    {previews.map((preview, index) => (
                      <div key={index} className="position-relative shadow-sm rounded-4 overflow-hidden" style={{ width: '140px', height: '120px' }}>
                        <Image src={preview} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        <Button 
                          size="sm" 
                          variant="danger" 
                          className="position-absolute top-0 end-0 m-2 rounded-circle p-1 border-2 border-white shadow-sm"
                          style={{ lineHeight: 0 }}
                          onClick={() => removeFile(index)}
                        >
                          <X size={14} />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}

                <h5 className="fw-extrabold mb-4 border-start border-primary border-4 ps-3 text-dark">3. PROPERTY SPECIFICATIONS</h5>
                <Row className="mb-4">
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label className="small fw-extrabold text-muted uppercase">Asking Price (JOD)</Form.Label>
                      <InputGroup hasValidation className="shadow-sm rounded-3 overflow-hidden">
                        <InputGroup.Text className="bg-light border-0"><DollarSign size={20} className="text-primary" /></InputGroup.Text>
                        <Form.Control 
                          required
                          type="number"
                          isInvalid={validated && (!formData.price || Number(formData.price) <= 0)}
                          className="bg-light border-0 py-3 fw-extrabold fs-5"
                          placeholder="e.g. 150000" 
                          value={formData.price}
                          onChange={(e) => setFormData({...formData, price: e.target.value})}
                        />
                      </InputGroup>
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-4">
                      <Form.Label className="small fw-extrabold text-muted uppercase">Availability</Form.Label>
                      <Form.Select 
                        className="bg-light border-0 py-3 fw-bold shadow-sm rounded-3 px-3"
                        value={formData.status}
                        onChange={(e) => setFormData({...formData, status: e.target.value})}
                      >
                        <option value="for-sale">Immediate Sale</option>
                        <option value="for-rent">Monthly Rental</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Row className="mb-4">
                  <Col md={4}>
                    <Form.Group className="mb-4">
                      <Form.Label className="small fw-extrabold text-muted uppercase">Property Category</Form.Label>
                      <Form.Select 
                        className="bg-light border-0 py-3 fw-bold shadow-sm rounded-3 px-3"
                        value={formData.type}
                        onChange={(e) => setFormData({...formData, type: e.target.value})}
                      >
                        <option value="apartment">Modern Apartment</option>
                        <option value="house">Detached Villa</option>
                        <option value="condo">Urban Condo</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-4">
                      <Form.Label className="small fw-extrabold text-muted uppercase">Bedrooms</Form.Label>
                      <Form.Control 
                        type="number"
                        className="bg-light border-0 py-3 fw-bold shadow-sm rounded-3 px-3"
                        value={formData.bedrooms}
                        onChange={(e) => setFormData({...formData, bedrooms: e.target.value})}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group className="mb-4">
                      <Form.Label className="small fw-extrabold text-muted uppercase">Bathrooms</Form.Label>
                      <Form.Control 
                        type="number"
                        className="bg-light border-0 py-3 fw-bold shadow-sm rounded-3 px-3"
                        value={formData.bathrooms}
                        onChange={(e) => setFormData({...formData, bathrooms: e.target.value})}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-5">
                  <Form.Label className="small fw-extrabold text-muted uppercase">Detailed Marketing Description</Form.Label>
                  <Form.Control 
                    required
                    as="textarea" 
                    rows={6} 
                    isInvalid={validated && formData.description.length < 5}
                    className="bg-light border-0 rounded-4 p-4 fw-medium fs-6 shadow-sm"
                    placeholder="Describe unique features, finishes, neighborhood perks..." 
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  />
                </Form.Group>

                <Button variant="primary" type="submit" className="w-100 py-4 fw-extrabold rounded-pill shadow-lg mt-3 text-uppercase" style={{ letterSpacing: '1px' }} disabled={loading}>
                  {loading ? (
                    <><span className="spinner-border spinner-border-sm me-3"></span> PUBLISHING TO MARKETPLACE...</>
                  ) : 'Publish Property Ad Now'}
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CreatePropertyPage;