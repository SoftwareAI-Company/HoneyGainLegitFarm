import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import React from 'react';

const container = document.getElementById('root')!;
const root = createRoot(container);

root.render(
    <App />
);
// createRoot(document.getElementById("root")!).render(<App />);
