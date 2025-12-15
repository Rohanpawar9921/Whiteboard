import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/auth';

const LoginPage = (): JSX.Element => {
  const { login, customLogin, customSignup, isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>('login');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string>('');
  
  // Login form
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Signup form
  const [signupUsername, setSignupUsername] = useState('');
  const [signupEmail, setSignupEmail] = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirmPassword, setSignupConfirmPassword] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await customLogin(loginEmail, loginPassword);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSignup = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setError('');

    if (signupPassword !== signupConfirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (signupPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setIsSubmitting(true);

    try {
      await customSignup(signupUsername, signupEmail, signupPassword);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
    <div 
      className="min-vh-100 d-flex justify-content-center align-items-center"
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-10 col-lg-8">
            <div className="card shadow-lg border-0 rounded-4 overflow-hidden">
              <div className="row g-0">
                {/* Left Side - Branding */}
                <div 
                  className="col-md-5 d-flex flex-column justify-content-center align-items-center text-white p-5"
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  }}
                >
                  <i className="bi bi-palette display-1 mb-4 animate__animated animate__bounceIn"></i>
                  <h2 className="text-center fw-bold mb-3">Collaborative Whiteboard</h2>
                  <p className="text-center opacity-75">
                    Create, collaborate, and share your ideas in real-time with AI-powered predictions
                  </p>
                  <div className="mt-4">
                    <i className="bi bi-check-circle me-2"></i> Real-time Drawing
                    <br />
                    <i className="bi bi-check-circle me-2"></i> AI Image Recognition
                    <br />
                    <i className="bi bi-check-circle me-2"></i> Team Collaboration
                  </div>
                </div>

                {/* Right Side - Auth Forms */}
                <div className="col-md-7 p-5">
                  <h3 className="text-center mb-4 fw-bold">Welcome Back!</h3>

                  {/* Tabs */}
                  <ul className="nav nav-pills nav-fill mb-4" role="tablist">
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${activeTab === 'login' ? 'active' : ''}`}
                        onClick={() => {
                          setActiveTab('login');
                          setError('');
                        }}
                        style={{
                          background: activeTab === 'login' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                          border: 'none',
                        }}
                      >
                        Login
                      </button>
                    </li>
                    <li className="nav-item" role="presentation">
                      <button
                        className={`nav-link ${activeTab === 'signup' ? 'active' : ''}`}
                        onClick={() => {
                          setActiveTab('signup');
                          setError('');
                        }}
                        style={{
                          background: activeTab === 'signup' ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : 'transparent',
                          border: 'none',
                        }}
                      >
                        Sign Up
                      </button>
                    </li>
                  </ul>

                  {error && (
                    <div className="alert alert-danger animate__animated animate__shakeX" role="alert">
                      <i className="bi bi-exclamation-triangle me-2"></i>
                      {error}
                    </div>
                  )}

                  {/* Login Form */}
                  {activeTab === 'login' && (
                    <form onSubmit={handleLogin}>
                      <div className="mb-3">
                        <label htmlFor="loginEmail" className="form-label">
                          <i className="bi bi-envelope me-2"></i>Email
                        </label>
                        <input
                          type="email"
                          className="form-control form-control-lg"
                          id="loginEmail"
                          placeholder="your@email.com"
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="mb-4">
                        <label htmlFor="loginPassword" className="form-label">
                          <i className="bi bi-lock me-2"></i>Password
                        </label>
                        <input
                          type="password"
                          className="form-control form-control-lg"
                          id="loginPassword"
                          placeholder="••••••••"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <button
                        type="submit"
                        className="btn btn-lg w-100 text-white mb-3"
                        disabled={isSubmitting}
                        style={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          border: 'none',
                        }}
                      >
                        {isSubmitting ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Logging in...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-box-arrow-in-right me-2"></i>
                            Login
                          </>
                        )}
                      </button>
                    </form>
                  )}

                  {/* Signup Form */}
                  {activeTab === 'signup' && (
                    <form onSubmit={handleSignup}>
                      <div className="mb-3">
                        <label htmlFor="signupUsername" className="form-label">
                          <i className="bi bi-person me-2"></i>Username
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          id="signupUsername"
                          placeholder="johndoe"
                          value={signupUsername}
                          onChange={(e) => setSignupUsername(e.target.value)}
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="signupEmail" className="form-label">
                          <i className="bi bi-envelope me-2"></i>Email
                        </label>
                        <input
                          type="email"
                          className="form-control"
                          id="signupEmail"
                          placeholder="your@email.com"
                          value={signupEmail}
                          onChange={(e) => setSignupEmail(e.target.value)}
                          required
                          disabled={isSubmitting}
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="signupPassword" className="form-label">
                          <i className="bi bi-lock me-2"></i>Password
                        </label>
                        <input
                          type="password"
                          className="form-control"
                          id="signupPassword"
                          placeholder="••••••••"
                          value={signupPassword}
                          onChange={(e) => setSignupPassword(e.target.value)}
                          required
                          disabled={isSubmitting}
                          minLength={6}
                        />
                      </div>
                      <div className="mb-4">
                        <label htmlFor="signupConfirmPassword" className="form-label">
                          <i className="bi bi-lock-fill me-2"></i>Confirm Password
                        </label>
                        <input
                          type="password"
                          className="form-control"
                          id="signupConfirmPassword"
                          placeholder="••••••••"
                          value={signupConfirmPassword}
                          onChange={(e) => setSignupConfirmPassword(e.target.value)}
                          required
                          disabled={isSubmitting}
                          minLength={6}
                        />
                      </div>
                      <button
                        type="submit"
                        className="btn btn-lg w-100 text-white mb-3"
                        disabled={isSubmitting}
                        style={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          border: 'none',
                        }}
                      >
                        {isSubmitting ? (
                          <>
                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                            Creating account...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-person-plus me-2"></i>
                            Create Account
                          </>
                        )}
                      </button>
                    </form>
                  )}

                  {/* Divider */}
                  <div className="text-center my-3">
                    <span className="text-muted">OR</span>
                  </div>

                  {/* Keycloak Login */}
                  <button
                    className="btn btn-outline-secondary btn-lg w-100"
                    onClick={login}
                  >
                    <i className="bi bi-shield-lock me-2"></i>
                    Continue with Keycloak
                  </button>

                  <div className="text-center mt-4">
                    <small className="text-muted">
                      Secure authentication • End-to-end encryption
                    </small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
