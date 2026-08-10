import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { ThemeProvider, initFxI18n } from '@sap-ui/fx-components';
import type { ThemeDefinition } from '@sap-ui/fx-components';
import './index.css';

const THEMES: ThemeDefinition[] = [
  { id: "light", name: "Light" },
  { id: "dark", name: "Dark" },
  { id: "system", name: "OS" },
];

initFxI18n("en");

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider themes={THEMES}>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
