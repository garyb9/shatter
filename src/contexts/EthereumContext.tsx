import React, { createContext, useContext, useState, useMemo, ReactNode } from 'react';
import type { PublicClient } from 'viem';
import { createEthClient } from '@/lib/ethereum';
import { DEFAULT_RPC_URL } from '@/lib/consts';

interface EthereumContextType {
  client: PublicClient;
  rpcUrl: string;
  setRpcUrl: (url: string) => void;
}

const EthereumContext = createContext<EthereumContextType | undefined>(undefined);

export const useEthereum = () => {
  const context = useContext(EthereumContext);
  if (context === undefined) {
    throw new Error('useEthereum must be used within an EthereumProvider');
  }
  return context;
};

interface EthereumProviderProps {
  children: ReactNode;
}

export const EthereumProvider: React.FC<EthereumProviderProps> = ({ children }) => {
  const [rpcUrl, setRpcUrlState] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('shatter:rpcUrl') ?? DEFAULT_RPC_URL;
    }
    return DEFAULT_RPC_URL;
  });

  const client = useMemo(() => createEthClient(rpcUrl), [rpcUrl]);

  const setRpcUrl = (url: string) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('shatter:rpcUrl', url);
    }
    setRpcUrlState(url);
  };

  return (
    <EthereumContext.Provider value={{ client, rpcUrl, setRpcUrl }}>
      {children}
    </EthereumContext.Provider>
  );
};
