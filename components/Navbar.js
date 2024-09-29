import Link from "next/link";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { motion } from "framer-motion";
import { AuthContext } from "../AuthContext";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";
import SingleSignerTransaction from "../components/transactionFlow/SingleSigner";
import { ConnectButton, useWallet, addressEllipsis } from "@suiet/wallet-kit";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
import { useAptosWallet } from "./Login/aptos";
import { useSuiWallet } from "./Login/suiwallet";
import { useEthWallet } from "./Login/ethereum";
import { useSolWallet } from "./Login/solana";
import { usePeaqWallet } from "./Login/peaq";
import { handleLoginClick } from "./Login/googleLogin";
import ChainSelector from "./Login/ChainSelector";
import QRCodeSVG from "qrcode.react";
import UserDropdown from "./Login/UserDropdown"

const networkSol = WalletAdapterNetwork.Devnet;

const variants = {
  open: { opacity: 1, x: 0, y: 0 },
  closed: { opacity: 0, y: 0 },
};

const WalletSelectorAntDesign = dynamic(
  () => import("../components/WalletSelectorAntDesign"),
  {
    suspense: false,
    ssr: false,
  }
);


const Navbar = ({ isHome }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [signature, setSignature] = useState("");
  const [challengeId, setChallengeId] = useState("");
  const [showPasetoQR, setShowPasetoQR] = useState("");
  const [link, setlink] = useState("");
  const { isSignedIn, setIsSignedIn } = useContext(AuthContext);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [chainsym, setchainsym] = useState("apt");
  const [hidefilter, setHideFilter] = useState(false);
  const [showExplorerDropdown, setShowExplorerDropdown] = useState(false);

  const {
    account: aptosAccount,
    connected: aptosConnected,
    onSignMessage: onSignMessage,
  } = useAptosWallet();
  const { handleSignMsg } = useSuiWallet();
  const { status, connected, connecting, disconnect, account, network, name } =
    useWallet();
  const {
    ethAddress,
    isConnected: ethConnected,
    onSignMessageEth,
  } = useEthWallet();

  const {
    peaqAddress,
    isConnected: peaqConnected,
    onSignMessagepeaq,
    disconnect: peaqdisconnect,
  } = usePeaqWallet();
  const { solconnected, solPublicKey, OnSignMessageSol } = useSolWallet();

  const [showsignbuttoneth, setshowsignbuttoneth] = useState(false);
  const [showsignbuttonaptos, setshowsignbuttonaptos] = useState(false);
  const [showsignbuttonsui, setshowsignbuttonsui] = useState(false);
  const [showsignbuttonsol, setshowsignbuttonsol] = useState(false);
  const [showsignbuttonpeaq, setshowsignbuttonpeaq] = useState(false);

  const [showchainbutton, setshowchainbutton] = useState(false);

  const solAccount = solPublicKey;

  console.log("sui connected", status == "connected");
  useEffect(() => {
    console;
    if (aptosConnected) {
      setshowsignbuttonaptos(true);
    } else if (status == "connected") {
      setshowsignbuttonsui(true);
    } else if (solconnected) {
      setshowsignbuttonsol(true);
    } else if (ethConnected) {
      setshowsignbuttoneth(true);
    } else if (peaqConnected) {
      setshowsignbuttonpeaq(true);
    } else {
      setshowsignbuttoneth(false);
      setshowsignbuttonsol(false);
      setshowsignbuttonsui(false);
      setshowsignbuttonaptos(false);
      setshowsignbuttonpeaq(false);
    }
  }, [
    aptosConnected,
    status == "connected",
    ethConnected,
    peaqConnected,
    solconnected,
  ]);
  console.log("sui connected", status == "connected");


  useEffect(() => {
    const token = Cookies.get("erebrus_token");
    if (token == null) {
      setshowchainbutton(true);
    }
  }, []);

  const handleChainChange = (newChainSym) => {
    setchainsym(newChainSym);
    // Add any other logic you need when the chain changes
  };


  
  const handleClick = () => {
    setHideFilter(!hidefilter);
  };

  const getchainsym = Cookies.get("Chain_symbol");

  console.log("chainsym", getchainsym);

  const router = useRouter();
  const address = Cookies.get("erebrus_wallet");
  const token = Cookies.get("erebrus_token");

  useEffect(() => {
    if (solAccount) {
      // Update the cookie with the new address
      Cookies.set("erebrus_wallet", solAccount);

      OnSignMessageSol();
    }
  }, [solAccount]);

  useEffect(() => {
    const erebrus_wallet = Cookies.get("erebrus_wallet");
    if (aptosConnected && !erebrus_wallet) {
      onSignMessage();
    }
  }, [aptosConnected]);

  useEffect(() => {
    const erebrus_wallet = Cookies.get("erebrus_wallet");
    if (connected && !erebrus_wallet) {
      handleSignMsg();
    }
  }, [connected]);
  useEffect(() => {
    // const erebrus_wallet =Cookies.get("erebrus_wallet") ;
    if (ethConnected && getchainsym == "evm") {
      onSignMessageEth();
    }
  }, [ethConnected]);
  useEffect(() => {
    // const erebrus_wallet =Cookies.get("erebrus_wallet") ;
    if (peaqConnected && getchainsym == "peaq") {
      onSignMessagepeaq();
    }
  }, [peaqConnected]);

  useEffect(() => {
    const getchainsym = Cookies.get("Chain_symbol");

    // Update the cookie with the new symbol
    if (getchainsym == null) {
      Cookies.set("Chain_symbol", "apt");
    }
  }, []);

  useEffect(() => {
    const token = Cookies.get("erebrus_token");

    // Update the cookie with the new symbol
    if (token == null) {
      setshowchainbutton(true);
    }
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setIsSignedIn(true);
    }

    let timeoutId = null;

    const getSignMessage = async () => {
      if (!address || address !== sessionStorage.getItem("address")) {
        if (timeoutId !== null) {
          clearTimeout(timeoutId);
        }

        timeoutId = setTimeout(() => {
          signOut();
        }, 500);
      } else {
        if (timeoutId !== null) {
          clearTimeout(timeoutId);
        }

        const response = await axios.get("api/getChallengeId", {
          params: { walletAddress: address },
          headers: {
            "Content-Type": "application/json",
          },
        });

        setMessage(response.data.eula + response.data.challangeId);
        setChallengeId(response.data.challangeId);
      }
    };

    getSignMessage();

    return () => {
      if (timeoutId !== null) {
        clearTimeout(timeoutId);
      }
    };
  }, [address, isSignedIn]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const getRandomNumber = () => Math.floor(Math.random() * 1000);
        const apiUrl = `https://api.multiavatar.com/${getRandomNumber()}`;

        const response = await axios.get(apiUrl);
        const svgDataUri = `data:image/svg+xml,${encodeURIComponent(
          response.data
        )}`;
        setAvatarUrl(svgDataUri);
      } catch (error) {
        console.error("Error fetching avatar:", error.message);
      }
    };

    fetchData();
  }, []);

  const signOut = () => {
    sessionStorage.removeItem("token");
    localStorage.removeItem("token");
    setMessage("");
    setSignature("");
    setChallengeId("");
    setIsSignedIn(false);
  };

  const handleDeleteCookie = () => {
    localStorage.setItem("wagmi.io.metamask.disconnected", true);
    Cookies.remove("erebrus_wallet");
    Cookies.remove("erebrus_token");
    Cookies.remove("erebrus_userId");
    Cookies.remove("Chain_symbol");
    signOut();
    if (status == "connected") {
      disconnect();
    }
    if (status == "connected") {
      const timer = setTimeout(() => {
        ethdisconnect();
      }, 100);

      return () => clearTimeout(timer);
    }
    window.location.href = "/";
  };
  //dropdown
  const [selectedDropwdown, setSelectedDropwdown] = useState(false);

  const [selectedOption, setSelectedOption] = useState("Aptos"); // Set default to 'Chain 1'
  const [selectedLogo, setSelectedLogo] = useState("aptosicon");

 

  const handleProfileClick = () => {
    setSelectedDropwdown(false);
  };

  // Delay function
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  const handlePasetoClick = async () => {
    await delay(500);
    setSelectedDropwdown(false);
    setCopied(false);
    setShowPasetoQR(true);
  };

  const [copied, setCopied] = useState(false);
  const paseto = Cookies.get("erebrus_token");

  return (
    <nav className=" py-4 z-10 bg-black">
      <div
        className={`container mx-auto px-10 flex items-center justify-between lg:mb-0 ${
          isHome && !isOpen ? "mb-24" : ""
        }`}
      >
        <div className="flex items-center">
          <Link href="/" scroll={false}>
            <div className="block">
              <img
                src="/Erebrus_logo_wordmark.png"
                alt="Logo"
                className="w-48"
              />
            </div>
          </Link>
          
        </div>

        <div className="hidden lg:flex items-center">
          
          <div
            className="relative z-10"
            onMouseEnter={() => setShowExplorerDropdown(true)}
            onMouseLeave={() => setShowExplorerDropdown(false)}
          >
            {link !== "explorer" ? (
              <Link
                href="/explorer"
                className="text-gray-300 mr-8"
                scroll={false}
                onClick={() => setLink("explorer")}
                style={{
                  textDecoration: "none",
                  position: "relative",
                  borderBottom: router.pathname.includes("explorer")
                    ? "2px solid white"
                    : "",
                }}
              >
                Explorer
              </Link>
            ) : (
              <Link
                href="/explorer"
                className="text-gray-300 mr-8"
                scroll={false}
                style={{
                  textDecoration: "none",
                  position: "relative",
                  borderBottom: "2px solid white",
                }}
              >
                Explorer
              </Link>
            )}

            {showExplorerDropdown && (
              <div
                className="absolute  w-44 origin-top-right rounded-lg shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                style={{ background: 'linear-gradient(to bottom, rgba(32, 37, 58, 1), rgba(66, 79, 127, 1))' }}
              >
                <div className="py-1 z-10">
                  <Link
                    href="/explorer"
                    className="block w-full text-left px-4 py-2 text-lg text-white hover:bg-gray-900"
                  >
                    ÐVPN
                  </Link>
                  <Link
                    href="/dwifi"
                    className="block w-full text-left px-4 py-2 text-lg text-white hover:bg-gray-900"
                  >
                   ÐWi-Fi
                  </Link>
                </div>
              </div>
            )}
          </div>

          

          <Link
            href="https://docs.netsepio.com/erebrus/"
            target="_blank"
            className="text-gray-300 mr-8"
            onMouseOver={(e) =>
              (e.currentTarget.style.borderBottom = "1px solid #fff")
            }
            onMouseOut={(e) => (e.currentTarget.style.borderBottom = "none")}
          >
            Docs
          </Link>

          {link !== "subscription" ? (
            <Link
              href="/subscription"
              className="text-gray-300 mr-8"
              scroll={false}
              onClick={() => {
                setlink("subscription");
              }}
              style={{
                textDecoration: "none",
                position: "relative",
                borderBottom: router.pathname.includes("subscription")
                  ? "2px solid white"
                  : "",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.borderBottom = "1px solid #fff")
              }
              onMouseOut={(e) => (e.currentTarget.style.borderBottom = "none")}
            >
              Dashboard
            </Link>
          ) : (
            <Link
              href="/subscription"
              className="text-gray-300 mr-8"
              scroll={false}
              style={{
                textDecoration: "none",
                position: "relative",
                borderBottom: "2px solid white",
              }}
            >
              Dashboard
            </Link>
          )}
          <div className="px-4">
            {/* dropdown */}

            {showchainbutton && (
            <ChainSelector onChainChange={handleChainChange} />
          )}

            {hidefilter && (
              <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-900 bg-opacity-50">
                <div
                  className="p-8 rounded-3xl shadow-md text-white w-1/4"
                  style={{ backgroundColor: "#0162FF" }}
                >
                  <div className="flex items-center justify-end rounded-t">
                    <button
                      onClick={() => setHideFilter(false)}
                      type="button"
                      className="text-white bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-800 dark:hover:text-white"
                    >
                      <svg
                        className="w-3 h-3"
                        aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 14 14"
                      >
                        <path
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="2"
                          d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                        />
                      </svg>
                      <span className="sr-only">Close modal</span>
                    </button>
                  </div>
                  <h2 className="text-2xl font-bold -mt-4 text-center">
                    Choose a Chain
                  </h2>
                  <ul className="space-y-4 mt-10">
                    <li
                      className="flex items-center justify-between gap-64 p-2 rounded-full"
                      style={{ backgroundColor: "#202333" }}
                    >
                      <button
                        onClick={() => {
                          setHideFilter(false);
                          Cookies.set("Chain_symbol", "evm");
                          setchainsym("evm");
                          setshowsignbuttonpeaq(false);
                          setshowsignbuttoneth(false);
                          setshowsignbuttonsol(false);
                          setshowsignbuttonsui(false);
                          setshowsignbuttonaptos(false);
                        }}
                        // className="mx-auto"
                      >
                        <div className="flex gap-2" style={{ marginLeft: 100 }}>
                          <img src="/mantaicon.png" className="w-6 h-6" />
                          <div>Ethereum</div>
                        </div>
                      </button>
                    </li>
                    <li
                      className="flex items-center justify-between gap-64 p-2 rounded-full"
                      style={{ backgroundColor: "#202333" }}
                    >
                      <button
                        onClick={() => {
                          setHideFilter(false);
                          Cookies.set("Chain_symbol", "peaq");
                          setchainsym("peaq");
                          setshowsignbuttonpeaq(false);
                          setshowsignbuttoneth(false);
                          setshowsignbuttonsol(false);
                          setshowsignbuttonsui(false);
                          setshowsignbuttonaptos(false);
                        }}
                        // className="mx-auto"
                      >
                        <div className="flex gap-2" style={{ marginLeft: 100 }}>
                          <img src="/peaqicon.png" className="w-6 h-6" />
                          <div>Peaq</div>
                        </div>
                      </button>
                    </li>
                    <li
                      className="flex items-center justify-between p-2 rounded-full"
                      style={{ backgroundColor: "#202333" }}
                    >
                      <button
                        onClick={() => {
                          Cookies.set("Chain_symbol", "apt");
                          setchainsym("apt");
                          setshowsignbuttonpeaq(false);
                          setshowsignbuttoneth(false);
                          setshowsignbuttonsol(false);
                          setshowsignbuttonsui(false);
                          setshowsignbuttonaptos(false);
                          setHideFilter(false);
                        }}
                        // className="mx-auto"
                      >
                        <div className="flex gap-2" style={{ marginLeft: 100 }}>
                          <img src="/aptosicon.png" className="w-6 h-6" />
                          <div>Aptos</div>
                        </div>
                      </button>
                    </li>
                    <li
                      className="flex items-center justify-between p-2 rounded-full"
                      style={{ backgroundColor: "#202333" }}
                    >
                      <button
                        onClick={() => {
                          setHideFilter(false);
                          Cookies.set("Chain_symbol", "sui");
                          setchainsym("sui");
                          setshowsignbuttonpeaq(false);
                          setshowsignbuttoneth(false);
                          setshowsignbuttonsol(false);
                          setshowsignbuttonsui(false);
                          setshowsignbuttonaptos(false);
                        }}
                        // className="mx-auto"
                      >
                        <div className="flex gap-2" style={{ marginLeft: 105 }}>
                          <img src="/suiicon.png" className="w-4 h-5" />
                          <div>Sui</div>
                        </div>
                      </button>
                    </li>
                    <li
                      className="flex items-center justify-between p-2 rounded-full"
                      style={{ backgroundColor: "#202333" }}
                    >
                      <button
                        onClick={() => {
                          setHideFilter(false);
                          Cookies.set("Chain_symbol", "sol");
                          setchainsym("sol");
                          setshowsignbuttonpeaq(false);
                          setshowsignbuttoneth(false);
                          setshowsignbuttonsol(false);
                          setshowsignbuttonsui(false);
                          setshowsignbuttonaptos(false);
                        }}
                        // className="mx-auto"
                      >
                        <div className="flex gap-2" style={{ marginLeft: 100 }}>
                          <img src="/solanaicon.png" className="w-6 h-6" />
                          <div>Solana</div>
                        </div>
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            )}
          </div>
          <>
            {!token ? (
              <div className="lg:mt-0 mt-4 z-50 rounded-xl text-white">
                {!aptosConnected && chainsym === "apt" && (
                  <button>
                    <WalletSelectorAntDesign />
                  </button>
                )}
                {chainsym === "evm" && (
                  <button>
                    <w3m-button />
                  </button>
                )}
                {chainsym === "peaq" && (
                  <button>
                    <w3m-button />
                  </button>
                )}
                {chainsym === "sui" && (
                  <button>
                    <ConnectButton />
                  </button>
                )}
                {chainsym === "sol" && (
                  <button>
                    <WalletMultiButton />
                  </button>
                )}
                {chainsym === "google" && (
                  <button
                    className="text-black bg-white rounded-lg w-full px-2"
                    onClick={handleLoginClick}
                  >
                    <div className="flex gap-2 justify-center">
                      <div>
                        {" "}
                        <img
                          src="/googleicon.png"
                          alt=""
                          className="w-10 h-10 rounded-l-lg"
                        />
                      </div>
                      <div className="mt-2">Sign in with Google</div>
                    </div>
                  </button>
                )}
              
              </div>
            ) :  (
              <div
                className="lg:mt-0 mt-4 z-50 rounded-xl flex gap-4"
                style={{ color: "#0162FF" }}
              >
                {avatarUrl && (
                  <UserDropdown
                    avatarUrl={avatarUrl}
                    handlePasetoClick={handlePasetoClick}
                    handleDeleteCookie={handleDeleteCookie}
                    paseto={paseto}
                  />
                )}
              </div>
            )}
          </>

         
        </div>

        <div className="block lg:hidden">
          <button
            className="flex items-center px-3 py-2 rounded-full text-gray-300"
            onClick={toggleMenu}
          >
            <svg className="w-6 h-6" viewBox="0 0 20 20" fill="currentColor">
              {isOpen ? (
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              ) : (
                <path
                  fillRule="evenodd"
                  d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM9 15a1 1 0 011-1h6a1 1 0 110 2h-6a1 1 0 01-1-1z"
                  clipRule="evenodd"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      <motion.nav animate={isOpen ? "open" : "closed"} variants={variants}>
        {isOpen && (
          <div className="bg-transparent py-4">
            <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center lg:justify-between">
              <div className="flex flex-col lg:flex-row items-center">
                <Link
                  href="/explorer"
                  className="text-white font-bold block lg:inline-block mb-4 lg:mr-0 lg:mb-0"
                >
                  Explorer
                </Link>

                <Link
                  href="/subscription"
                  className="text-white font-bold block lg:inline-block mb-4 lg:mr-0 lg:mb-0"
                >
                  Dashboard
                </Link>

                <Link
                  href="https://docs.netsepio.com/erebrus/"
                  target="_blank"
                  className="text-white font-bold block lg:inline-block mb-4 lg:mr-0 lg:mb-0"
                >
                  Docs
                </Link>

                {paseto && (
                  <>
                    {copied && (
                      <p className="text-green-500 pt-2 pl-8">Paseto Copied!</p>
                    )}
                    <button
                      className="block w-full text-left px-4 py-2 text-lg text-white hover:bg-gray-900"
                      onClick={() => {
                        navigator.clipboard.writeText(paseto ? paseto : "");
                        setCopied(true);
                      }}
                    >
                      <div className="flex gap-4" onClick={handlePasetoClick}>
                        <span></span>
                        <span>Copy Paseto</span>
                      </div>
                    </button>
                  </>
                )}

                {account?.address && (
                  <div
                    className="lg:mt-0 mt-4 lg:mr-4 z-50 rounded-xl flex gap-4"
                    style={{ color: "#0162FF" }}
                  >
                    
                    {address && (
                      <button
                        onClick={handleDeleteCookie}
                        onMouseOver={(e) =>
                          (e.currentTarget.style.borderBottom =
                            "1px solid #0162FF")
                        }
                        onMouseOut={(e) =>
                          (e.currentTarget.style.borderBottom = "none")
                        }
                      >
                        Log out
                      </button>
                    )}
                    {avatarUrl && (
                      <img
                        src={avatarUrl}
                        alt="Avatar"
                        className="w-10 ml-auto"
                      />
                    )}
                  </div>
                )}

                {!address && (
                  <div className="lg:mt-0 mt-4 z-50 rounded-xl text-white">
                    {!connected && (
                      <button
                      // onClick={connectWallet}
                      >
                        <WalletSelectorAntDesign />
                      </button>
                    )}
                    {connected && (
                      <SingleSignerTransaction
                        isSendableNetwork={isSendableNetwork}
                        chainsymbol={chainsym}
                      />
                    )}
                  </div>
                )}

                {address && (
                  <div
                    className="lg:mt-0 mt-4 lg:mr-20 z-50 rounded-xl  flex gap-4"
                    style={{ color: "#0162FF" }}
                  >
                    {/* <div>
                {address.slice(0, 4)}...{address.slice(-4)}
              </div> */}
                    <button
                      onClick={() => {
                        disconnect();
                      }}
                      onMouseOver={(e) =>
                        (e.currentTarget.style.borderBottom =
                          "1px solid #0162FF")
                      }
                      onMouseOut={(e) =>
                        (e.currentTarget.style.borderBottom = "none")
                      }
                    >
                      Log out
                    </button>
                    {avatarUrl && (
                      <img
                        src={avatarUrl}
                        alt="Avatar"
                        className="w-10 ml-auto"
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </motion.nav>

      {showPasetoQR && (
        <div
          style={{ backgroundColor: "#040819D9" }}
          className="flex overflow-y-auto overflow-x-hidden fixed inset-0 z-50 justify-center items-center w-full max-h-full"
          id="popupmodal"
        >
          <div
            className="relative px-10 pb-10 pt-6 lg:w-1/4 w-full max-w-2xl max-h-full rounded-3xl"
            style={{ backgroundColor: "white" }}
          >
            <div className="flex items-center justify-end rounded-t dark:border-gray-600">
              <button
                onClick={() => setShowPasetoQR(false)}
                type="button"
                className="text-black bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>
            <div className="relative">
              <div className="text-center text-black text-xl mb-10 -mt-6">
                Scan QR Code
              </div>
              <div className="flex justify-center">
                <QRCodeSVG value={paseto} size={300} />
              </div>

              <div className="flex justify-center gap-4 text-black mt-10">
                <button
                  onClick={async () => {
                    navigator.clipboard.writeText(paseto ? paseto : "");
                    setCopied(true);
                    await delay(3000);
                    setCopied(false);
                  }}
                  className="border border-black p-2 rounded-lg"
                >
                  Copy Auth Token
                </button>

                {copied && (
                  <p className="text-green-500 pt-2 pl-8">Paseto Copied!</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
