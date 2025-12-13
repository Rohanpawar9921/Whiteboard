import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import MainLayout from '@/layout/MainLayout';

const HomePage = (): JSX.Element => {
  const navigate = useNavigate();
  const [sessionId, setSessionId] = useState<string>('');

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
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="text-center mb-5">
              <h1 className="display-4 mb-3">Welcome to Collaborative Whiteboard</h1>
              <p className="lead text-muted">
                Create a new session or join an existing one to start collaborating
              </p>
            </div>

            <div className="row g-4">
              <div className="col-md-6">
                <div className="card h-100 shadow-sm">
                  <div className="card-body p-4">
                    <div className="text-center mb-3">
                      <i className="bi bi-plus-circle display-1 text-primary"></i>
                    </div>
                    <h3 className="card-title text-center mb-3">Create New Session</h3>
                    <p className="card-text text-muted text-center mb-4">
                      Start a new whiteboard session and invite others to collaborate
                    </p>
                    <button
                      className="btn btn-primary btn-lg w-100"
                      onClick={handleCreateSession}
                    >
                      Create Session
                    </button>
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="card h-100 shadow-sm">
                  <div className="card-body p-4">
                    <div className="text-center mb-3">
                      <i className="bi bi-box-arrow-in-right display-1 text-success"></i>
                    </div>
                    <h3 className="card-title text-center mb-3">Join Session</h3>
                    <p className="card-text text-muted text-center mb-4">
                      Enter a session ID to join an existing whiteboard
                    </p>
                    <div className="mb-3">
                      <input
                        type="text"
                        className="form-control form-control-lg"
                        placeholder="Enter Session ID"
                        value={sessionId}
                        onChange={(e) => setSessionId(e.target.value)}
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleJoinSession();
                          }
                        }}
                      />
                    </div>
                    <button
                      className="btn btn-success btn-lg w-100"
                      onClick={handleJoinSession}
                      disabled={!sessionId.trim()}
                    >
                      Join Session
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="card mt-5 bg-light">
              <div className="card-body p-4">
                <h4 className="card-title mb-3">
                  <i className="bi bi-info-circle me-2"></i>
                  Features
                </h4>
                <div className="row">
                  <div className="col-md-6">
                    <ul className="list-unstyled">
                      <li className="mb-2">
                        <i className="bi bi-check-circle text-success me-2"></i>
                        Real-time collaboration
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle text-success me-2"></i>
                        Multiple drawing tools
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle text-success me-2"></i>
                        Live cursor sharing
                      </li>
                    </ul>
                  </div>
                  <div className="col-md-6">
                    <ul className="list-unstyled">
                      <li className="mb-2">
                        <i className="bi bi-check-circle text-success me-2"></i>
                        Export to PNG/PDF
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle text-success me-2"></i>
                        Image prediction
                      </li>
                      <li className="mb-2">
                        <i className="bi bi-check-circle text-success me-2"></i>
                        Undo/Redo support
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default HomePage;
