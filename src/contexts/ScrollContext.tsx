import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ScrollContextType {
  isScrollButtonVisible: boolean;
  setIsScrollButtonVisible: (visible: boolean) => void;
}

const ScrollContext = createContext<ScrollContextType | undefined>(undefined);

export const useScrollContext = () => {
  const context = useContext(ScrollContext);
  if (context === undefined) {
    throw new Error('useScrollContext must be used within a ScrollProvider');
  }
  return context;
};

interface ScrollProviderProps {
  children: ReactNode;
}

export const ScrollProvider: React.FC<ScrollProviderProps> = ({ children }) => {
  const [isScrollButtonVisible, setIsScrollButtonVisible] = useState(false);

  return (
    <ScrollContext.Provider value={{ isScrollButtonVisible, setIsScrollButtonVisible }}>
      {children}
    </ScrollContext.Provider>
  );
};
