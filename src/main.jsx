import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import './index.css'
import App from './App.jsx'
import vintageTheme from './theme/vintageTheme'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider theme={vintageTheme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </StrictMode>,
)
