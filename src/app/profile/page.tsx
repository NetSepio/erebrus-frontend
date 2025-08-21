"use client";

import React from "react";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axios from "axios";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Camera,
  User,
  MapPin,
  Mail,
  MessageSquare,
  AtSign,
  Globe,
  Apple,
  Edit,
  Save,
  X,
  Check,
  Upload,
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWalletAuth } from "@/context/appkit";
import { toast } from "sonner";

const REACT_APP_GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL

interface FormData {
  name: string;
  country: string;
  emailId: string;
  discord: string;
  twitter: string;
  google: string;
  apple: string;
  telegram: string;
  farcaster: string;
  profilePictureUrl: string;
}

interface ChainInfo {
  name: string;
  icon: string;
}

interface ChainInfoMap {
  [key: string]: ChainInfo;
}

// NFT interfaces for Magic Eden API
interface SolanaNFT {
  mintAddress: string;
  name: string;
  collectionName?: string;
  image: string;
  description?: string;
  attributes?: Array<{
    trait_type: string;
    value: string | number;
  }>;
  owner: string;
  tokenStandard?: string;
  isCompressed?: boolean;
}

interface MagicEdenNFTResponse {
  symbol: string;
  tokenMint: string;
  collection: string;
  name: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string | number;
  }>;
}

