import { ReactNode } from 'react';
import { useAuth } from '@/auth';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps): JSX.Element => {
  const { user, logout } = useAuth();

  return (
    <div className="d-flex flex-column min-vh-100">
      <nav 
        className="navbar navbar-expand-lg navbar-dark shadow-sm"
        style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          backdropFilter: 'blur(10px)'
        }}
      >
        <div className="container-fluid px-4">
          <a 
            className="navbar-brand d-flex align-items-center"
            href="/"
            style={{ transition: 'all 0.3s ease' }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <div 
              className="rounded-circle bg-white d-flex align-items-center justify-content-center me-2"
              style={{ width: '40px', height: '40px' }}
            >
              <i className="bi bi-palette-fill fs-5" style={{ color: '#667eea' }}></i>
            </div>
            <span className="fw-bold fs-4">Whiteboard</span>
          </a>
          <button
            className="navbar-toggler border-0"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto align-items-center">
              {user && (
                <>
                  <li className="nav-item me-3">
                    <div 
                      className="d-flex align-items-center bg-white bg-opacity-10 rounded-pill px-4 py-2"
                      style={{ backdropFilter: 'blur(10px)' }}
                    >
                      <i className="bi bi-person-circle me-2 fs-5"></i>
                      <span className="fw-semibold">{user.username}</span>
                    </div>
                  </li>
                  <li className="nav-item">
                    <button 
                      className="btn btn-light rounded-pill px-4"
                      onClick={logout}
                      style={{ 
                        transition: 'all 0.3s ease',
                        fontWeight: '600'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'scale(1.05)';
                        e.currentTarget.style.boxShadow = '0 5px 15px rgba(255, 255, 255, 0.3)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'scale(1)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <i className="bi bi-box-arrow-right me-2"></i>
                      Logout
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
      <main className="flex-grow-1" style={{ background: '#f8f9fa' }}>{children}</main>
      <footer 
        className="py-4 mt-auto"
        style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}
      >
        <div className="container">
          <div className="row align-items-center">
            <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
              <div className="d-flex align-items-center justify-content-center justify-content-md-start">
                <div 
                  className="rounded-circle bg-white d-flex align-items-center justify-content-center me-2"
                  style={{ width: '35px', height: '35px' }}
                >
                  <i className="bi bi-palette-fill" style={{ color: '#667eea' }}></i>
                </div>
                <span className="fw-bold">Collaborative Whiteboard</span>
              </div>
              <small className="d-block mt-2 opacity-75">
                © {new Date().getFullYear()} All rights reserved.
              </small>
            </div>
            <div className="col-md-6 text-center text-md-end">
              <div className="d-flex gap-3 justify-content-center justify-content-md-end">
                <a href="#" className="text-white text-decoration-none opacity-75" style={{ transition: 'opacity 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.opacity = '1'} onMouseLeave={(e) => e.currentTarget.style.opacity = '0.75'}>
                  <i className="bi bi-github fs-4"></i>
                </a>
                <a href="#" className="text-white text-decoration-none opacity-75" style={{ transition: 'opacity 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.opacity = '1'} onMouseLeave={(e) => e.currentTarget.style.opacity = '0.75'}>
                  <i className="bi bi-twitter fs-4"></i>
                </a>
                <a href="#" className="text-white text-decoration-none opacity-75" style={{ transition: 'opacity 0.3s' }} onMouseEnter={(e) => e.currentTarget.style.opacity = '1'} onMouseLeave={(e) => e.currentTarget.style.opacity = '0.75'}>
                  <i className="bi bi-linkedin fs-4"></i>
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
