import { useState, useCallback, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Image, Badge, Modal } from 'react-bootstrap';
import { useDropzone } from 'react-dropzone';
import { Upload, Sparkles, AlertCircle, X } from 'lucide-react';
import axios from 'axios';

interface InteriorDesignerProps {
  initialImageUrl?: string;
  onClose?: () => void;
}

const InteriorDesigner = ({ initialImageUrl, onClose }: InteriorDesignerProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(initialImageUrl || null);
  const [style, setStyle] = useState<string>('Modern');
  const [loading, setLoading] = useState<boolean>(false);
  const [result, setResult] = useState<any>(null);

  // If initialImageUrl changes, update preview
  useEffect(() => {
    if (initialImageUrl) {
      setPreview(initialImageUrl);
    }
  }, [initialImageUrl]);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    setSelectedFile(file);
    setPreview(URL.createObjectURL(file));
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/*': [] },
    multiple: false,
    disabled: !!initialImageUrl && !selectedFile
  });

  const handleDesign = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      const formData = new FormData();
      formData.append('style', style);

      if (selectedFile) {
        formData.append('image', selectedFile);
      } else if (initialImageUrl) {
        // Fetch the image from URL and convert to blob to send to backend
        const response = await fetch(initialImageUrl);
        const blob = await response.blob();
        formData.append('image', blob, 'room.jpg');
      } else {
        return;
      }

      const apiResponse = await axios.post('http://localhost:3000/ai/design', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      setResult({
        suggestions: apiResponse.data.furnitureSuggestions,
        style: apiResponse.data.style,
        dimensions: apiResponse.data.roomDimensions
      });
    } catch (error) {
      console.error('Error in AI design:', error);
      alert('Failed to analyze the image. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="interior-designer-container animate__animated animate__fadeIn">
      {onClose && (
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="fw-bold mb-0">AI Design Suggestions</h5>
          <Button variant="link" onClick={onClose} className="text-muted p-0"><X size={24} /></Button>
        </div>
      )}

      <Row>
        <Col lg={initialImageUrl ? 12 : 6}>
          <Card className="shadow-sm border-0 mb-4 bg-light">
            <Card.Body>
              {!initialImageUrl && (
                <div 
                  {...getRootProps()} 
                  className={`p-4 border-2 border-dashed rounded-4 text-center mb-3 transition ${isDragActive ? 'bg-primary bg-opacity-10 border-primary' : 'border-secondary border-opacity-25 bg-white'}`}
                  style={{ cursor: 'pointer' }}
                >
                  <input {...getInputProps()} />
                  <Upload size={32} className="mb-2 text-primary" />
                  <p className="small mb-0 fw-bold">Click or drag a room photo</p>
                </div>
              )}
              
              {preview && (
                <div className="text-center position-relative">
                  <Image src={preview} fluid rounded className="shadow-sm" style={{ maxHeight: '300px', width: '100%', objectFit: 'cover' }} />
                  {selectedFile && (
                    <Button 
                      size="sm" 
                      variant="danger" 
                      className="position-absolute top-0 end-0 m-2 rounded-circle"
                      onClick={() => { setSelectedFile(null); setPreview(initialImageUrl || null); }}
                    >
                      <X size={14} />
                    </Button>
                  )}
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
        
        <Col lg={initialImageUrl ? 12 : 6}>
          <Card className="shadow-sm border-0 mb-4">
            <Card.Body>
              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold text-muted text-uppercase">Select Design Aesthetic</Form.Label>
                <div className="d-flex gap-2 flex-wrap mb-3">
                  {['Modern', 'Scandinavian', 'Classic', 'Industrial', 'Minimalist'].map(s => (
                    <Button 
                      key={s}
                      variant={style === s ? "primary" : "outline-secondary"}
                      size="sm"
                      className="rounded-pill px-3"
                      onClick={() => setStyle(s)}
                    >
                      {s}
                    </Button>
                  ))}
                </div>
              </Form.Group>
              
              <Button 
                variant="primary" 
                className="w-100 py-3 d-flex align-items-center justify-content-center fw-bold rounded-3 shadow-sm"
                disabled={(!selectedFile && !initialImageUrl) || loading}
                onClick={handleDesign}
              >
                {loading ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    Gemini is thinking...
                  </>
                ) : (
                  <>
                    <Sparkles size={18} className="me-2" /> Redesign this Room
                  </>
                )}
              </Button>
            </Card.Body>
          </Card>

          {result && (
            <Card className="shadow-sm border-0 bg-white rounded-4 animate__animated animate__fadeIn">
              <Card.Body>
                <Card.Title className="text-primary d-flex align-items-center h6 fw-bold mb-3">
                  <Badge bg="primary" className="me-2 px-2 py-1">AI</Badge> {result.style || style} Style Suggestions
                </Card.Title>
                
                <ul className="list-group list-group-flush small">
                  {result.suggestions?.map((s: any, idx: number) => (
                    <li key={idx} className="list-group-item px-0 border-light d-flex justify-content-between align-items-start py-3">
                      <div className="me-auto">
                        <div className="fw-bold text-dark">{s.item}</div>
                        <div className="text-muted" style={{ fontSize: '11px' }}>
                          Placement: {s.position ? `x:${s.position.x}, z:${s.position.z}` : 'Recommended location identified'}
                        </div>
                      </div>
                      {s.confidence && <Badge bg="light" text="primary" pill className="border border-primary border-opacity-25">{Math.round(s.confidence * 100)}% Match</Badge>}
                    </li>
                  ))}
                </ul>
                
                {result.dimensions && (
                  <div className="mt-3 p-3 bg-light rounded-3 small border-start border-primary border-3">
                    <div className="text-muted fw-bold mb-1">Estimated Room Scale</div>
                    <div className="text-dark">{result.dimensions.width}m (W) × {result.dimensions.length}m (L) × {result.dimensions.height}m (H)</div>
                  </div>
                )}
                
                <div className="mt-3 d-flex align-items-start text-muted" style={{ fontSize: '10px' }}>
                  <AlertCircle size={12} className="me-1 flex-shrink-0 mt-1" />
                  <span>AI suggestions are visualizations. Professional measurements are advised for real furniture purchases.</span>
                </div>
              </Card.Body>
            </Card>
          )}
        </Col>
      </Row>
    </div>
  );
};

export default InteriorDesigner;
