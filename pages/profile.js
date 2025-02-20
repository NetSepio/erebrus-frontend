"use client";
import Cookies from "js-cookie";
import axios from "axios";
import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { NFTStorage } from "nft.storage";
const API_KEY = process.env.NEXT_PUBLIC_STORAGE_API;
const REACT_APP_GATEWAY_URL = process.env.NEXT_PUBLIC_EREBRUS_GATEWAY_URL;

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [profileset, setprofileset] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [msg, setMsg] = useState("");
  const [auth, setauth] = useState(true);
  const [loggedin, setloggedin] = useState(false);
  const [change, setchange] = useState(false);
  const [linkpopup, setlinkpopup] = useState(false);
  const [unlinkpopup, setunlinkpopup] = useState(false);
  const [magiclinkpopup, setmagiclinkpopup] = useState(false);
  const [gmail, setgmail] = useState("");
  const [code, setcode] = useState("");
  const [magicmessage, setmagicmessage] = useState("");
  const [magicloginmessage, setmagicloginmessage] = useState(false);
  const [idtoken, setidtoken] = useState("");

  const chainsym = Cookies.get("Chain_symbol");
  const walletaddr = Cookies.get("erebrus_wallet");

  const navigate = (path) => {
    window.location.href = path;
  };

  const border = {
    // backgroundColor: "#30385F",
    border: "1px solid #788AA3",
  };

  const button = {
    backgroundColor: "#0162FF",
  };

  const bgverify = {
    backgroundColor: "#141a31",
  };

  const text = {
    color: "#788AA3",
  };

  const initialFormData = {
    name: "",
    country: "",
    emailId: "",
    discord: "",
    twitter: "",
    google: "",
    apple: "",
    telegram: "",
    farcaster: "",
    profilePictureUrl: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: value,
    }));
  };

  async function uploadImage(e) {
    e.preventDefault();
    try {
      setLoading(true);

      const file = e.target.files[0];
      if (!file) {
        throw new Error("No file selected");
      }

      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/uploadToIPFS", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Upload failed: ${response.statusText}`);
      }

      const data = await response.json();
      setFormData((prevData) => ({
        ...prevData,
        profilePictureUrl: `${data.Hash}`,
      }));

      console.log("profilePictureUrl", data.Hash);
    } catch (error) {
      console.log("Error uploading file:", error);
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const auth = Cookies.get("erebrus_token");

    try {
      const formDataObject = {
        name: formData.name,
        country: formData.country,
        emailId: formData.emailId,
        discord: formData.discord,
        twitter: formData.twitter,
        google: formData.google,
        apple: formData.apple,
        telegram: formData.telegram,
        farcaster: formData.farcaster,
        profilePictureUrl: formData.profilePictureUrl,
      };

      // Convert to JSON string
      const jsonData = JSON.stringify(formDataObject);

      const response = await fetch(`${REACT_APP_GATEWAY_URL}api/v1.0/profile`, {
        method: "PATCH",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth}`,
        },
        body: jsonData,
      });

      if (response.status === 200) {
        setFormData(initialFormData);
        setMsg("success");
        setprofileset(true);
      } else {
        setMsg("error");
      }
    } catch (error) {
      console.error("Error:", error);
      setMsg("error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        const auth = Cookies.get("erebrus_token");

        const response = await axios.get(
          `${REACT_APP_GATEWAY_URL}api/v1.0/profile`,
          {
            headers: {
              Accept: "application/json, text/plain, */*",
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth}`,
            },
          }
        );

        if (response.status === 200) {
          setProfileData(response.data.payload);
          setFormData({
            name: response.data.payload.name || "",
            country: response.data.payload.country || "",
            emailId: response.data.payload.email || "",
            discord: response.data.payload.discord || "",
            twitter: response.data.payload.twitter || "",
            google: response.data.payload.google || "",
            apple: response.data.payload.apple || "",
            telegram: response.data.payload.telegram || "",
            farcaster: response.data.payload.farcaster || "",
            profilePictureUrl: response.data.payload.profilePictureUrl || "",
          });
          if (!response.data.payload.email) {
            setauth(false);
          }
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [profileset, unlinkpopup, linkpopup, magiclinkpopup]);

  const wallet = Cookies.get("platform_wallet");

  const handleMagicLink = async () => {
    const auth = Cookies.get("erebrus_token");

    const obj = { email: gmail };
    const jsonData = JSON.stringify(obj);

    Cookies.set("magic_link", gmail, { expires: 7 });

    try {
      const response = await axios.post(
        `${REACT_APP_GATEWAY_URL}api/v1.0/account/generate-auth-id`,
        {
          ...obj,
        },
        {
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            // Authorization: `Bearer ${auth}`,
          },
        }
      );

      const responseData = await response.data;
      console.log("magic link response:", responseData);
      setmagicmessage(responseData.message);
    } catch (error) {
      console.error("magic link error:", error);
    }
  };

  const handleMagicLogin = async () => {
    const auth = Cookies.get("erebrus_token");

    const obj = { code: code, emailId: gmail };
    const jsonData = JSON.stringify(obj);

    try {
      const response = await axios.post(
        `${REACT_APP_GATEWAY_URL}api/v1.0/account/paseto-from-magic-link`,
        {
          ...obj,
        },
        {
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth}`,
          },
        }
      );

      const responseData = await response.data;
      console.log("magic login response:", responseData);
      setmagicloginmessage(true);
    } catch (error) {
      console.error("magic login error:", error);
    }
  };

  const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID;
  const REDIRECT_URI = process.env.NEXT_PUBLIC_REDIRECT_URI_PROFILE;
  const CLIENT_SECRET = process.env.NEXT_PUBLIC_CLIENT_SECRET;

  const handleLoginClick = () => {
    const state = Math.random().toString(36).substring(7);
    const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=openid%20profile%20email&state=${state}`;
    window.location.href = authUrl;
  };

  const parseAuthorizationCode = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get("code");

    if (code) {
      localStorage?.setItem("code", code);
      exchangeCodeForToken(code);
      console.log("code", code);
    }
  };

  const exchangeCodeForToken = async (code) => {
    const tokenEndpoint = "https://www.googleapis.com/oauth2/v4/token";

    const tokenRequestBody = {
      code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: "authorization_code",
    };

    try {
      const response = await fetch(tokenEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(tokenRequestBody).toString(),
      });

      const tokenData = await response.json();

      // Assuming id_token is present in tokenData
      const idToken = tokenData.id_token;

      // setpage("googlewalletboth");

      // Use idToken in another API call
      setidtoken(idToken);
      // await getgoogledata(idToken);

      handleTokenData(tokenData);
      console.log("token", tokenData);
    } catch (error) {
      console.error("Token exchange error:", error);
    }
  };

  const handleTokenData = (tokenData) => {
    window.history.replaceState({}, document.title, window.location.pathname);
  };

  useEffect(() => {
    parseAuthorizationCode();
  }, []);

  const handleremoveClick = async () => {
    const auth = Cookies.get("erebrus_token");

    try {
      const response = await axios.delete(
        `${REACT_APP_GATEWAY_URL}api/v1.0/account/remove-mail`,
        {
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth}`,
          },
        }
      );

      const responseData = await response.data;
      console.log("Another API call response:", responseData);
      setunlinkpopup(false);
    } catch (error) {
      console.error("Another API call error:", error);
    }
  };

  useEffect(() => {
    const handleConnectWallet = async () => {
      const loggedin = Cookies.get("erebrus_token");
      // const auth = Cookies.get("google_token");
      if (loggedin) {
        setloggedin(true);
      }
    };
    handleConnectWallet();
  }, [change]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setMsg("");
    }, 3000); // 5 seconds in milliseconds

    return () => clearTimeout(timeoutId);
  }, [msg]);

  function removePrefix(url) {
    // Use the slice method to remove the first 7 characters
    return url.slice(7);
  }

  // Define a mapping of chain symbols to names and icons
  const chainInfo = {
    apt: {
      name: "Aptos",
      icon: "/aptosicon.webp", // Replace with the actual path or URL
    },
    sui: {
      name: "Sui",
      icon: "/suiicon.webp", // Replace with the actual path or URL
    },
    evm: {
      name: "Ethereum",
      icon: "/ethicon.webp", // Replace with the actual path or URL
    },
    sol: {
      name: "Solana",
      icon: "/solanaicon.webp", // Replace with the actual path or URL
    },
    monad: {
      name: "Monad",
      icon: "/monad.webp", // Replace with the actual path or URL
    },
  };

  const chainDetails = chainInfo[chainsym?.toLowerCase()] || {
    name: "Unknown Chain",
    icon: "",
  };

  return (
    <div>
      <section className="min-h-screen">
        <div className="px-4 sm:px-6 lg:px-10 mx-auto">
          {/* Success Message */}
          <div className="flex justify-center">
            {msg == "success" && (
              <div className="text-center">
                <div
                  style={button}
                  className="flex gap-1 px-4 py-3 text-xs text-white font-semibold rounded-lg sm:mb-0"
                >
                  Changes Saved
                </div>
              </div>
            )}
          </div>

          {/* Edit Mode */}
          {!profileset && (
            <section className="pb-10 rounded-xl">
              <div className="px-4 sm:px-6 lg:px-24 mx-auto rounded-xl">
                <div className="w-full mx-auto text-left py-6 sm:py-10">
                  <h1 className="mt-4 sm:mt-10 text-3xl sm:text-4xl font-semibold leading-none tracking-normal text-gray-100">
                    <span className="text-white">Profile Information</span>
                  </h1>

                  <form
                    id="myForm"
                    className="rounded pt-6 sm:pt-10"
                    onSubmit={handleSubmit}
                  >
                    <div className="flex flex-col lg:flex-row gap-8">
                      {/* Profile Picture Section */}
                      <div className="flex justify-center lg:justify-start lg:ml-10">
                        <div className="rounded-2xl h-32 w-32 sm:h-36 sm:w-36 relative group">
                          {formData.profilePictureUrl ? (
                            <>
                              <img
                                alt="Profile"
                                src={`https://ipfs.myriadflow.com/ipfs/${formData.profilePictureUrl}`}
                                className="rounded-2xl w-full h-full object-cover"
                                onError={(e) => {
                                  e.target.onerror = null; // Prevent infinite loop
                                  e.target.src =
                                    "https://thumbs.dreamstime.com/b/female-user-profile-avatar-woman-character-screen-saver-emotions-website-mobile-app-design-vector-199001739.jpg";
                                }}
                              />
                              <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 rounded-2xl flex items-center justify-center transition-opacity">
                                <label
                                  htmlFor="upload"
                                  className="cursor-pointer"
                                >
                                  <input
                                    id="upload"
                                    type="file"
                                    className="hidden"
                                    onChange={uploadImage}
                                    accept="image/*"
                                  />
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-10 w-10 text-white"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"
                                    />
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth={2}
                                      d="M15 13a3 3 0 11-6 0 3 3 0 016 0z"
                                    />
                                  </svg>
                                </label>
                              </div>
                            </>
                          ) : (
                            <label
                              htmlFor="upload"
                              className="flex flex-col items-center justify-center gap-2 cursor-pointer h-full w-full border-2 border-dashed border-gray-300 rounded-2xl hover:bg-gray-900 transition-colors"
                            >
                              <input
                                id="upload"
                                type="file"
                                className="hidden"
                                onChange={uploadImage}
                                accept="image/*"
                              />
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-10 w-10 text-gray-300"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                                />
                              </svg>
                              <span className="text-gray-300 text-sm">
                                Upload Photo
                              </span>
                            </label>
                          )}
                        </div>
                      </div>

                      {/* Form Fields Section */}
                      <div className="w-full lg:w-3/4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div className="mb-4 sm:mb-6">
                            <label
                              htmlFor="name"
                              className="block text-gray-200 mb-2"
                            >
                              Name
                            </label>
                            <input
                              type="text"
                              id="name"
                              style={border}
                              className="shadow border bg-black appearance-none rounded-lg w-full py-3 sm:py-4 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline"
                              placeholder="Your Name"
                              value={formData.name}
                              onChange={handleInputChange}
                            />
                          </div>

                          <div className="mb-4 sm:mb-6">
                            <label
                              htmlFor="country"
                              className="block text-gray-200 mb-2"
                            >
                              Country
                            </label>
                            <input
                              type="text"
                              id="country"
                              style={border}
                              className="shadow border bg-black appearance-none rounded-lg w-full py-3 sm:py-4 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline"
                              placeholder="Country"
                              value={formData.country}
                              onChange={handleInputChange}
                            />
                          </div>

                          <div className="mb-4 sm:mb-6">
                            <label
                              htmlFor="emailId"
                              className="block text-gray-200 mb-2"
                            >
                              Email
                            </label>
                            <input
                              type="email"
                              id="emailId"
                              style={border}
                              className="shadow border bg-black appearance-none rounded-lg w-full py-3 sm:py-4 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline"
                              placeholder="Email"
                              value={formData.emailId}
                              onChange={handleInputChange}
                            />
                          </div>

                          <div className="mb-4 sm:mb-6">
                            <label
                              htmlFor="discord"
                              className="block text-gray-200 mb-2"
                            >
                              Discord
                            </label>
                            <input
                              type="text"
                              id="discord"
                              style={border}
                              className="shadow border bg-black appearance-none rounded-lg w-full py-3 sm:py-4 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline"
                              placeholder="Discord"
                              value={formData.discord}
                              onChange={handleInputChange}
                            />
                          </div>

                          <div className="mb-4 sm:mb-6">
                            <label
                              htmlFor="twitter"
                              className="block text-gray-200 mb-2"
                            >
                              Twitter
                            </label>
                            <input
                              type="text"
                              id="twitter"
                              style={border}
                              className="shadow border bg-black appearance-none rounded-lg w-full py-3 sm:py-4 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline"
                              placeholder="Twitter"
                              value={formData.twitter}
                              onChange={handleInputChange}
                            />
                          </div>

                          <div className="mb-4 sm:mb-6">
                            <label
                              htmlFor="telegram"
                              className="block text-gray-200 mb-2"
                            >
                              Telegram
                            </label>
                            <input
                              type="text"
                              id="telegram"
                              style={border}
                              className="shadow border bg-black appearance-none rounded-lg w-full py-3 sm:py-4 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline"
                              placeholder="Telegram"
                              value={formData.telegram}
                              onChange={handleInputChange}
                            />
                          </div>

                          <div className="mb-4 sm:mb-6">
                            <label
                              htmlFor="farcaster"
                              className="block text-gray-200 mb-2"
                            >
                              Farcaster
                            </label>
                            <input
                              type="text"
                              id="farcaster"
                              style={border}
                              className="shadow border bg-black appearance-none rounded-lg w-full py-3 sm:py-4 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline"
                              placeholder="Farcaster"
                              value={formData.farcaster}
                              onChange={handleInputChange}
                            />
                          </div>

                          <div className="mb-4 sm:mb-6">
                            <label
                              htmlFor="google"
                              className="block text-gray-200 mb-2"
                            >
                              Google
                            </label>
                            <input
                              type="text"
                              id="google"
                              style={border}
                              className="shadow border bg-black appearance-none rounded-lg w-full py-3 sm:py-4 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline"
                              placeholder="Google"
                              value={formData.google || ""}
                              onChange={handleInputChange}
                            />
                          </div>

                          <div className="mb-4 sm:mb-6">
                            <label
                              htmlFor="apple"
                              className="block text-gray-200 mb-2"
                            >
                              Apple
                            </label>
                            <input
                              type="text"
                              id="apple"
                              style={border}
                              className="shadow border bg-black appearance-none rounded-lg w-full py-3 sm:py-4 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline"
                              placeholder="Apple"
                              value={formData.apple || ""}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>

                        {/* Submit Button */}
                        <div className="text-center mt-6 sm:mt-8">
                          <div className="pb-6 sm:pb-10">
                            <button
                              style={button}
                              type="submit"
                              value="submit"
                              className="px-8 sm:px-14 py-3 text-base sm:text-lg text-white font-semibold rounded-lg w-full sm:w-auto"
                            >
                              Change details
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </section>
          )}

          {/* Display Mode */}
          {profileset && (
            <section className="pb-0 rounded-xl">
              <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Section */}
                <div className="pt-4 sm:pt-8 lg:pt-16 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-gray-100 mb-4 sm:mb-0">
                    Profile information
                  </h1>
                  <div className="flex flex-wrap gap-2 text-black text-sm">
                    <div
                      className="px-2 py-1.5 rounded-lg flex items-center space-x-2"
                      style={{ backgroundColor: "#8EB9FF" }}
                    >
                      {chainDetails.icon && (
                        <img
                          src={chainDetails.icon}
                          alt={`${chainDetails.name} icon`}
                          className="w-5 h-5"
                        />
                      )}
                      <span className="pr-2">{chainDetails.name}</span>
                    </div>
                    <div
                      className="px-3 py-1.5 rounded-lg"
                      style={{ backgroundColor: "#8EB9FF" }}
                    >
                      {walletaddr?.slice(0, 4)}...{walletaddr?.slice(-4)}
                    </div>
                  </div>
                </div>

                {/* Profile Content */}
                <div className="w-full mx-auto text-left mt-4 sm:mt-8">
                  <form id="myForm" className="rounded">
                    <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
                      {/* Profile Picture */}
                      <div className="lg:w-1/4">
                        <div className="flex items-center justify-center mb-6 lg:mb-0">
                          <div className="rounded-2xl h-32 w-32 sm:h-36 sm:w-36">
                            {profileData?.profilePictureUrl ? (
                              <img
                                alt="Profile"
                                src={`https://ipfs.myriadflow.com/ipfs/${formData.profilePictureUrl}`}
                              />
                            ) : (
                              <div className="rounded-2xl h-36 w-36 ring-offset-2 ring-1 ring-black bg-gray-200">
                                <img
                                  alt="Default Profile"
                                  src="https://thumbs.dreamstime.com/b/female-user-profile-avatar-woman-character-screen-saver-emotions-website-mobile-app-design-vector-199001739.jpg"
                                  className="rounded-2xl mx-auto object-cover w-full h-full"
                                />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Profile Fields */}
                      <div className="lg:w-3/4">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                          <div className="mb-4">
                            <label className="block text-gray-200 mb-2">
                              Name
                            </label>
                            <div
                              style={border}
                              className="shadow border appearance-none rounded w-full py-4 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline"
                            >
                              {profileData?.name || "Name"}
                            </div>
                          </div>

                          <div className="mb-4">
                            <label className="block text-gray-200 mb-2">
                              Country
                            </label>
                            <div
                              style={border}
                              className="shadow border appearance-none rounded w-full py-4 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline"
                            >
                              {profileData?.country || "Country"}
                            </div>
                          </div>

                          <div className="mb-4">
                            <label className="block text-gray-200 mb-2">
                              Email
                            </label>
                            <div
                              style={border}
                              className="shadow border appearance-none rounded w-full py-4 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline"
                            >
                              {profileData?.email || "Email"}
                            </div>
                          </div>

                          <div className="mb-4">
                            <label className="block text-gray-200 mb-2">
                              Discord
                            </label>
                            <div
                              style={border}
                              className="shadow border appearance-none rounded w-full py-4 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline"
                            >
                              {profileData?.discord || "Discord"}
                            </div>
                          </div>

                          <div className="mb-4">
                            <label className="block text-gray-200 mb-2">
                              Twitter
                            </label>
                            <div
                              style={border}
                              className="shadow border appearance-none rounded w-full py-4 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline"
                            >
                              {profileData?.twitter || "Twitter"}
                            </div>
                          </div>

                          <div className="mb-4">
                            <label className="block text-gray-200 mb-2">
                              Telegram
                            </label>
                            <div
                              style={border}
                              className="shadow border appearance-none rounded w-full py-4 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline"
                            >
                              {profileData?.telegram || "Telegram"}
                            </div>
                          </div>

                          <div className="mb-4">
                            <label className="block text-gray-200 mb-2">
                              Farcaster
                            </label>
                            <div
                              style={border}
                              className="shadow border appearance-none rounded w-full py-4 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline"
                            >
                              {profileData?.farcaster || "Farcaster"}
                            </div>
                          </div>

                          <div className="mb-4">
                            <label className="block text-gray-200 mb-2">
                              Google
                            </label>
                            <div
                              style={border}
                              className="shadow border appearance-none rounded w-full py-4 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline"
                            >
                              {profileData?.google || "Google"}
                            </div>
                          </div>

                          <div className="mb-4">
                            <label className="block text-gray-200 mb-2">
                              Apple
                            </label>
                            <div
                              style={border}
                              className="shadow border appearance-none rounded w-full py-4 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline"
                            >
                              {profileData?.apple || "Apple"}
                            </div>
                          </div>
                        </div>

                        {/* Edit Button */}
                        <div className="text-center mt-6 sm:mt-8">
                          <button
                            style={button}
                            onClick={() => setprofileset(false)}
                            className="px-8 sm:px-14 py-3 text-base sm:text-lg text-white font-semibold rounded-lg w-full sm:w-auto"
                          >
                            Edit Profile
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </section>
          )}
        </div>
      </section>
    </div>
  );
};

export default Profile;
