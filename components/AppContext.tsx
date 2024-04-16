"use client"
import { useWallet, ConnectModal } from '@suiet/wallet-kit';
import {WalletProvider} from '@suiet/wallet-kit';
import '@suiet/wallet-kit/style.css';
import { clusterApiUrl } from "@solana/web3.js";
import { FC, ReactNode, useEffect, useMemo, useState } from "react";



export const AppContext: FC<{ children: ReactNode }> = ({ children }) => {

 

  return (

      <WalletProvider >
      
          <div>
          {children}
          </div>
       
      </WalletProvider>
   
  );
};