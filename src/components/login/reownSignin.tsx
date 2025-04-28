"use client";
import Cookies from "js-cookie"

import React from "react";
import {
  useAppKitProvider,
  useAppKitAccount,
} from "@reown/appkit/react";
import { 
  useAppKitNetworkCore, 
  type Provider 
} from "@reown/appkit/react";
import { BrowserProvider, JsonRpcSigner } from "ethers";
import axios from "axios";

const ReownSignin = () => {
 
  const walletAddress = Cookies.get("erebrus_wallet")
  const token = Cookies.get("erebrus_token")
console.log(token);
  return (
    <div>
     {token?<>
    <p className="text-green-600 font-semibold text-lg">
     Connected
    </p>
     </>:<>
     <appkit-button />
     </>}
    </div>
  );
};

export default ReownSignin;
