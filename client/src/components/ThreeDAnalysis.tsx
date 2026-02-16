import { useState, useCallback } from 'react';
import { Container, Row, Col, Card, Button, Image, ListGroup } from 'react-bootstrap';
import { useDropzone } from 'react-dropzone';
import { Box, Upload, Activity, Shield, Lightbulb } from 'lucide-react';
import axios from 'axios';

const ThreeDAnalysis = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<any>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false
  });

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setResult(null);
    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      const response = await axios.post('http://localhost:3000/ai/analyze-3d', formData);
      setResult(response.data);
    } catch (error) {
      console.error('Error in 3D analysis:', error);
      alert('Failed to analyze the scan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container id="3d" className="py-5">
      <h2 className="mb-4 d-flex align-items-center">
        <Box className="me-2 text-primary" /> 3D Apartment Analysis
      </h2>
      <Row>
        <Col lg={5}>
          <Card className="shadow-sm h-100">
            <Card.Body>
              <Card.Title>Upload Panoramic Scan</Card.Title>
              <div 
                {...getRootProps()} 
                className={`p-4 border border-2 border-dashed rounded text-center mb-3 ${isDragActive ? 'bg-light border-primary' : 'border-secondary'}`}
                style={{ cursor: 'pointer' }}
              >
                <input {...getInputProps()} />
                <Upload size={32} className="mb-2 text-secondary" />
                <p className="small mb-0">Drag & drop a wide-angle or panoramic photo</p>
              </div>
              
              {preview && (
                <div className="text-center">
                  <Image src={preview} fluid rounded className="mb-3" style={{ maxHeight: '200px' }} />
                  <Button 
                    variant="primary" 
                    className="w-100" 
                    onClick={handleAnalyze}
                    disabled={loading}
                  >
                    {loading ? 'Analyzing...' : 'Run Deep Analysis'}
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        <Col lg={7}>
          {!result && !loading && (
            <div className="text-center py-5 bg-white rounded border border-dashed">
              <Activity size={48} className="text-muted mb-3" />
              <p className="text-muted">Results will appear here after analysis</p>
            </div>
          )}

          {loading && (
            <div className="text-center py-5">
              <div className="spinner-border text-primary mb-3" role="status"></div>
              <h5>AI is processing the spatial layout...</h5>
            </div>
          )}

          {result && (
            <div className="animate__animated animate__fadeIn">
              <Card className="shadow-sm mb-4">
                <Card.Body>
                  <Card.Title className="d-flex align-items-center h5">
                    <Activity size={18} className="me-2 text-primary" /> Layout & Flow
                  </Card.Title>
                  <Card.Text>{result.layoutAnalysis}</Card.Text>
                </Card.Body>
              </Card>

              <Row>
                <Col md={6}>
                  <Card className="shadow-sm mb-4 h-100">
                    <Card.Body>
                      <Card.Title className="d-flex align-items-center h6">
                        <Lightbulb size={16} className="me-2 text-warning" /> Lighting
                      </Card.Title>
                      <Card.Text className="small">{result.lightingAnalysis}</Card.Text>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="shadow-sm mb-4 h-100">
                    <Card.Body>
                      <Card.Title className="d-flex align-items-center h6">
                        <Shield size={16} className="me-2 text-danger" /> Structural & Safety
                      </Card.Title>
                      <ListGroup variant="flush">
                        {result.structuralFeatures?.map((f: string, i: number) => (
                          <ListGroup.Item key={i} className="small py-1 border-0">• {f}</ListGroup.Item>
                        ))}
                        {result.safetyNotes?.map((n: string, i: number) => (
                          <ListGroup.Item key={`n-${i}`} className="small py-1 border-0 text-danger">• {n}</ListGroup.Item>
                        ))}
                      </ListGroup>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </div>
          )}
        </Col>
      </Row>
    </Container>
  );
};

export default ThreeDAnalysis;
