import React, { createContext, useContext, useRef, useState } from 'react';
import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef<any>();

export const TVNavigationContext = createContext<{
  activeSidebarNodeRef: React.MutableRefObject<any> | null;
  heroBannerFocusNodeRef: React.MutableRefObject<any> | null; // Ref tới nút được focus gần nhất trong HeroBanner
  currentRoute: string;
  setCurrentRoute: (route: string) => void;
}>({
  activeSidebarNodeRef: null,
  heroBannerFocusNodeRef: null,
  currentRoute: 'Home',
  setCurrentRoute: () => {},
});

export const TVNavigationProvider = ({ children }: { children: React.ReactNode }) => {
  const activeSidebarNodeRef = useRef<any>(null);
  const heroBannerFocusNodeRef = useRef<any>(null);
  const [currentRoute, setCurrentRoute] = useState('Home');
  
  return (
    <TVNavigationContext.Provider value={{ activeSidebarNodeRef, heroBannerFocusNodeRef, currentRoute, setCurrentRoute }}>
      {children}
    </TVNavigationContext.Provider>
  );
};

export const useTVNavigation = () => useContext(TVNavigationContext);
