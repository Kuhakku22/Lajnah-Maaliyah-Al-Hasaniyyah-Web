import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import AdminApp from './AdminApp.jsx';

const rootElement = document.getElementById('admin-root') || document.getElementById('root');

if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <AdminApp />
    </StrictMode>,
  );
}
