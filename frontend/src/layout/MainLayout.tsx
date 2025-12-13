import { ReactNode } from 'react';
import { useAuth } from '@/auth';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps): JSX.Element => {
  const { user, logout } = useAuth();

  return (
    <div className="d-flex flex-column min-vh-100">
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container-fluid">
          <a className="navbar-brand" href="/">
            <strong>Whiteboard</strong>
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              {user && (
                <>
                  <li className="nav-item">
                    <span className="nav-link">
                      Welcome, <strong>{user.username}</strong>
                    </span>
                  </li>
                  <li className="nav-item">
                    <button className="btn btn-outline-light btn-sm" onClick={logout}>
                      Logout
                    </button>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>
      <main className="flex-grow-1">{children}</main>
      <footer className="bg-light py-3 mt-auto">
        <div className="container text-center">
          <small className="text-muted">
            © {new Date().getFullYear()} Collaborative Whiteboard. All rights reserved.
          </small>
        </div>
      </footer>
    </div>
  );
};

export default MainLayout;
