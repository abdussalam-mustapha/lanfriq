import { BrowserRouter } from 'react-router-dom'
import { WagmiProvider } from 'wagmi'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { RainbowKitProvider, darkTheme } from '@rainbow-me/rainbowkit'
import '@rainbow-me/rainbowkit/styles.css'
import { ThemeProvider } from './context/ThemeContext'
import { config } from './config/wagmi'
import AppRoutes from './routes/AppRoutes'
import './App.css'

const queryClient = new QueryClient()

function App() {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={darkTheme({
          accentColor: '#8cc043',
          accentColorForeground: 'white',
          borderRadius: 'large',
          fontStack: 'system',
        })}>
          <BrowserRouter>
            <ThemeProvider>
              <AppRoutes />
            </ThemeProvider>
          </BrowserRouter>
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

export default App
