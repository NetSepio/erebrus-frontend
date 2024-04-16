import Link from "next/link";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { motion } from "framer-motion";
// import { AuthContext } from "../AuthContext";
// import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { useWallet } from "@solana/wallet-adapter-react";
// import { Connector } from '@web3-react/types'
// import { WalletConnector } from "@aptos-labs/wallet-adapter-mui-design";
import Button from "./Button";
import { useRouter } from "next/router";
import SingleSignerTransaction from "./transactionFlow/SingleSigner";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base";
// import { Web3ReactSelectedHooks } from '@web3-react/core'

const network = WalletAdapterNetwork.Devnet;
const REACT_APP_GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL;
const mynetwork = process.env.NEXT_PUBLIC_NETWORK;
const variants = {
  open: { opacity: 1, x: 0, y: 0 },
  closed: { opacity: 0, y: 0 },
};

const isSendableNetwork = (connected, network) => {
  return connected && network;
};

const Navbar = ({ isHome }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [signature, setSignature] = useState("");
  const [challengeId, setChallengeId] = useState("");
  const [showsignbutton, setshowsignbutton] = useState(false);
  const [link, setlink] = useState("");
  // const { isSignedIn, setIsSignedIn } = useContext(AuthContext);
  const [avatarUrl, setAvatarUrl] = useState("");
  // const sdk = useSDK();
  // const {useSelectedAccount, useSelectedChainId, useSelectedIsActive, useSelectedIsActivating } = hooks
  // const account = useSelectedAccount(Connector)
  const { wallet, connected, signMessage, publicKey } = useWallet();

  let sendable = isSendableNetwork(connected, network);
  const account = publicKey;
  const router = useRouter();
  // console.log("router", router);
  console.log(connected);
  console.log("account details", account);

  const address = Cookies.get("erebrus_wallet");
  const token = Cookies.get("erebrus_token");
  console.log(address);
  console.log(token);

  useEffect(() => {
    if (account) {
      // Update the cookie with the new address
      Cookies.set("erebrus_wallet", account);
      onSignMessage();
    }
  }, [account]);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

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

  const getPhantomWallet = () => {
    if ("solana" in window) {
      return window.solana;
    } else {
      window.open("https://phantom.app/", "_blank");
    }
  };

  const connectWallet = async () => {
    const wallet = getPhantomWallet();
    try {
      const response = await wallet.connect();

      const account = await wallet.account();
      console.log("account", account);

      // Get the current network after connecting (optional)
      const networkwallet = await window.solana.network();

      // Check if the connected network is Mainnet
      if (networkwallet === mynetwork) {
        const { data } = await axios.get(
          `${REACT_APP_GATEWAY_URL}api/v1.0/flowid/sol?walletAddress=${address}`
        );
        console.log(data);

        const message = data.payload.eula;
        const nonce = data.payload.flowId;
        const publicKey = account.publicKey;

        const { signature, fullMessage } = await wallet.signMessage({
          message,
          nonce,
        });
        console.log("sign", signature, "full message", fullMessage);

        let signaturewallet = signature;

        if (signaturewallet.length === 128) {
          signaturewallet = `0x${signaturewallet}`;
        }

        const authenticationData = {
          flowId: nonce,
          // signature: `${signaturewallet}`,
          // pubKey: publicKey,
          walletAddress: address,
        };

        const authenticateApiUrl = `${REACT_APP_GATEWAY_URL}api/v1.0/authenticate/NonSign`;

        const config = {
          url: authenticateApiUrl,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          data: authenticationData,
        };

        try {
          const response = await axios(config);
          console.log("auth data", response.data);
          const token = await response?.data?.payload?.token;
          const userId = await response?.data?.payload?.userId;
          // localStorage.setItem("platform_token", token);
          Cookies.set("erebrus_token", token, { expires: 7 });
          Cookies.set("erebrus_wallet", address, { expires: 7 });
          Cookies.set("erebrus_userid", userId, { expires: 7 });

          // setUserWallet(account.address);
          window.location.reload();
        } catch (error) {
          console.error(error);
        }
      } else {
        alert(`Switch to ${mynetwork} in your wallet`);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const onSignMessage = async () => {
    if (sendable) {
      try {
        const REACT_APP_GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL;

        const { data } = await axios.get(
          `${REACT_APP_GATEWAY_URL}api/v1.0/flowid/sol?walletAddress=${address}`
        );
        console.log(data);

        const message = data.payload.eula;
        const nonce = data.payload.flowId;
        const publicKey = address;

        const payload = {
          message: message,
          nonce: nonce,
        };
        // const response = await signMessage(payload);
        // console.log(response);

        // let signaturewallet = response.signature;

        // if (signaturewallet.length === 128) {
        //   signaturewallet = `0x${signaturewallet}`;
        // }

        const authenticationData = {
          flowId: nonce,
          // "signature": `${signaturewallet}`,
          // "pubKey": publicKey,
          walletAddress: address,
        };

        const authenticateApiUrl = `${REACT_APP_GATEWAY_URL}api/v1.0/authenticate/NonSign`;

        const config = {
          url: authenticateApiUrl,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          data: authenticationData,
        };

        const authResponse = await axios(config);
        console.log("auth data", authResponse.data);

        const token = await authResponse?.data?.payload?.token;
        const userId = await authResponse?.data?.payload?.userId;

        Cookies.set("erebrus_token", token, { expires: 7 });
        Cookies.set("erebrus_wallet", address, { expires: 7 });
        Cookies.set("erebrus_userid", userId, { expires: 7 });

        window.location.reload();
      } catch (error) {
        console.error(error);
        setshowsignbutton(true);
      }
    } else {
      alert(`Switch to ${mynetwork} in your wallet`);
    }
  };

  const handleDeleteCookie = () => {
    Cookies.remove("erebrus_wallet");
    Cookies.remove("erebrus_token");
    window.location.href = "/";
  };

  return (
    <nav className="bg-transparent py-4">
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
          {/* <Link href="/" scroll={false}>
            <h1 className="text-xl font-bold text-white ml-2">EREBRUS</h1>
          </Link> */}
        </div>
        <div className="hidden lg:flex items-center">
          {link !== "subscription" ? (
            <Link
              href="/mint"
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
              Mint
            </Link>
          ) : (
            <Link
              href="/mint"
              className="text-gray-300 mr-8"
              scroll={false}
              style={{
                textDecoration: "none",
                position: "relative",
                borderBottom: "2px solid white",
              }}
            >
              Mint
            </Link>
          )}

          {link !== "explorer" ? (
            <Link
              href="/explorer"
              className="text-gray-300 mr-8"
              scroll={false}
              onClick={() => {
                setlink("explorer");
              }}
              style={{
                textDecoration: "none",
                position: "relative",
                borderBottom: router.pathname.includes("explorer")
                  ? "2px solid white"
                  : "",
              }}
              onMouseOver={(e) =>
                (e.currentTarget.style.borderBottom = "1px solid #fff")
              }
              onMouseOut={(e) => (e.currentTarget.style.borderBottom = "none")}
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

          {/* { link !== "mint" ?(
          <Link
            href="/mint"
            className="text-gray-300 mr-8"
            scroll={false}
            onClick={()=> {setlink("mint")}}
            style={{ textDecoration: "none", position: "relative",
            borderBottom: router.pathname.includes('mint') ? '2px solid white' : '', }}
  onMouseOver={(e) => (e.currentTarget.style.borderBottom = "1px solid #fff")}
  onMouseOut={(e) => (e.currentTarget.style.borderBottom = "none")}
          >
            Mint NFT
          </Link>):
          (
<Link
            href="/mint"
            className="text-gray-300 mr-8"
            scroll={false}
            style={{ textDecoration: "none", position: "relative",
            borderBottom:'2px solid white'}}
          >
            Mint NFT
          </Link>
          )} */}

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
              Subscription
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
              Subscription
            </Link>
          )}

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
          {!token ? (
            <div className="lg:mt-0 mt-4 z-50 rounded-xl text-white">
              {!connected && (
                <button
                // onClick={connectWallet}
                >
                  <WalletMultiButton />
                </button>
              )}
              {connected && showsignbutton && (
                <Button
                  color={"blue"}
                  onClick={onSignMessage}
                  disabled={false}
                  message={"Authenticate"}
                />
              )}
            </div>
          ) : (
            <div
              className="lg:mt-0 mt-4 z-50 rounded-xl flex gap-4"
              style={{ color: "#0162FF" }}
            >
              {/* <div>
                {address?.slice(0, 4)}...{address?.slice(-4)}
              </div> */}
              <button
                onClick={handleDeleteCookie}
                onMouseOver={(e) =>
                  (e.currentTarget.style.borderBottom = "1px solid #0162FF")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.borderBottom = "none")
                }
              >
                Log out
              </button>
              {avatarUrl && (
                <img src={avatarUrl} alt="Avatar" className="w-10 ml-auto" />
              )}
            </div>
          )}
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
                  Subscription
                </Link>

                <Link
                  href="https://docs.netsepio.com/erebrus/"
                  target="_blank"
                  className="text-white font-bold block lg:inline-block mb-4 lg:mr-0 lg:mb-0"
                >
                  Docs
                </Link>

                {account?.address && (
                  <div
                    className="lg:mt-0 mt-4 lg:mr-4 z-50 rounded-xl flex gap-4"
                    style={{ color: "#0162FF" }}
                  >
                    {/* <div>
                {account?.address.slice(0, 4)}...{account?.address.slice(-4)}
              </div> */}
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
                        <WalletMultiButton />
                      </button>
                    )}
                    {connected && (
                      <SingleSignerTransaction
                        isSendableNetwork={isSendableNetwork}
                      />
                    )}
                  </div>
                )}

                {address && (
                  <div
                    className="lg:mt-0 mt-4 lg:mr-20 z-50 rounded-xl flex gap-4"
                    style={{ color: "#0162FF" }}
                  >
                    {/* <div>
                {address.slice(0, 4)}...{address.slice(-4)}
              </div> */}
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
    </nav>
  );
};

export default Navbar;
