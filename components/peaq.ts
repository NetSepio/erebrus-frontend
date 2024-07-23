
interface Chain {
    id: number;
    name: string;
    nativeCurrency: {
      decimals: number;
      name: string;
      symbol: string;
    };
    rpcUrls: {
      public: {
        http: string[];
      };
      default: {
        http: string[];
      };
    };
    blockExplorers: {
      etherscan?: {
        name: string;
        url: string;
      };
      default: {
        name: string;
        url: string;
      };
    };
  } 
  
  export const Peaq: Chain = {

    id:9990,
    name: "agung",

    nativeCurrency: {
      decimals: 18,
      name: "agung",
      symbol: "AGNG",
    },
    rpcUrls: {
      public: {
        http: ["https://rpcpc1-qa.agung.peaq.network/ "],
      },
      default: {
        http: ["https://rpcpc1-qa.agung.peaq.network/ "],
      },
    },
    blockExplorers: {
      etherscan: {
        name: "agung",
        url: "https://agung-testnet.subscan.io/",
      },
      default: {
        name: "agung",
        url: "https://agung-testnet.subscan.io/",
      },
    },
  } as const;