import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

import { AuthContextProvider } from './contexts/AuthContext.tsx';
import { Provider } from 'react-redux';
import { store } from './app/store.ts';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>



    <App />

  </React.StrictMode>,
);
