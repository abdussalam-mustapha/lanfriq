import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from '../pages/landing/LandingPage'
import VerifyAccount from '../pages/VerifyAccount'
import UserTypeSelection from '../pages/UserTypeSelection'
import KYCForm from '../pages/KYCForm'
import KYCSuccess from '../pages/KYCSuccess'
import KYBForm from '../pages/KYBForm'
import Marketplace from '../pages/marketplace/Marketplace'
import PropertyDetails from '../pages/marketplace/PropertyDetails'
import TokenizationHub from '../pages/tokenization-hub/TokenizationHub'
import MyAssets from '../pages/assets/MyAssets'
import Offers from '../pages/offers/Offers'
import Favorites from '../pages/favorites/Favorites'
import Profile from '../pages/profile/Profile'
import Notifications from '../pages/notifications/Notifications'
import Wallet from '../pages/wallet/Wallet'
import AppLayout from '../components/layout/AppLayout'

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      <Route path="/verify-account" element={<VerifyAccount />} />
      <Route path="/verification" element={<UserTypeSelection />} />
      <Route path="/verification/individual" element={<KYCForm />} />
      <Route path="/verification/business" element={<KYBForm />} />
      <Route path="/kyc-success" element={<KYCSuccess />} />
      
      {/* App Routes with Sidebar Layout */}
      <Route path="/marketplace" element={<AppLayout><Marketplace /></AppLayout>} />
      <Route path="/marketplace/property/:id" element={<AppLayout><PropertyDetails /></AppLayout>} />
      <Route path="/wallet" element={<AppLayout><Wallet /></AppLayout>} />
      <Route path="/tokenization-hub" element={<AppLayout><TokenizationHub /></AppLayout>} />
      <Route path="/assets" element={<AppLayout><MyAssets /></AppLayout>} />
      <Route path="/offers" element={<AppLayout><Offers /></AppLayout>} />
      <Route path="/favorites" element={<AppLayout><Favorites /></AppLayout>} />
      <Route path="/profile" element={<AppLayout><Profile /></AppLayout>} />
      <Route path="/notifications" element={<AppLayout><Notifications /></AppLayout>} />

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes
