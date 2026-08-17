import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import AdminApp from './AdminApp.jsx';

// Dynamic Domain & Route Detector
const isAdminSite = 
  window.location.hostname.includes('admin') || 
  window.location.pathname.startsWith('/admin') ||
  window.location.search.includes('admin');

const rootElement = document.getElementById('root') || document.getElementById('admin-root');

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      {isAdminSite ? <AdminApp /> : <App />}
    </StrictMode>,
  );
}
