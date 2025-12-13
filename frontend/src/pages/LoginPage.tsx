import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/auth';

const LoginPage = (): JSX.Element => {
  const { login, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  if (isLoading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container min-vh-100 d-flex justify-content-center align-items-center">
      <div className="card shadow-lg" style={{ maxWidth: '500px', width: '100%' }}>
        <div className="card-body p-5 text-center">
          <h1 className="card-title mb-4">
            <i className="bi bi-pencil-square me-2"></i>
            Collaborative Whiteboard
          </h1>
          <p className="card-text text-muted mb-4">
            Create, collaborate, and share your ideas in real-time with your team.
          </p>
          <button className="btn btn-primary btn-lg w-100" onClick={login}>
            <i className="bi bi-box-arrow-in-right me-2"></i>
            Login with Keycloak
          </button>
          <div className="mt-4">
            <small className="text-muted">
              Secure authentication powered by Keycloak
            </small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