const Profile = () => {
  // Use the updated authentication hook
  const { isConnected, address, isAuthenticated, isVerified } = useWalletAuth();

  const [tempFormData, setTempFormData] = useState<FormData>({
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
  });
  const [loading, setLoading] = useState(false);
  const [profileset, setprofileset] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);
  const [msg, setMsg] = useState("");
  const [auth, setauth] = useState(true);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [idtoken, setidtoken] = useState("");
  const [loggedin, setloggedin] = useState(false);
  const [change, setchange] = useState(false);
  const [unlinkpopup, setunlinkpopup] = useState(false);

  // Email OTP verification states
  const [showOtpDialog, setShowOtpDialog] = useState(false);
  const [otpCode, setOtpCode] = useState("");
  const [isOtpSending, setIsOtpSending] = useState(false);
  const [isOtpVerifying, setIsOtpVerifying] = useState(false);
  const [pendingEmailUpdate, setPendingEmailUpdate] = useState("");
  const [otpSentEmail, setOtpSentEmail] = useState("");
  const [emailValidationError, setEmailValidationError] = useState<
    string | null
  >(null);

  // NFT states
  const [userNFTs, setUserNFTs] = useState<SolanaNFT[]>([]);
  const [isLoadingNFTs, setIsLoadingNFTs] = useState(false);
  const [nftError, setNftError] = useState<string | null>(null);

  // Helper function to get the correct authentication token
  const getAuthToken = () => {
    const solanaToken = Cookies.get("erebrus_token_solana");
    const evmToken = Cookies.get("erebrus_token_evm");
    return solanaToken || evmToken || null;
  };

  // Enhanced authentication check
  const isUserAuthenticated = () => {
    const token = getAuthToken();
    const walletFromCookie = Cookies.get("erebrus_wallet");
    return !!(
      isConnected &&
      address &&
      token &&
      walletFromCookie?.toLowerCase() === address.toLowerCase()
    );
  };

  // Magic Eden API functions for fetching Solana NFTs
  const fetchUserNFTsFromMagicEden = async (
    walletAddress: string
  ): Promise<SolanaNFT[]> => {
    try {
      // Use our internal API route to avoid CORS issues
      const response = await fetch(
        `/api/nfts?wallet=${encodeURIComponent(walletAddress)}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `NFT API error: ${response.status} ${response.statusText}`
        );
      }

      const nftData: MagicEdenNFTResponse[] = await response.json();

      // Transform the Magic Eden response to our NFT format
      const transformedNFTs: SolanaNFT[] = nftData.map((nft) => ({
        mintAddress: nft.tokenMint,
        name: nft.name || "Unnamed NFT",
        collectionName: nft.collection || nft.symbol,
        image: nft.image || "", // Magic Eden provides direct image URLs
        description: "", // Magic Eden v2 API doesn't include description in wallet endpoint
        attributes: nft.attributes || [],
        owner: walletAddress,
        tokenStandard: "NonFungible",
        isCompressed: false,
      }));

      return transformedNFTs;
    } catch (error) {
      throw error;
    }
  };

  // Alternative: Use Helius/Metaplex for more comprehensive NFT data
  const fetchUserNFTsFromHelius = async (
    walletAddress: string
  ): Promise<SolanaNFT[]> => {
    try {
      // You can replace with your Helius API key if you have one
      const HELIUS_API_KEY = process.env.NEXT_PUBLIC_HELIUS_API_KEY || "demo";

      const response = await fetch(
        `https://api.helius.xyz/v0/addresses/${walletAddress}/nfts?api-key=${HELIUS_API_KEY}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Helius API error: ${response.status} ${response.statusText}`
        );
      }

      const nftData = await response.json();

      // Transform Helius response to our format
      const transformedNFTs: SolanaNFT[] = nftData.map((nft: any) => ({
        mintAddress: nft.id,
        name: nft.content?.metadata?.name || "Unnamed NFT",
        collectionName: nft.grouping?.[0]?.group_value || "Unknown Collection",
        image: nft.content?.links?.image || nft.content?.files?.[0]?.uri || "",
        description: nft.content?.metadata?.description || "",
        attributes: nft.content?.metadata?.attributes || [],
        owner: walletAddress,
        tokenStandard: nft.interface || "NonFungible",
        isCompressed: nft.compression?.compressed || false,
      }));

      return transformedNFTs;
    } catch (error) {
      throw error;
    }
  };

  // Main function to fetch user's NFTs (tries multiple sources)
  const fetchUserNFTs = async (walletAddress: string): Promise<void> => {
    setIsLoadingNFTs(true);
    setNftError(null);

    try {
      let nfts: SolanaNFT[] = [];

      // Try our internal API route first (avoids CORS issues)
      try {
        nfts = await fetchUserNFTsFromMagicEden(walletAddress);
      } catch (magicEdenError) {
        // Fallback to Helius if Magic Eden fails
        try {
          nfts = await fetchUserNFTsFromHelius(walletAddress);
        } catch (heliusError) {
          throw new Error(
            "Unable to fetch NFTs from any provider. This might be due to CORS restrictions on the deployed environment."
          );
        }
      }

      setUserNFTs(nfts);
    } catch (error) {
      setNftError(
        error instanceof Error ? error.message : "Failed to load NFTs"
      );
      setUserNFTs([]);
    } finally {
      setIsLoadingNFTs(false);
    }
  };

  // Handle refresh button click
  const handleRefreshPage = () => {
    const currentToken = getAuthToken();
    const walletFromCookie = Cookies.get("erebrus_wallet");

    if (isUserAuthenticated()) {
      // User is authenticated, force refresh profile data
      setprofileset((prev) => !prev);
    } else {
      // Still not authenticated, reload the page
      window.location.reload();
    }
  };

  const walletaddr = Cookies.get("erebrus_wallet");

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setTempFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  // Function to check if email already exists in database
  const checkEmailExists = async (email: string) => {
    const auth = getAuthToken();
    if (!auth) {
      return false;
    }

    try {
      const response = await fetch(
        `${REACT_APP_GATEWAY_URL}api/v1.1/profile/email/check`,
        {
          method: "POST",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth}`,
          },
          body: JSON.stringify({
            email: email,
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        return data.exists || false;
      } else {
        // If the endpoint doesn't exist or returns error, we'll skip the check
        // and let the OTP sending handle the validation
        return false;
      }
    } catch (error) {
      // If there's an error, we'll allow the process to continue
      // and let the OTP endpoint handle the validation
      return false;
    }
  };

  // Function to send OTP to new email address
  const sendOtpToNewEmail = async (newEmail: string) => {
    const auth = getAuthToken();
    if (!auth) {
      const errorMsg =
        "Authentication token not found. Please reconnect your wallet.";
      setEmailValidationError(errorMsg);
      toast.error(errorMsg);
      return false;
    }

    if (!newEmail || !newEmail.trim()) {
      const errorMsg = "Please provide a valid email address.";
      setEmailValidationError(errorMsg);
      toast.error(errorMsg);
      return false;
    }

    setIsOtpSending(true);
    setEmailValidationError(null); // Clear any previous errors

    try {
      const response = await fetch(
        `${REACT_APP_GATEWAY_URL}api/v1.1/profile/email/send`,
        {
          method: "POST",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth}`,
          },
          body: JSON.stringify({
            email: newEmail,
            purpose: "email_update",
          }),
        }
      );

      const responseData = await response.json();

      if (response.ok) {
        setOtpSentEmail(newEmail);
        setEmailValidationError(null); // Clear any errors on success
        toast.success(`OTP sent to ${newEmail}`);
        return true;
      } else {
        // Check for different types of email existence errors
        const errorMessage = responseData.message || "";
        const isEmailExistsError =
          errorMessage.toLowerCase().includes("already exists") ||
          errorMessage.toLowerCase().includes("already registered") ||
          errorMessage.toLowerCase().includes("email exists") ||
          response.status === 409; // Conflict status code

        if (isEmailExistsError) {
          const emailExistsMsg =
            "This email address is already registered to another account. Please use a different email.";
          setEmailValidationError(emailExistsMsg);
          toast.error(emailExistsMsg);
          // Don't close dialog immediately, let user see the error in the dialog
          return false;
        } else {
          const errorMsg =
            errorMessage || "Failed to send OTP. Please try again.";
          setEmailValidationError(errorMsg);
          toast.error(errorMsg);
          return false;
        }
      }
    } catch (error) {
      const errorMsg =
        "Failed to send OTP. Please check your connection and try again.";
      setEmailValidationError(errorMsg);
      toast.error(errorMsg);
      return false;
    } finally {
      setIsOtpSending(false);
    }
  };

  // Function to verify OTP
  const verifyOtp = async () => {
    const auth = getAuthToken();
    if (!auth) {
      const errorMsg =
        "Authentication token not found. Please reconnect your wallet.";
      setEmailValidationError(errorMsg);
      toast.error(errorMsg);
      return false;
    }

    if (!otpCode || otpCode.length !== 6) {
      const errorMsg = "Please enter a valid 6-digit OTP.";
      setEmailValidationError(errorMsg);
      toast.error(errorMsg);
      return false;
    }

    setIsOtpVerifying(true);
    setEmailValidationError(null); // Clear any previous errors

    try {
      const response = await fetch(
        `${REACT_APP_GATEWAY_URL}api/v1.1/profile/email/verify`,
        {
          method: "POST",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth}`,
          },
          body: JSON.stringify({
            email: otpSentEmail,
            otp: otpCode,
            purpose: "email_update",
          }),
        }
      );

      if (response.ok) {
        setEmailValidationError(null); // Clear any errors on success
        toast.success("OTP verified successfully!");
        return true;
      } else {
        const errorData = await response.json();
        const errorMsg = errorData.message || "Invalid OTP. Please try again.";
        setEmailValidationError(errorMsg);
        toast.error(errorMsg);
        return false;
      }
    } catch (error) {
      const errorMsg = "Failed to verify OTP. Please try again.";
      setEmailValidationError(errorMsg);
      toast.error(errorMsg);
      return false;
    } finally {
      setIsOtpVerifying(false);
    }
  };

  const uploadImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    try {
      setLoading(true);

      const file = e.target.files?.[0];
      if (!file) {
        throw new Error("No file selected");
      }

      const formData = new FormData();
      formData.append("file", file);

      // Upload via server-side proxy to avoid CORS
      const response = await fetch("/api/uploadToIPFS", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(
          `Upload failed: ${response.status} ${response.statusText}`
        );
      }

      // Our proxy returns JSON with Hash and Url
      const { Hash: cidHash } = await response.json();

      if (!cidHash) {
        throw new Error("Upload succeeded but CID was not returned");
      }

      setTempFormData((prevData) => ({
        ...prevData,
        profilePictureUrl: cidHash,
      }));
      // Show the new avatar immediately in the UI
      setFormData((prev) => ({
        ...prev,
        profilePictureUrl: cidHash,
      }));
    } catch (error) {
      setMsg("error");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    const auth = getAuthToken();

    if (!auth) {
      toast.error(
        "Authentication token not found. Please reconnect your wallet."
      );
      setLoading(false);
      return;
    }

    // Check if email has changed or is being added for the first time
    const emailChanged = tempFormData.emailId !== formData.emailId;
    const newEmail = tempFormData.emailId?.trim();
    const hasNewEmail = newEmail && newEmail !== "";
    const isFirstTimeEmail =
      !formData.emailId || formData.emailId.trim() === "";

    if (emailChanged && hasNewEmail) {
      // Proceed directly with OTP verification - let the OTP endpoint handle email existence validation
      setPendingEmailUpdate(newEmail);
      setLoading(false);
      setShowOtpDialog(true);

      if (isFirstTimeEmail) {
        toast.info("Please verify your email address with OTP.");
      } else {
        toast.info(
          "Email change detected. Please verify the new email address with OTP."
        );
      }
      return;
    }

    // Proceed with normal profile update (no email change)
    await updateProfile();
  };

  const updateProfile = async () => {
    setLoading(true);
    const auth = getAuthToken();

    if (!auth) {
      toast.error(
        "Authentication token not found. Please reconnect your wallet."
      );
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        `${REACT_APP_GATEWAY_URL}api/v1.0/profile`,
        {
          method: "PATCH",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth}`,
          },
          body: JSON.stringify(tempFormData),
        }
      );

      if (response.ok) {
        setFormData(tempFormData);
        setMsg("success");
        setIsEditDialogOpen(false);
        setprofileset(true);
        toast.success("Profile updated successfully!");
      } else {
        setMsg("error");
        toast.error("Failed to update profile. Please try again.");
      }
    } catch (error) {
      setMsg("error");
      toast.error("Failed to update profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const initialFormData: FormData = {
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

  const [formData, setFormData] = useState<FormData>(initialFormData);

  useEffect(() => {
    const fetchProfileData = async () => {
      // Check if user is authenticated before fetching profile
      if (!isConnected || !isUserAuthenticated()) {
        setLoading(false);
        // Reset profile data when not authenticated
        setProfileData(null);
        setFormData(initialFormData);
        setTempFormData(initialFormData);
        return;
      }

      setLoading(true);
      try {
        const auth = getAuthToken();

        if (!auth) {
          setLoading(false);
          // Reset profile data when no token
          setProfileData(null);
          setFormData(initialFormData);
          setTempFormData(initialFormData);
          return;
        }

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
          const profileInfo = {
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
          };
          setFormData(profileInfo);
          setTempFormData(profileInfo);
          if (!response.data.payload.email) {
            setauth(false);
          }
        }
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            toast.error(
              "Authentication expired. Please reconnect your wallet."
            );
            // Clear profile data on 401
            setProfileData(null);
            setFormData(initialFormData);
            setTempFormData(initialFormData);
          } else if (error.response?.status === 404) {
            // Clear profile data for new users
            setProfileData(null);
            setFormData(initialFormData);
            setTempFormData(initialFormData);
          } else {
            toast.error("Failed to load profile data.");
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [profileset, isConnected, address]);

  // Additional effect to track authentication token changes
  useEffect(() => {
    const currentToken = getAuthToken();
    const previousToken = localStorage.getItem("last_auth_token");

    if (currentToken !== previousToken) {
      localStorage.setItem("last_auth_token", currentToken || "");

      // Force profile refresh when token changes
      if (currentToken && isConnected && isUserAuthenticated()) {
        // Add a small delay to ensure the authentication state is fully updated
        setTimeout(() => {
          setprofileset((prev) => !prev); // Toggle to trigger fetchProfileData
        }, 100);
      }
    }
  }, [isConnected, address]);

  // Effect to handle immediate authentication state changes
  useEffect(() => {
    // When user becomes authenticated, ensure we refresh the profile
    if (isConnected && isUserAuthenticated() && address) {
      const currentToken = getAuthToken();
      if (currentToken) {
        // Small delay to ensure all authentication cookies are set
        setTimeout(() => {
          setprofileset((prev) => !prev);
        }, 200);
      }
    }
  }, [isConnected, address]);

  // Polling effect to check for authentication status changes
  useEffect(() => {
    if (!isConnected || !address) return;

    const pollInterval = setInterval(() => {
      const wasAuthenticated = loggedin;
      const isNowAuthenticated = isUserAuthenticated();

      if (!wasAuthenticated && isNowAuthenticated) {
        setloggedin(true);
        setprofileset((prev) => !prev);
        clearInterval(pollInterval);
      }
    }, 1000); // Check every second

    // Clear interval after 30 seconds to avoid infinite polling
    const timeout = setTimeout(() => {
      clearInterval(pollInterval);
    }, 30000);

    return () => {
      clearInterval(pollInterval);
      clearTimeout(timeout);
    };
  }, [isConnected, address, loggedin]);

  // Get wallet info from the authentication hook and cookies
  const walletInfo = {
    address: address || Cookies.get("erebrus_wallet") || "",
    chainId: Cookies.get("Chain_symbol") || "",
    isConnected: isConnected,
    isVerified: isAuthenticated && isVerified,
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
    }
  };

  const exchangeCodeForToken = async (code: string) => {
    const tokenEndpoint = "https://www.googleapis.com/oauth2/v4/token";

    const tokenRequestBody = {
      code,
      client_id: CLIENT_ID || "",
      client_secret: CLIENT_SECRET || "",
      redirect_uri: REDIRECT_URI || "",
      grant_type: "authorization_code",
    };

    try {
      const response = await fetch(tokenEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams(
          tokenRequestBody as Record<string, string>
        ).toString(),
      });

      const tokenData = await response.json();
      const idToken = tokenData.id_token;
      setidtoken(idToken);
      handleTokenData(tokenData);
    } catch (error) {
      // Handle token exchange error silently
    }
  };

  const handleTokenData = (tokenData: any) => {
    window.history.replaceState({}, document.title, window.location.pathname);
  };

  useEffect(() => {
    parseAuthorizationCode();
  }, []);

  const handleremoveClick = async () => {
    const auth = getAuthToken();

    if (!auth) {
      toast.error(
        "Authentication token not found. Please reconnect your wallet."
      );
      return;
    }

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
      setunlinkpopup(false);
      toast.success("Email removed successfully!");
    } catch (error) {
      toast.error("Failed to remove email. Please try again.");
    }
  };

  useEffect(() => {
    const handleConnectWallet = async () => {
      const currentToken = getAuthToken();
      if (currentToken && isConnected && isUserAuthenticated()) {
        setloggedin(true);
      } else {
        setloggedin(false);
      }
    };
    handleConnectWallet();
  }, [change, isConnected, address]);

  // Cleanup effect when user disconnects or logs out
  useEffect(() => {
    if (!isConnected || !address) {
      setProfileData(null);
      setFormData(initialFormData);
      setTempFormData(initialFormData);
      setloggedin(false);
      setauth(true);
      setUserNFTs([]); // Clear NFTs when wallet disconnects
      localStorage.removeItem("last_auth_token");
    }
  }, [isConnected, address]);

  // Effect to fetch NFTs when wallet is connected (for Solana wallets)
  useEffect(() => {
    const shouldFetchNFTs = isConnected && address && isUserAuthenticated();
    const isSolanaWallet = Cookies.get("Chain_symbol")?.toLowerCase() === "sol";

    if (shouldFetchNFTs && isSolanaWallet) {
      fetchUserNFTs(address);
    } else {
      // Clear NFTs if not Solana or not connected
      setUserNFTs([]);
      setNftError(null);
    }
  }, [isConnected, address, isUserAuthenticated()]);

  // Refresh NFTs function
  const refreshNFTs = async () => {
    if (address && isUserAuthenticated()) {
      await fetchUserNFTs(address);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setMsg("");
    }, 3000); // 3 seconds in milliseconds

    return () => clearTimeout(timeoutId);
  }, [msg]);

  function removePrefix(url: string) {
    return url.slice(7);
  }

  const chainInfo: ChainInfoMap = {
    apt: {
      name: "Aptos",
      icon: "/aptosicon.webp",
    },
    sui: {
      name: "Sui",
      icon: "/suiicon.webp",
    },
    evm: {
      name: "Ethereum",
      icon: "/ethicon.webp",
    },
    sol: {
      name: "Solana",
      icon: "/solanaicon.webp",
    },
  };

  const chainSymbol = Cookies.get("Chain_symbol");
  const chainDetails = chainInfo[chainSymbol?.toLowerCase() || ""] || {
    name: "Unknown Chain",
    icon: "",
  };

  const openEditDialog = () => {
    setTempFormData({ ...formData });
    setIsEditDialogOpen(true);
  };

  // Normalize profile picture into a displayable URL
  const getProfileImageUrl = (value: string) => {
    if (!value) return "";
    const v = value.trim();
    // Absolute URLs
    if (/^https?:\/\//i.test(v)) {
      try {
        const u = new URL(v);
        // If it's an IPFS-style gateway URL, standardize to Erebrus gateway
        if (
          u.pathname.startsWith("/ipfs/") ||
          u.pathname.startsWith("/ipns/")
        ) {
          return `https://ipfs.erebrus.io${u.pathname}`;
        }
        return v; // Non-IPFS absolute URL, use as-is
      } catch {
        return v;
      }
    }
    // ipfs://CID or ipfs://ipfs/CID
    if (v.startsWith("ipfs://")) {
      const path = v.slice(7).replace(/^ipfs\//i, "");
      return `https://ipfs.erebrus.io/ipfs/${path}`;
    }
    // /ipfs/CID or similar
    if (v.startsWith("/ipfs/")) {
      return `https://ipfs.erebrus.io${v}`;
    }
    // Fallback: treat as CID or CID/path
    return `https://ipfs.erebrus.io/ipfs/${v}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
      {/* Authentication Check */}
      {!isConnected && (
        <div className="container mx-auto px-4 py-36">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-gray-800 rounded-lg p-8 shadow-xl border border-gray-700">
              <User className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h2 className="text-2xl font-bold mb-4">Wallet Not Connected</h2>
              <p className="text-gray-400 mb-6">
                Please connect your wallet to view your profile.
              </p>
              <div className="flex justify-center">
                <w3m-button />
              </div>
            </div>
          </div>
        </div>
      )}

      {isConnected && !isUserAuthenticated() && (
        <div className="container mx-auto px-4 py-36">
          <div className="max-w-md mx-auto text-center">
            <div className="bg-gray-800 rounded-lg p-8 shadow-xl border border-gray-700">
              <User className="h-16 w-16 mx-auto mb-4 text-gray-400" />
              <h2 className="text-2xl font-bold mb-4">
                Authentication Required
              </h2>
              <p className="text-gray-400 mb-6">
                Please sign the message with your wallet to access your profile.
              </p>
              <Button
                onClick={handleRefreshPage}
                className="bg-blue-600 hover:bg-blue-700"
              >
                Refresh Page
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Show profile content only when connected and authenticated */}
      {isConnected && isUserAuthenticated() && (
        <>
          {/* Success/Error Messages */}
          {msg === "success" && (
            <div className="fixed top-4 right-4 z-50 bg-green-500/90 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 animate-in fade-in slide-in-from-top-5 duration-300">
              <Check className="h-5 w-5" />
              <span>Changes saved successfully!</span>
            </div>
          )}

          {msg === "error" && (
            <div className="fixed top-4 right-4 z-50 bg-red-500/90 text-white px-4 py-2 rounded-lg shadow-lg flex items-center space-x-2 animate-in fade-in slide-in-from-top-5 duration-300">
              <X className="h-5 w-5" />
              <span>Error saving changes. Please try again.</span>
            </div>
          )}

          <div className="container mx-auto px-4 py-36">
            <div className="max-w-4xl mx-auto">
              <div className="flex flex-col md:flex-row justify-between items-center md:items-center mb-8">
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent text-center md:text-left">
                  Profile Information
                </h1>
                <div className="flex items-center space-x-3 mt-4 md:mt-0">
                  <Badge
                    variant="outline"
                    className="bg-blue-900/30 text-blue-300 border-blue-800 px-4 py-2 text-base"
                  >
                    <span className="mr-2 h-3 w-3 rounded-full bg-blue-400"></span>
                    {chainDetails.name}
                  </Badge>
                  <Badge
                    variant="outline"
                    className="bg-gray-800 text-gray-300 border-gray-700 font-mono px-4 py-2 text-base"
                  >
                    {walletaddr
                      ? `${walletaddr.slice(0, 6)}...${walletaddr.slice(-6)}`
                      : "Not Connected"}
                  </Badge>
                </div>
              </div>

              <Tabs defaultValue="profile" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-8 bg-gray-800/50 border border-gray-700">
                  <TabsTrigger
                    value="profile"
                    className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-400 hover:text-white transition-all duration-200"
                  >
                    Profile Details
                  </TabsTrigger>
                  <TabsTrigger
                    value="nfts"
                    className="data-[state=active]:bg-blue-600 data-[state=active]:text-white text-gray-400 hover:text-white transition-all duration-200"
                  >
                    My NFTs
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="profile">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Profile Image Section */}
                    <Card className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden shadow-xl">
                      <CardContent className="p-6 flex flex-col items-center">
                        <div className="relative mb-6 mt-4">
                          <div className="w-40 h-40 rounded-full overflow-hidden bg-gray-800 border-4 border-gray-700 flex items-center justify-center">
                            {formData.profilePictureUrl ? (
                              <img
                                alt="Profile"
                                src={getProfileImageUrl(
                                  formData.profilePictureUrl
                                )}
                                className="w-full h-full object-cover"
                                onError={(
                                  e: React.SyntheticEvent<HTMLImageElement>
                                ) => {
                                  const img = e.currentTarget;
                                  img.onerror = null;
                                  img.src =
                                    "https://thumbs.dreamstime.com/b/female-user-profile-avatar-woman-character-screen-saver-emotions-website-mobile-app-design-vector-199001739.jpg";
                                }}
                              />
                            ) : formData.name ? (
                              <div className="flex items-center justify-center w-full h-full text-5xl font-bold text-white">
                                {formData.name.charAt(0)}
                              </div>
                            ) : (
                              <User size={64} className="text-gray-400" />
                            )}
                          </div>
                        </div>

                        <h2 className="text-xl font-bold mb-1">
                          {formData.name || "Your Name"}
                        </h2>
                        <p className="text-gray-400 text-sm mb-4">
                          {formData.country || "Your Location"}
                        </p>

                        <div className="w-full mt-4">
                          <Button
                            onClick={openEditDialog}
                            className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400"
                          >
                            <Edit size={16} className="mr-2" /> Edit Profile
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    {/* Profile Form Section */}
                    <Card className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden shadow-xl md:col-span-2">
                      <CardContent className="p-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* Basic Information */}
                          <div className="space-y-4">
                            <div>
                              <Label
                                htmlFor="name"
                                className="flex items-center text-gray-300 mb-2"
                              >
                                <User
                                  size={16}
                                  className="mr-2 text-blue-400"
                                />{" "}
                                Name
                              </Label>
                              <p className="text-white pl-6">
                                {formData.name || "Not set"}
                              </p>
                            </div>

                            <div>
                              <Label
                                htmlFor="country"
                                className="flex items-center text-gray-300 mb-2"
                              >
                                <MapPin
                                  size={16}
                                  className="mr-2 text-blue-400"
                                />{" "}
                                Country
                              </Label>
                              <p className="text-white pl-6">
                                {formData.country || "Not set"}
                              </p>
                            </div>

                            <div>
                              <Label
                                htmlFor="email"
                                className="flex items-center text-gray-300 mb-2"
                              >
                                <Mail
                                  size={16}
                                  className="mr-2 text-blue-400"
                                />{" "}
                                Email
                              </Label>
                              <p className="text-white pl-6">
                                {formData.emailId || "Not set"}
                              </p>
                            </div>

                            <div>
                              <Label
                                htmlFor="discord"
                                className="flex items-center text-gray-300 mb-2"
                              >
                                <MessageSquare
                                  size={16}
                                  className="mr-2 text-blue-400"
                                />{" "}
                                Discord
                              </Label>
                              <p className="text-white pl-6">
                                {formData.discord || "Not set"}
                              </p>
                            </div>
                          </div>

                          {/* Social Media */}
                          <div className="space-y-4">
                            <div>
                              <Label
                                htmlFor="twitter"
                                className="flex items-center text-gray-300 mb-2"
                              >
                                <AtSign
                                  size={16}
                                  className="mr-2 text-blue-400"
                                />{" "}
                                Twitter
                              </Label>
                              <p className="text-white pl-6">
                                {formData.twitter || "Not set"}
                              </p>
                            </div>

                            <div>
                              <Label
                                htmlFor="telegram"
                                className="flex items-center text-gray-300 mb-2"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="mr-2 text-blue-400"
                                >
                                  <path d="m22 3-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 3"></path>
                                  <path d="M2 3v18h20V3"></path>
                                  <path d="M12 11v5"></path>
                                  <path d="m10 13 2 2 2-2"></path>
                                </svg>
                                Telegram
                              </Label>
                              <p className="text-white pl-6">
                                {formData.telegram || "Not set"}
                              </p>
                            </div>

                            <div>
                              <Label
                                htmlFor="farcaster"
                                className="flex items-center text-gray-300 mb-2"
                              >
                                <Globe
                                  size={16}
                                  className="mr-2 text-blue-400"
                                />{" "}
                                Farcaster
                              </Label>
                              <p className="text-white pl-6">
                                {formData.farcaster || "Not set"}
                              </p>
                            </div>

                            <div>
                              <Label
                                htmlFor="google"
                                className="flex items-center text-gray-300 mb-2"
                              >
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  width="16"
                                  height="16"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  className="mr-2 text-blue-400"
                                >
                                  <circle cx="12" cy="12" r="10"></circle>
                                  <path d="M12 8v8"></path>
                                  <path d="M8 12h8"></path>
                                </svg>
                                Google
                              </Label>
                              <p className="text-white pl-6">
                                {formData.google || "Not set"}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Apple Account */}
                        <div className="mt-6">
                          <Label
                            htmlFor="apple"
                            className="flex items-center text-gray-300 mb-2"
                          >
                            <Apple size={16} className="mr-2 text-blue-400" />{" "}
                            Apple
                          </Label>
                          <p className="text-white pl-6">
                            {formData.apple || "Not set"}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="nfts">
                  <Card className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden shadow-xl">
                    <CardContent className="p-8">
                      <div className="text-center">
                        <h2 className="text-2xl font-bold text-purple-400 mb-4">
                          Your NFT Collection
                        </h2>

                        {/* Chain indicator */}
                        <div className="mb-6">
                          <Badge
                            variant="outline"
                            className="bg-blue-900/30 text-blue-300 border-blue-800"
                          >
                            {Cookies.get("Chain_symbol")?.toUpperCase() ||
                              "Unknown"}{" "}
                            Network
                          </Badge>
                        </div>

                        {/* Loading state */}
                        {isLoadingNFTs && (
                          <div className="text-center py-12">
                            <div className="animate-spin h-8 w-8 border-2 border-blue-500 border-t-transparent rounded-full mx-auto mb-4" />
                            <p className="text-gray-400">
                              Loading your NFTs...
                            </p>
                          </div>
                        )}

                        {/* Error state */}
                        {nftError && !isLoadingNFTs && (
                          <div className="text-center py-12">
                            <X className="h-12 w-12 text-red-500 mx-auto mb-4" />
                            <p className="text-red-400 mb-2">
                              Failed to load NFTs
                            </p>
                            <p className="text-gray-500 text-sm">{nftError}</p>
                            <Button
                              onClick={refreshNFTs}
                              variant="outline"
                              className="mt-4 border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                            >
                              Try Again
                            </Button>
                          </div>
                        )}

                        {/* NFT Grid */}
                        {!isLoadingNFTs && !nftError && (
                          <>
                            {userNFTs.length > 0 ? (
                              <>
                                <p className="text-gray-400 mb-8">
                                  Found {userNFTs.length} NFT
                                  {userNFTs.length !== 1 ? "s" : ""} in your
                                  wallet
                                </p>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                  {userNFTs.map((nft, index) => (
                                    <div
                                      key={nft.mintAddress || index}
                                      className="bg-gray-800/50 border border-gray-700 rounded-lg overflow-hidden hover:border-blue-500 transition-all duration-300 transform hover:scale-105"
                                    >
                                      {/* NFT Image */}
                                      <div className="aspect-square w-full bg-gradient-to-br from-blue-900 to-purple-900 flex items-center justify-center relative">
                                        {nft.image ? (
                                          <img
                                            src={nft.image}
                                            alt={nft.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                              const img = e.currentTarget;
                                              img.style.display = "none";
                                              // Show fallback
                                              const fallback =
                                                img.nextElementSibling as HTMLElement;
                                              if (fallback)
                                                fallback.style.display = "flex";
                                            }}
                                          />
                                        ) : null}
                                        {/* Fallback for missing images */}
                                        <div
                                          className="absolute inset-0 flex items-center justify-center text-center px-4"
                                          style={{
                                            display: nft.image
                                              ? "none"
                                              : "flex",
                                          }}
                                        >
                                          <div>
                                            <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                            <p className="text-sm text-gray-400">
                                              {nft.name}
                                            </p>
                                          </div>
                                        </div>
                                      </div>

                                      {/* NFT Details */}
                                      <div className="p-4">
                                        <h3
                                          className="font-bold text-white truncate"
                                          title={nft.name}
                                        >
                                          {nft.name}
                                        </h3>
                                        {nft.collectionName && (
                                          <p
                                            className="text-sm text-blue-400 truncate"
                                            title={nft.collectionName}
                                          >
                                            {nft.collectionName}
                                          </p>
                                        )}
                                        {nft.description && (
                                          <p className="text-xs text-gray-400 mt-2 max-h-8 overflow-hidden">
                                            {nft.description.length > 80
                                              ? `${nft.description.substring(
                                                  0,
                                                  80
                                                )}...`
                                              : nft.description}
                                          </p>
                                        )}

                                        {/* Attributes preview */}
                                        {nft.attributes &&
                                          nft.attributes.length > 0 && (
                                            <div className="mt-3 flex flex-wrap gap-1">
                                              {nft.attributes
                                                .slice(0, 2)
                                                .map((attr, attrIndex) => (
                                                  <span
                                                    key={attrIndex}
                                                    className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded"
                                                    title={`${attr.trait_type}: ${attr.value}`}
                                                  >
                                                    {attr.trait_type}:{" "}
                                                    {attr.value}
                                                  </span>
                                                ))}
                                              {nft.attributes.length > 2 && (
                                                <span className="text-xs text-gray-500">
                                                  +{nft.attributes.length - 2}{" "}
                                                  more
                                                </span>
                                              )}
                                            </div>
                                          )}

                                        {/* Token details */}
                                        <div className="mt-3 text-xs text-gray-500">
                                          <p title={nft.mintAddress}>
                                            Mint: {nft.mintAddress.slice(0, 8)}
                                            ...{nft.mintAddress.slice(-4)}
                                          </p>
                                          {nft.isCompressed && (
                                            <span className="text-yellow-400">
                                              Compressed NFT
                                            </span>
                                          )}
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </>
                            ) : (
                              // Empty state
                              <div className="text-center py-12">
                                <Upload className="h-16 w-16 text-gray-600 mx-auto mb-4" />
                                <h3 className="text-xl font-semibold text-gray-300 mb-2">
                                  No NFTs Found
                                </h3>
                                <p className="text-gray-500 mb-6">
                                  {Cookies.get(
                                    "Chain_symbol"
                                  )?.toLowerCase() === "sol"
                                    ? "You don't have any NFTs in your Solana wallet yet."
                                    : "Connect a Solana wallet to view your NFTs."}
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                  <Button
                                    onClick={() =>
                                      window.open("/mint", "_blank")
                                    }
                                    variant="outline"
                                    className="border-gray-700 text-black-300 hover:bg-gray-800 hover:text-white"
                                  >
                                    Go to Mint Page
                                  </Button>
                                  <Button
                                    onClick={refreshNFTs}
                                    variant="outline"
                                    className="border-gray-700 text-black-300 hover:bg-gray-800 hover:text-white"
                                  >
                                    Refresh Collection
                                  </Button>
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Edit Profile Dialog */}
          <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
            <DialogContent className="bg-gray-900 border border-gray-800 text-white max-w-2xl">
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                  Edit Profile
                </DialogTitle>
                <DialogDescription className="text-gray-400">
                  Update your profile information below
                </DialogDescription>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                {/* Profile Picture */}
                <div className="md:col-span-2 flex justify-center">
                  <div className="relative group">
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-gradient-to-br from-blue-800/80 to-purple-800/80 border-4 border-gray-700 flex items-center justify-center">
                      {tempFormData.profilePictureUrl ? (
                        <img
                          alt="Profile"
                          src={`https://ipfs.myriadflow.com/ipfs/${tempFormData.profilePictureUrl}`}
                          className="w-full h-full object-cover"
                          onError={(
                            e: React.SyntheticEvent<HTMLImageElement>
                          ) => {
                            const img = e.currentTarget;
                            img.onerror = null;
                            img.src =
                              "https://thumbs.dreamstime.com/b/female-user-profile-avatar-woman-character-screen-saver-emotions-website-mobile-app-design-vector-199001739.jpg";
                          }}
                        />
                      ) : tempFormData.name ? (
                        <div className="flex items-center justify-center w-full h-full text-3xl font-bold text-white">
                          {tempFormData.name.charAt(0)}
                        </div>
                      ) : (
                        <User size={48} className="text-gray-400" />
                      )}
                    </div>
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 rounded-full flex items-center justify-center transition-opacity">
                      <label
                        htmlFor="profile-upload"
                        className="cursor-pointer"
                      >
                        {/* Profile Upload Input */}
                        <input
                          id="profile-upload"
                          type="file"
                          className="hidden"
                          onChange={uploadImage}
                          accept="image/*"
                          aria-label="Upload profile picture"
                        />
                        <Camera className="h-8 w-8 text-white" />
                      </label>
                    </div>
                  </div>
                </div>

                {/* Basic Information */}
                <div className="space-y-4">
                  {/* Name */}
                  <div className="flex flex-col space-y-1.5">
                    <Label
                      htmlFor="name"
                      className="flex items-center text-gray-300"
                    >
                      <User size={16} className="mr-2 text-blue-400" /> Name
                    </Label>
                    <Input
                      id="name"
                      value={tempFormData.name}
                      onChange={handleInputChange}
                      placeholder="Your name"
                      className="bg-gray-800/50 border-gray-700 focus:border-blue-500"
                      aria-label="Enter your name"
                    />
                  </div>
                  {/* Country */}
                  <div className="flex flex-col space-y-1.5">
                    <Label
                      htmlFor="country"
                      className="flex items-center text-gray-300"
                    >
                      <MapPin size={16} className="mr-2 text-blue-400" />{" "}
                      Country
                    </Label>
                    <Input
                      id="country"
                      value={tempFormData.country}
                      onChange={handleInputChange}
                      placeholder="Your country"
                      className="bg-gray-800/50 border-gray-700 focus:border-blue-500"
                      aria-label="Enter your country"
                    />
                  </div>
                  {/* Email */}
                  <div className="flex flex-col space-y-1.5">
                    <Label
                      htmlFor="emailId"
                      className="flex items-center text-gray-300"
                    >
                      <Mail size={16} className="mr-2 text-blue-400" /> Email
                    </Label>
                    <Input
                      id="emailId"
                      type="email"
                      value={tempFormData.emailId}
                      onChange={handleInputChange}
                      placeholder="Your email"
                      className="bg-gray-800/50 border-gray-700 focus:border-blue-500"
                      aria-label="Enter your email address"
                    />
                    {formData.emailId && formData.emailId.trim() !== "" && (
                      <p className="text-xs text-gray-400 mt-1">
                        💡 Changing your email will require OTP verification
                        sent to your new email address
                      </p>
                    )}
                    {(!formData.emailId || formData.emailId.trim() === "") && (
                      <p className="text-xs text-gray-400 mt-1">
                        📧 Adding your email will require verification via OTP
                      </p>
                    )}
                  </div>
                  {/* Discord */}
                  <div className="flex flex-col space-y-1.5">
                    <Label
                      htmlFor="discord"
                      className="flex items-center text-gray-300"
                    >
                      <MessageSquare size={16} className="mr-2 text-blue-400" />{" "}
                      Discord
                    </Label>
                    <Input
                      id="discord"
                      value={tempFormData.discord}
                      onChange={handleInputChange}
                      placeholder="Your Discord username"
                      className="bg-gray-800/50 border-gray-700 focus:border-blue-500"
                      aria-label="Enter your Discord username"
                    />
                  </div>
                </div>

                {/* Social Media */}
                <div className="space-y-4">
                  {/* Twitter */}
                  <div className="flex flex-col space-y-1.5">
                    <Label
                      htmlFor="twitter"
                      className="flex items-center text-gray-300"
                    >
                      <AtSign size={16} className="mr-2 text-blue-400" />{" "}
                      Twitter
                    </Label>
                    <Input
                      id="twitter"
                      value={tempFormData.twitter}
                      onChange={handleInputChange}
                      placeholder="Your Twitter handle"
                      className="bg-gray-800/50 border-gray-700 focus:border-blue-500"
                      aria-label="Enter your Twitter handle"
                    />
                  </div>
                  {/* Telegram */}
                  <div className="flex flex-col space-y-1.5">
                    <Label
                      htmlFor="telegram"
                      className="flex items-center text-gray-300"
                    >
                      {/* ...existing svg... */} Telegram
                    </Label>
                    <Input
                      id="telegram"
                      value={tempFormData.telegram}
                      onChange={handleInputChange}
                      placeholder="Your Telegram username"
                      className="bg-gray-800/50 border-gray-700 focus:border-blue-500"
                      aria-label="Enter your Telegram username"
                    />
                  </div>
                  {/* Farcaster */}
                  <div className="flex flex-col space-y-1.5">
                    <Label
                      htmlFor="farcaster"
                      className="flex items-center text-gray-300"
                    >
                      <Globe size={16} className="mr-2 text-blue-400" />{" "}
                      Farcaster
                    </Label>
                    <Input
                      id="farcaster"
                      value={tempFormData.farcaster}
                      onChange={handleInputChange}
                      placeholder="Your Farcaster handle"
                      className="bg-gray-800/50 border-gray-700 focus:border-blue-500"
                      aria-label="Enter your Farcaster handle"
                    />
                  </div>
                  {/* Google */}
                  <div className="flex flex-col space-y-1.5">
                    <Label
                      htmlFor="google"
                      className="flex items-center text-gray-300"
                    >
                      {/* ...existing svg... */} Google
                    </Label>
                    <Input
                      id="google"
                      value={tempFormData.google}
                      onChange={handleInputChange}
                      placeholder="Your Google account"
                      className="bg-gray-800/50 border-gray-700 focus:border-blue-500"
                      aria-label="Enter your Google account"
                    />
                  </div>
                </div>
              </div>

              {/* Apple Account */}
              <div className="mt-2">
                <Label
                  htmlFor="apple"
                  className="flex items-center text-gray-300"
                >
                  <Apple size={16} className="mr-2 text-blue-400" /> Apple
                </Label>
                <Input
                  id="apple"
                  value={tempFormData.apple}
                  onChange={handleInputChange}
                  placeholder="Your Apple ID"
                  className="bg-gray-800/50 border-gray-700 focus:border-blue-500"
                  aria-label="Enter your Apple ID"
                />
              </div>

              <div className="flex justify-end space-x-4 mt-6">
                {/* Dialog Close Button */}
                <Button
                  variant="outline"
                  onClick={() => setIsEditDialogOpen(false)}
                  className="border-gray-700 text-gray-300 hover:bg-gray-800 hover:text-white"
                  disabled={loading}
                  aria-label="Cancel profile changes"
                >
                  <X size={16} className="mr-2" /> Cancel
                </Button>
                {/* Save Changes Button */}
                <Button
                  onClick={handleSubmit}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500"
                  disabled={loading}
                  aria-label={
                    loading
                      ? "Saving profile changes..."
                      : "Save profile changes"
                  }
                >
                  {loading ? (
                    <div className="flex items-center">
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                        role="status"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Saving...
                    </div>
                  ) : (
                    <>
                      <Save size={16} className="mr-2" /> Save Changes
                    </>
                  )}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </>
      )}

      {/* OTP Verification Dialog */}
      <Dialog open={showOtpDialog} onOpenChange={setShowOtpDialog}>
        <DialogContent className="bg-gray-900 border-gray-800 text-white max-w-md">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-center">
              Verify New Email Address
            </DialogTitle>
            <DialogDescription className="text-gray-400 text-center">
              {formData.emailId ? (
                <>
                  To change your email from{" "}
                  <span className="text-blue-400">{formData.emailId}</span> to{" "}
                  <span className="text-blue-400">{pendingEmailUpdate}</span>,
                  please verify the new email address.
                </>
              ) : (
                <>
                  Please verify your new email address:{" "}
                  <span className="text-blue-400">{pendingEmailUpdate}</span>
                </>
              )}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-6 p-4">
            {/* Error display section */}
            {emailValidationError && (
              <div className="bg-red-900/30 border border-red-800 rounded-lg p-3 mb-4">
                <div className="flex items-center space-x-2">
                  <X className="h-5 w-5 text-red-400 flex-shrink-0" />
                  <p className="text-red-400 text-sm">{emailValidationError}</p>
                </div>
              </div>
            )}

            {!otpSentEmail ? (
              // Step 1: Send OTP to new email
              <div className="text-center space-y-4">
                <p className="text-gray-300">
                  We'll send a verification code to your new email:
                </p>
                <p className="font-semibold text-blue-400">
                  {pendingEmailUpdate}
                </p>
                <Button
                  onClick={async () => {
                    setEmailValidationError(null); // Clear any previous errors

                    const success = await sendOtpToNewEmail(pendingEmailUpdate);
                    if (success) {
                      setOtpCode("");
                    }
                  }}
                  disabled={isOtpSending}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {isOtpSending ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                      Checking email and sending OTP...
                    </div>
                  ) : (
                    "Send Verification Code"
                  )}
                </Button>
              </div>
            ) : (
              // Step 2: Enter OTP
              <div className="space-y-4">
                <div>
                  <Label htmlFor="otpCode" className="text-gray-300">
                    Enter 6-digit verification code
                  </Label>
                  <Input
                    id="otpCode"
                    type="text"
                    value={otpCode}
                    onChange={(e) => {
                      const value = e.target.value
                        .replace(/\D/g, "")
                        .slice(0, 6);
                      setOtpCode(value);
                    }}
                    placeholder="000000"
                    className="bg-gray-800/50 border-gray-700 focus:border-blue-500 text-center text-lg tracking-widest"
                    maxLength={6}
                  />
                  <p className="text-sm text-gray-400 mt-1">
                    Code sent to: {otpSentEmail}
                  </p>
                </div>

                <div className="flex gap-3">
                  <Button
                    onClick={async () => {
                      const success = await verifyOtp();
                      if (success) {
                        // OTP verified, proceed with profile update
                        setShowOtpDialog(false);
                        setTempFormData((prev) => ({
                          ...prev,
                          emailId: pendingEmailUpdate,
                        }));
                        await updateProfile();

                        // Reset OTP states
                        setOtpCode("");
                        setOtpSentEmail("");
                        setPendingEmailUpdate("");
                      }
                    }}
                    disabled={isOtpVerifying || otpCode.length !== 6}
                    className="flex-1 bg-green-600 hover:bg-green-700"
                  >
                    {isOtpVerifying ? (
                      <div className="flex items-center gap-2">
                        <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                        Verifying...
                      </div>
                    ) : (
                      "Verify & Update Email"
                    )}
                  </Button>

                  <Button
                    onClick={async () => {
                      const success = await sendOtpToNewEmail(
                        pendingEmailUpdate
                      );
                      if (success) {
                        setOtpCode("");
                      }
                    }}
                    disabled={isOtpSending}
                    variant="outline"
                    className="border-gray-700 text-gray-300 hover:bg-gray-800"
                  >
                    {isOtpSending ? "Sending..." : "Resend"}
                  </Button>
                </div>
              </div>
            )}

            <div className="flex justify-center">
              <Button
                onClick={() => {
                  setShowOtpDialog(false);
                  setOtpCode("");
                  setOtpSentEmail("");
                  setPendingEmailUpdate("");
                  setEmailValidationError(null);
                  // Reset email in form to original value
                  setTempFormData((prev) => ({
                    ...prev,
                    emailId: formData.emailId,
                  }));
                }}
                variant="outline"
                className="border-gray-700 text-gray-300 hover:bg-gray-800"
              >
                Cancel Email Change
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Profile;
