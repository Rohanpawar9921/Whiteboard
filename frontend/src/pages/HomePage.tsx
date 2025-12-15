import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '../layout/MainLayout';
import ImagePredictor from '../components/ImagePredictor';
import bannerImage from '../assets/Home image.jpg';

const HomePage = (): JSX.Element => {
  const navigate = useNavigate();
  const [sessionId, setSessionId] = useState<string>('');
  const [showPredictor, setShowPredictor] = useState<boolean>(false);

  const handleCreateSession = (): void => {
    const newSessionId = `session-${Date.now()}`;
    navigate(`/whiteboard/${newSessionId}`);
  };

  const handleJoinSession = (): void => {
    if (sessionId.trim()) {
      navigate(`/whiteboard/${sessionId}`);
    }
  };

  return (
    <MainLayout>
      {/* Hero Section with Banner */}
      <div 
        className="position-relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(13, 110, 253, 0.9) 0%, rgba(108, 117, 125, 0.8) 100%), url(${bannerImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundAttachment: 'fixed',
          minHeight: '60vh'
        }}
      >
        <div className="container py-5">
          <div className="row justify-content-center align-items-center" style={{ minHeight: '50vh' }}>
            <div className="col-lg-10 text-center text-white">
              <h1 className="display-3 fw-bold mb-4 animate__animated animate__fadeInDown" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}>
                Collaborative Whiteboard
              </h1>
              <p className="lead mb-5 fs-4 animate__animated animate__fadeInUp" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>
                Real-time collaboration meets AI-powered creativity. Draw, share, and predict together.
              </p>
              <div className="d-flex gap-3 justify-content-center animate__animated animate__fadeInUp animate__delay-1s">
                <button
                  className="btn btn-light btn-lg px-5 py-3 rounded-pill shadow-lg"
                  onClick={handleCreateSession}
                  style={{ transition: 'all 0.3s ease' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  Create Session
                </button>
                <button
                  className="btn btn-outline-light btn-lg px-5 py-3 rounded-pill"
                  onClick={() => document.getElementById('joinSection')?.scrollIntoView({ behavior: 'smooth' })}
                  style={{ transition: 'all 0.3s ease' }}
                  onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <i className="bi bi-box-arrow-in-right me-2"></i>
                  Join Session
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Wave SVG */}
        <div className="position-absolute bottom-0 start-0 w-100">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="d-block">
            <path fill="#ffffff" fillOpacity="1" d="M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,149.3C960,160,1056,160,1152,138.7C1248,117,1344,75,1392,53.3L1440,32L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"></path>
          </svg>
        </div>
      </div>

      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-10">

            {/* Quick Actions */}
            <div id="joinSection" className="row g-4 mb-5">
              <div className="col-md-6">
                <div 
                  className="card h-100 border-0 shadow-lg"
                  style={{ 
                    transition: 'all 0.4s ease',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-10px)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(102, 126, 234, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  <div className="card-body p-5 text-white">
                    <div className="d-flex align-items-center mb-4">
                      <div 
                        className="rounded-circle bg-white d-flex align-items-center justify-content-center me-3"
                        style={{ width: '60px', height: '60px' }}
                      >
                        <i className="bi bi-plus-circle display-5" style={{ color: '#667eea' }}></i>
                      </div>
                      <h3 className="card-title mb-0 fw-bold">Create Session</h3>
                    </div>
                    <p className="card-text mb-4 opacity-90">
                      Start a new whiteboard session instantly and invite your team to collaborate in real-time
                    </p>
                    <button
                      className="btn btn-light btn-lg w-100 fw-bold rounded-pill"
                      onClick={handleCreateSession}
                      style={{ transition: 'all 0.3s ease' }}
                    >
                      <i className="bi bi-lightning-charge me-2"></i>
                      Quick Start
                    </button>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div 
                  className="card h-100 border-0 shadow-lg"
                  style={{ 
                    transition: 'all 0.4s ease',
                    background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-10px)';
                    e.currentTarget.style.boxShadow = '0 20px 40px rgba(245, 87, 108, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  <div className="card-body p-5 text-white">
                    <div className="d-flex align-items-center mb-4">
                      <div 
                        className="rounded-circle bg-white d-flex align-items-center justify-content-center me-3"
                        style={{ width: '60px', height: '60px' }}
                      >
                        <i className="bi bi-box-arrow-in-right display-5" style={{ color: '#f5576c' }}></i>
                      </div>
                      <h3 className="card-title mb-0 fw-bold">Join Session</h3>
                    </div>
                    <p className="card-text mb-3 opacity-90">
                      Enter a session ID to join an existing whiteboard and start collaborating
                    </p>
                    <div className="mb-3">
                      <input
                        type="text"
                        className="form-control form-control-lg rounded-pill px-4"
                        placeholder="Enter Session ID..."
                        value={sessionId}
                        onChange={(e) => setSessionId(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleJoinSession();
                          }
                        }}
                        style={{ 
                          border: 'none',
                          fontSize: '1rem'
                        }}
                      />
                    </div>
                    <button
                      className="btn btn-light btn-lg w-100 fw-bold rounded-pill"
                      onClick={handleJoinSession}
                      disabled={!sessionId.trim()}
                      style={{ transition: 'all 0.3s ease' }}
                    >
                      <i className="bi bi-arrow-right-circle me-2"></i>
                      Join Now
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Features Section */}
            <div className="row g-4 mb-5">
              <div className="col-12 text-center mb-4">
                <h2 className="display-5 fw-bold mb-3">
                  <span style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Powerful Features
                  </span>
                </h2>
                <p className="lead text-muted">Everything you need for seamless collaboration</p>
              </div>

              {[
                { icon: 'bi-lightning-charge-fill', title: 'Real-time Sync', desc: 'Collaborate with your team instantly with live cursor tracking', gradient: 'linear-gradient(135deg, #667eea, #764ba2)' },
                { icon: 'bi-palette-fill', title: 'Drawing Tools', desc: 'Customizable brushes with color picker and size controls', gradient: 'linear-gradient(135deg, #f093fb, #f5576c)' },
                { icon: 'bi-robot', title: 'AI Predictions', desc: 'Advanced ML model for real-time image classification', gradient: 'linear-gradient(135deg, #4facfe, #00f2fe)' },
                { icon: 'bi-arrow-counterclockwise', title: 'Undo/Redo', desc: 'Never lose your work with unlimited history', gradient: 'linear-gradient(135deg, #43e97b, #38f9d7)' },
                { icon: 'bi-download', title: 'Export Options', desc: 'Download your creations as PNG or PDF', gradient: 'linear-gradient(135deg, #fa709a, #fee140)' },
                { icon: 'bi-people-fill', title: 'Team Ready', desc: 'Share sessions with unlimited participants', gradient: 'linear-gradient(135deg, #30cfd0, #330867)' }
              ].map((feature, idx) => (
                <div key={idx} className="col-md-4">
                  <div 
                    className="card h-100 border-0 shadow"
                    style={{ transition: 'all 0.3s ease' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.08)';
                    }}
                  >
                    <div className="card-body p-4 text-center">
                      <div 
                        className="rounded-circle d-inline-flex align-items-center justify-content-center mb-3"
                        style={{ 
                          width: '70px', 
                          height: '70px',
                          background: feature.gradient
                        }}
                      >
                        <i className={`bi ${feature.icon} fs-2 text-white`}></i>
                      </div>
                      <h5 className="card-title fw-bold mb-2">{feature.title}</h5>
                      <p className="card-text text-muted small">{feature.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* AI Image Prediction Section */}
            <div className="mb-5">
              <div 
                className="card border-0 shadow-lg overflow-hidden"
                style={{ 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                }}
              >
                <div className="card-body p-5 text-white text-center">
                  <div className="mb-4">
                    <div 
                      className="rounded-circle bg-white d-inline-flex align-items-center justify-content-center mb-3"
                      style={{ width: '80px', height: '80px' }}
                    >
                      <i className="bi bi-stars display-4" style={{ color: '#667eea' }}></i>
                    </div>
                    <h3 className="fw-bold mb-2">AI-Powered Image Recognition</h3>
                    <p className="mb-4 opacity-90">Upload any image and let our advanced ML model identify it from 1000+ categories</p>
                  </div>
                  <button
                    className="btn btn-light btn-lg px-5 py-3 rounded-pill fw-bold"
                    onClick={() => setShowPredictor(!showPredictor)}
                    style={{ transition: 'all 0.3s ease' }}
                  >
                    <i className={`bi bi-${showPredictor ? 'eye-slash' : 'stars'} me-2`}></i>
                    {showPredictor ? 'Hide AI Predictor' : 'Try AI Predictor'}
                  </button>
                </div>
              </div>

              {showPredictor && (
                <div className="mt-4 animate__animated animate__fadeIn">
                  <ImagePredictor />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default HomePage;
