import { createContext, useContext, useEffect, useState } from 'react';
import { CampProvider as OriginCampProvider, useAuth, useModal, useSocials } from '@campnetwork/origin/react';
import { useAccount } from 'wagmi';

const CampContext = createContext();

export const useCamp = () => {
  const context = useContext(CampContext);
  if (!context) {
    throw new Error('useCamp must be used within a CampProvider');
  }
  return context;
};

// Internal wrapper that uses Camp SDK hooks
const CampContextProvider = ({ children }) => {
  const auth = useAuth();
  const modal = useModal();
  const { data: socialsData, refetch: refetchSocials } = useSocials();
  const [origin, setOrigin] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { address, isConnected } = useAccount();

  // Update authentication state
  useEffect(() => {
    if (auth) {
      setIsAuthenticated(!!auth.address);
      // Get origin instance from auth
      if (auth.origin) {
        setOrigin(auth.origin);
      }
    }
  }, [auth]);

  // Provide auth.origin directly if available as fallback
  // Origin SDK provides origin through the auth object
  const originInstance = auth?.origin || origin;

  const connectToOrigin = async () => {
    if (modal) {
      modal.setIsVisible(true);
    }
  };

  const disconnect = async () => {
    if (auth) {
      await auth.disconnect();
      setOrigin(null);
      setIsAuthenticated(false);
    }
  };

  // Social linking methods
  const linkTwitter = () => auth?.linkTwitter();
  const linkSpotify = () => auth?.linkSpotify();
  const linkTikTok = (handle) => auth?.linkTikTok(handle);
  
  const unlinkTwitter = async () => {
    if (auth) {
      await auth.unlinkTwitter();
      await refetchSocials();
    }
  };
  
  const unlinkSpotify = async () => {
    if (auth) {
      await auth.unlinkSpotify();
      await refetchSocials();
    }
  };
  
  const unlinkTikTok = async () => {
    if (auth) {
      await auth.unlinkTikTok();
      await refetchSocials();
    }
  };

  const value = {
    auth,
    origin: originInstance,
    isAuthenticated,
    isLoading: !auth,
    linkedSocials: socialsData || { twitter: false, spotify: false, tiktok: false },
    connectToOrigin,
    disconnect,
    linkTwitter,
    linkSpotify,
    linkTikTok,
    unlinkTwitter,
    unlinkSpotify,
    unlinkTikTok,
    refreshLinkedSocials: refetchSocials,
  };

  return (
    <CampContext.Provider value={value}>
      {children}
    </CampContext.Provider>
  );
};

// Main provider that wraps with Camp SDK provider
export const CampProvider = ({ children, clientId }) => {
  return (
    <OriginCampProvider
      clientId={clientId || import.meta.env.VITE_CAMP_CLIENT_ID || 'fce77d7a-8085-47ca-adff-306a933e76aa'}
      redirectUri={window.location.origin + '/settings'}
      environment="DEVELOPMENT"
    >
      <CampContextProvider>
        {children}
      </CampContextProvider>
    </OriginCampProvider>
  );
};
