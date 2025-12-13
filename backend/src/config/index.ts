import dotenv from 'dotenv';

dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  corsOrigin: string;
  keycloak: {
    url: string;
    realm: string;
    clientId: string;
    clientSecret: string;
  };
  mlServerUrl: string;
}

const config: Config = {
  port: parseInt(process.env.PORT || '5000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  corsOrigin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  keycloak: {
    url: process.env.KEYCLOAK_URL || 'http://localhost:8080',
    realm: process.env.KEYCLOAK_REALM || 'whiteboard',
    clientId: process.env.KEYCLOAK_CLIENT_ID || 'whiteboard-backend',
    clientSecret: process.env.KEYCLOAK_CLIENT_SECRET || '',
  },
  mlServerUrl: process.env.ML_SERVER_URL || 'http://localhost:8000',
};

export default config;
