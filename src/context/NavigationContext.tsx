import React, { createContext, useContext, useRef, useState } from 'react';
import { createNavigationContainerRef } from '@react-navigation/native';

export const navigationRef = createNavigationContainerRef<any>();

export const TVNavigationContext = createContext<{
  activeSidebarNodeRef: React.MutableRefObject<any> | null;
  currentRoute: string;
  setCurrentRoute: (route: string) => void;
}>({
  activeSidebarNodeRef: null,
  currentRoute: 'Home',
  setCurrentRoute: () => {},
});

export const TVNavigationProvider = ({ children }: { children: React.ReactNode }) => {
  const activeSidebarNodeRef = useRef<any>(null);
  const [currentRoute, setCurrentRoute] = useState('Home');
  
  return (
    <TVNavigationContext.Provider value={{ activeSidebarNodeRef, currentRoute, setCurrentRoute }}>
      {children}
    </TVNavigationContext.Provider>
  );
};

export const useTVNavigation = () => useContext(TVNavigationContext);
