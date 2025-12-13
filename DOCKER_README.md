# Whiteboard Application - Docker Compose

Complete Docker Compose setup for the Collaborative Whiteboard application.

## Services

- **PostgreSQL** (Port 5432 - internal only)
- **Keycloak** (Port 8080)
- **Backend** (Port 4000 → Internal 5000)
- **ML Server** (Port 8000)

## Quick Start

1. **Build and start all services:**
   ```bash
   docker-compose up --build
   ```

2. **Start in detached mode:**
   ```bash
   docker-compose up -d
   ```

3. **View logs:**
   ```bash
   docker-compose logs -f
   ```

4. **Stop all services:**
   ```bash
   docker-compose down
   ```

5. **Stop and remove volumes:**
   ```bash
   docker-compose down -v
   ```

## Service URLs

- **Keycloak Admin Console:** http://localhost:8080/admin
  - Username: `admin`
  - Password: `admin`
  
- **Backend API:** http://localhost:4000
  - Health: http://localhost:4000/api/health
  
- **ML Server:** http://localhost:8000
  - Health: http://localhost:8000/health
  - Docs: http://localhost:8000/docs

## Keycloak Setup

After Keycloak starts, you need to configure it:

1. Login to admin console: http://localhost:8080/admin
2. Create a new realm called `whiteboard`
3. Create clients:
   - `whiteboard-client` (for frontend)
   - `whiteboard-backend` (for backend)
4. Configure redirect URIs and CORS settings
5. Create test users

## Environment Variables

Edit `docker-compose.yml` to customize:
- Database credentials
- Keycloak admin credentials
- Service ports
- CORS origins

## Volumes

- `postgres_data` - PostgreSQL data persistence
- `backend_uploads` - Uploaded images storage

## Network

All services run on `whiteboard-network` bridge network for internal communication.

## Development

For development, you may want to run frontend separately:

```bash
# Frontend (not in Docker)
cd frontend
npm run dev
```

Then update `CORS_ORIGIN` in backend service to match your frontend URL.

## Production Notes

Before deploying to production:
- [ ] Change all default passwords
- [ ] Use environment files for secrets
- [ ] Configure proper SSL/TLS
- [ ] Set up reverse proxy (nginx)
- [ ] Enable production mode for all services
- [ ] Configure proper CORS origins
- [ ] Set up monitoring and logging
- [ ] Use managed database services
- [ ] Configure Keycloak with proper realm export

## Troubleshooting

**Services not starting:**
```bash
docker-compose logs [service-name]
```

**Rebuild specific service:**
```bash
docker-compose up --build [service-name]
```

**Clear everything:**
```bash
docker-compose down -v
docker system prune -a
```
