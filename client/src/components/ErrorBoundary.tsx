import React, { ReactNode } from 'react';
import { Container } from 'react-bootstrap';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <Container className="my-5 py-5 text-center">
          <div className="alert alert-danger shadow-sm rounded-4 p-4 border-0">
            <h4 className="fw-extrabold text-danger mb-3">Something went wrong.</h4>
            <p className="mb-0 text-dark opacity-75">{this.state.error?.message}</p>
            <button 
              className="btn btn-primary mt-4 rounded-pill px-4 fw-bold shadow-sm" 
              onClick={() => window.location.href = '/'}
            >
              Return to Homepage
            </button>
          </div>
        </Container>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
