import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'

// Persistent storage shim using localStorage for real deployment
window.storage = {
  async get(key, shared) {
    try { const v = localStorage.getItem(key); return v ? { key, value: v } : null; } catch { return null; }
  },
  async set(key, value, shared) {
    try { localStorage.setItem(key, value); return { key, value }; } catch { return null; }
  },
  async delete(key, shared) {
    try { localStorage.removeItem(key); return { key, deleted: true }; } catch { return null; }
  },
  async list(prefix, shared) {
    try {
      const keys = Object.keys(localStorage).filter(k => !prefix || k.startsWith(prefix));
      return { keys };
    } catch { return { keys: [] }; }
  }
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
