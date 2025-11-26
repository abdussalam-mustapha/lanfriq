import { Routes, Route, Navigate } from 'react-router-dom'
import LandingPage from '../pages/landing/LandingPage'
import Marketplace from '../pages/marketplace/Marketplace'
import PropertyDetails from '../pages/marketplace/PropertyDetails'
import TokenizationHub from '../pages/tokenization-hub/TokenizationHub'
import MyAssets from '../pages/assets/MyAssets'
import Offers from '../pages/offers/Offers'
import Favorites from '../pages/favorites/Favorites'
import Profile from '../pages/profile/Profile'
import Notifications from '../pages/notifications/Notifications'
import MainLayout from '../components/layout/MainLayout'

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<LandingPage />} />
      
      {/* App Routes with Layout */}
      <Route element={<MainLayout />}>
        <Route path="/marketplace" element={<Marketplace />} />
        <Route path="/marketplace/:propertyId" element={<PropertyDetails />} />
        <Route path="/tokenization-hub" element={<TokenizationHub />} />
        <Route path="/assets" element={<MyAssets />} />
        <Route path="/offers" element={<Offers />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/notifications" element={<Notifications />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default AppRoutes
