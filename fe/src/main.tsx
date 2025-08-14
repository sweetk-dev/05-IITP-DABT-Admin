import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
// CssBaseline is provided inside Layout's ThemeProvider
import { createAppTheme } from './theme/mui'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
