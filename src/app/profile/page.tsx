"use client";

import React from "react";
import Head from "next/head";
import Cookies from "js-cookie";
import axios from "axios";
import { useEffect, useState, ChangeEvent } from "react";
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
} from "lucide-react";

const API_KEY = process.env.NEXT_PUBLIC_STORAGE_API;
const REACT_APP_GATEWAY_URL = "https://gateway.netsepio.com";

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

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [profileset, setprofileset] = useState(true);
  const [profileData, setProfileData] = useState<any>(null);
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
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const chainsym = Cookies.get("Chain_symbol");
  const walletaddr = Cookies.get("erebrus_wallet");

  const navigate = (path: string) => {
    window.location.href = path;
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
  const [tempFormData, setTempFormData] = useState<FormData>(initialFormData);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setTempFormData((prevFormData) => ({
      ...prevFormData,
      [id]: value,
    }));
  };

  async function uploadImage(e: ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    try {
      setLoading(true);

      const file = e.target.files?.[0];
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
      setTempFormData((prevData) => ({
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

  const handleSubmit = async () => {
    setLoading(true);
    const auth = Cookies.get("erebrus_token");

    try {
      const formDataObject = {
        name: tempFormData.name,
        country: tempFormData.country,
        emailId: tempFormData.emailId,
        discord: tempFormData.discord,
        twitter: tempFormData.twitter,
        google: tempFormData.google,
        apple: tempFormData.apple,
        telegram: tempFormData.telegram,
        farcaster: tempFormData.farcaster,
        profilePictureUrl: tempFormData.profilePictureUrl,
      };

      // Convert to JSON string
      const jsonData = JSON.stringify(formDataObject);

      const response = await fetch(
        `${REACT_APP_GATEWAY_URL}/api/v1.0/profile`,
        {
          method: "PATCH",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth}`,
          },
          body: jsonData,
        }
      );

      if (response.status === 200) {
        setFormData(tempFormData);
        setMsg("success");
        setIsEditDialogOpen(false);
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
          `${REACT_APP_GATEWAY_URL}/api/v1.0/profile`,
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
      console.log("token", tokenData);
    } catch (error) {
      console.error("Token exchange error:", error);
    }
  };

  const handleTokenData = (tokenData: any) => {
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

  const chainDetails = chainInfo[chainsym?.toLowerCase() || ""] || {
    name: "Unknown Chain",
    icon: "",
  };

  const openEditDialog = () => {
    setTempFormData({ ...formData });
    setIsEditDialogOpen(true);
  };

  return (
    <>
      <Head>
        <title>Erebrus Profile</title>
        <meta
          name="description"
          content="Manage your Erebrus profile and account settings."
        />
        <link rel="canonical" href="https://erebrus.io/profile" />
      </Head>
      <main className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white">
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
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

            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
                Profile Information
              </h1>
              <div className="flex items-center space-x-2">
                <Badge
                  variant="outline"
                  className="bg-blue-900/30 text-blue-300 border-blue-800 px-3 py-1"
                >
                  <span className="mr-1.5 h-2 w-2 rounded-full bg-blue-400"></span>
                  {chainDetails.name}
                </Badge>
                <Badge
                  variant="outline"
                  className="bg-gray-800 text-gray-300 border-gray-700 font-mono"
                >
                  {walletaddr
                    ? `${walletaddr.slice(0, 4)}...${walletaddr.slice(-4)}`
                    : "Not Connected"}
                </Badge>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Profile Image Section */}
              <Card className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden shadow-xl">
                <CardContent className="p-6 flex flex-col items-center">
                  <div className="relative mb-6 mt-4 group cursor-pointer">
                    <div className="w-40 h-40 rounded-full overflow-hidden bg-gradient-to-br from-blue-800/80 to-purple-800/80 border-4 border-gray-700 flex items-center justify-center">
                      {formData.profilePictureUrl ? (
                        <img
                          alt="Profile"
                          src={`https://ipfs.myriadflow.com/ipfs/${formData.profilePictureUrl}`}
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
                        <div className="flex items-center justify-center w-full h-full text-4xl font-bold text-white">
                          {formData.name.charAt(0)}
                        </div>
                      ) : (
                        <User size={64} className="text-gray-400" />
                      )}
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold mb-1">
                    {formData.name || "Your Name"}
                  </h2>
                  <p className="text-gray-400 text-sm mb-6 flex items-center">
                    <MapPin size={14} className="mr-1" />
                    {formData.country || "Your Location"}
                  </p>

                  <div className="w-full">
                    {/* Edit Profile Button */}
                    <Button
                      onClick={openEditDialog}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white transition-all duration-300"
                      aria-label="Edit your profile information"
                    >
                      <Edit size={16} className="mr-2" /> Edit Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Profile Details Section */}
              <Card className="bg-gray-900/50 border border-gray-800 rounded-xl overflow-hidden shadow-xl md:col-span-2">
                <CardContent className="p-8">
                  <h2 className="text-xl font-semibold mb-6 text-blue-400">
                    Account Information
                  </h2>

                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                      {/* Name */}
                      <div className="space-y-1">
                        <Label htmlFor="name" className="text-gray-400 text-sm">
                          Name
                        </Label>
                        <div className="flex items-center">
                          <User size={16} className="mr-2 text-blue-400" />
                          <p className="text-white">
                            {formData.name || "Not set"}
                          </p>
                        </div>
                      </div>
                      {/* Country */}
                      <div className="space-y-1">
                        <Label
                          htmlFor="country"
                          className="text-gray-400 text-sm"
                        >
                          Country
                        </Label>
                        <div className="flex items-center">
                          <MapPin size={16} className="mr-2 text-blue-400" />
                          <p className="text-white">
                            {formData.country || "Not set"}
                          </p>
                        </div>
                      </div>
                      {/* Email */}
                      <div className="space-y-1">
                        <Label
                          htmlFor="emailId"
                          className="text-gray-400 text-sm"
                        >
                          Email
                        </Label>
                        <div className="flex items-center">
                          <Mail size={16} className="mr-2 text-blue-400" />
                          <p className="text-white">
                            {formData.emailId || "Not set"}
                          </p>
                        </div>
                      </div>
                      {/* Discord */}
                      <div className="space-y-1">
                        <Label
                          htmlFor="discord"
                          className="text-gray-400 text-sm"
                        >
                          Discord
                        </Label>
                        <div className="flex items-center">
                          <MessageSquare
                            size={16}
                            className="mr-2 text-blue-400"
                          />
                          <p className="text-white">
                            {formData.discord || "Not set"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-gray-800">
                      <h2 className="text-xl font-semibold mb-4 text-blue-400">
                        Social Accounts
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                        {/* Twitter */}
                        <div className="space-y-1">
                          <Label
                            htmlFor="twitter"
                            className="text-gray-400 text-sm"
                          >
                            Twitter
                          </Label>
                          <div className="flex items-center">
                            <AtSign size={16} className="mr-2 text-blue-400" />
                            <p className="text-white">
                              {formData.twitter || "Not set"}
                            </p>
                          </div>
                        </div>
                        {/* Telegram */}
                        <div className="space-y-1">
                          <Label
                            htmlFor="telegram"
                            className="text-gray-400 text-sm"
                          >
                            Telegram
                          </Label>
                          <div className="flex items-center">
                            {/* ...existing svg... */}
                            <p className="text-white">
                              {formData.telegram || "Not set"}
                            </p>
                          </div>
                        </div>
                        {/* Farcaster */}
                        <div className="space-y-1">
                          <Label
                            htmlFor="farcaster"
                            className="text-gray-400 text-sm"
                          >
                            Farcaster
                          </Label>
                          <div className="flex items-center">
                            <Globe size={16} className="mr-2 text-blue-400" />
                            <p className="text-white">
                              {formData.farcaster || "Not set"}
                            </p>
                          </div>
                        </div>
                        {/* Google */}
                        <div className="space-y-1">
                          <Label
                            htmlFor="google"
                            className="text-gray-400 text-sm"
                          >
                            Google
                          </Label>
                          <div className="flex items-center">
                            {/* ...existing svg... */}
                            <p className="text-white">
                              {formData.google || "Not set"}
                            </p>
                          </div>
                        </div>
                        {/* Apple */}
                        <div className="space-y-1">
                          <Label
                            htmlFor="apple"
                            className="text-gray-400 text-sm"
                          >
                            Apple
                          </Label>
                          <div className="flex items-center">
                            <Apple size={16} className="mr-2 text-blue-400" />
                            <p className="text-white">
                              {formData.apple || "Not set"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
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
                    <label htmlFor="profile-upload" className="cursor-pointer">
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
                    <MapPin size={16} className="mr-2 text-blue-400" /> Country
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
                    <AtSign size={16} className="mr-2 text-blue-400" /> Twitter
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
                    <Globe size={16} className="mr-2 text-blue-400" /> Farcaster
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
                  loading ? "Saving profile changes..." : "Save profile changes"
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
      </main>
    </>
  );
};

export default Profile;
