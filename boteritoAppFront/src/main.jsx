import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppRouter } from './routes/AppRouter';
import { GoogleOAuthProvider } from "@react-oauth/google";
import './styles/typography.css';

const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID; // 👈 lee del .env

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={clientId}>
      <AppRouter />
    </GoogleOAuthProvider>
  </React.StrictMode>
);
