import React, { useState, useEffect, useCallback } from "react";
import Cookies from "js-cookie";

const CHAIN_CONFIG = {
  apt: { id: "aptos", currency: "APT", fixedAmount: 1.11 },
  sui: { id: "sui", currency: "SUI" },
  evm: { id: "ethereum", currency: "ETH" },
  sol: { id: "solana", currency: "SOL" },
  peaq: { id: "krest", currency: "KREST" },
};

const DEFAULT_CHAIN = "apt";
const SUBSCRIPTION_PRICE_USD = 5.99;

const CryptoPrice = () => {
  const [price, setPrice] = useState(null);
  const [displayText, setDisplayText] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const fetchPrice = useCallback(async (cryptoId) => {
    try {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${cryptoId}&vs_currencies=usd`
      );
      const data = await response.json();
      return data[cryptoId]?.usd;
    } catch (error) {
      console.error("Error fetching crypto price:", error);
      return null;
    }
  }, []);

  useEffect(() => {
    const chainSymbol = Cookies.get("Chain_symbol") || DEFAULT_CHAIN;
    const wallet = Cookies.get("erebrus_token");
    const { id: cryptoId, currency, fixedAmount } = CHAIN_CONFIG[chainSymbol] || CHAIN_CONFIG[DEFAULT_CHAIN];

    const updatePrice = async () => {
      setIsLoading(true);
      const currentPrice = await fetchPrice(cryptoId);
      if (currentPrice) {
        setPrice(currentPrice.toFixed(2));
        
        if (wallet) {
          if (chainSymbol === 'apt') {
            const usdPrice = (fixedAmount * currentPrice).toFixed(2);
            setDisplayText(`${fixedAmount} ${currency}/month `);
          } else {
            const cryptoAmount = (SUBSCRIPTION_PRICE_USD / currentPrice).toFixed(4);
            setDisplayText(`${cryptoAmount} ${currency}/month`);
          }
        } else {
          setDisplayText("");
        }
      } else {
        setPrice("N/A");
        setDisplayText("");
      }
      setIsLoading(false);
    };

    updatePrice();
    const interval = setInterval(updatePrice, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [fetchPrice]);

  return (
    <div className="container mb-1">
      {isLoading ? (
        <p className="text-white mt-4 text-3xl font-semibold">Loading...</p>
      ) : displayText ? (
        <p className="text-white mt-4 text-3xl font-semibold">{displayText}</p>
      ) : null}
    </div>
  );
};

export default CryptoPrice;