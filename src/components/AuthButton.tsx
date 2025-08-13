"use client";

import { Button } from "@/components/ui/button";
import { useWalletAuth } from "../context/appkit";
import { Loader2, ShieldCheck, Lock, Pen } from "lucide-react";
import { cn } from "@/lib/utils";
import React, { useEffect, useState } from "react";
import { UserVerificationDialog } from "./common/UserVerificationDialog";
import { toast } from "sonner";

export function AuthButton() {
  const {
    isConnected,
    address,
    isAuthenticated,
    isVerified,
    isAuthenticating,
    authenticate,
  } = useWalletAuth();

  const [userStatus, setUserStatus] = useState<
    "checking" | "new" | "existing" | "signing" | "verified"
  >("checking");
  const [showVerificationDialog, setShowVerificationDialog] = useState(false);
  const [showVerified, setShowVerified] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  // Check if user exists without authentication (fallback for canceled signings)
  const checkUserExistsWithoutAuth = async (walletAddress: string) => {
    try {
      console.log(
        "Checking if user exists in system without auth:",
        walletAddress
      );

      // Try both Solana and EVM chains to check if user exists
      const chains = ["sol", "evm"];

      for (const chain of chains) {
        try {
          const response = await fetch(
            `https://gateway.dev.netsepio.com/api/v1.0/flowid?walletAddress=${walletAddress}&chain=${chain}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (response.ok) {
            const result = await response.json();
            console.log(`🔍 FlowId check result for ${chain}:`, result);

            // If we can get a flowId, the user exists in the system
            if (result.payload?.flowId) {
              console.log(
                `✅ User exists in system on ${chain} chain - they just need to sign to authenticate`
              );
              return true;
            }
          }
        } catch (chainError) {
          console.log(`Failed to check ${chain} chain:`, chainError);
          continue;
        }
      }

      console.log("❌ User not found on any supported chain");
      return false;
    } catch (error) {
      console.error("Error checking user existence:", error);
      return false;
    }
  };

  // Check if user exists and needs verification when wallet connects
  const checkUserExists = async (walletAddress: string) => {
    try {
      console.log("Checking user exists for wallet:", walletAddress);
      setUserStatus("checking");

      // Try to authenticate to determine user status
      const authResult = await authenticate();

      if (authResult.success) {
        console.log("🔍 Authentication result:", {
          success: authResult.success,
          isVerified: authResult.isVerified,
        });

        if (authResult.isVerified) {
          // User is authenticated and verified - get profile data
          const solanaToken = document.cookie
            .split("; ")
            .find((row) => row.startsWith("erebrus_token_solana="))
            ?.split("=")[1];

          const evmToken = document.cookie
            .split("; ")
            .find((row) => row.startsWith("erebrus_token_evm="))
            ?.split("=")[1];

          const pasetoToken = solanaToken || evmToken;

          if (pasetoToken) {
            try {
              const response = await fetch(
                "https://gateway.dev.netsepio.com/api/v1.0/profile",
                {
                  method: "GET",
                  headers: {
                    Authorization: `Bearer ${pasetoToken}`,
                    "Content-Type": "application/json",
                  },
                }
              );

              if (response.ok) {
                const result = await response.json();
                const userData = result.data || result;
                console.log("✅ Verified user profile:", userData);
                setUserData(userData);
                setUserStatus("existing");
                return true;
              }
            } catch (profileError) {
              console.error("Profile fetch error:", profileError);
            }
          }

          // User is verified but we couldn't get profile - treat as existing
          setUserStatus("existing");
          return true;
        } else {
          // User is authenticated but not verified - show verification dialog
          console.log(
            "⚠️ User authenticated but not verified - showing verification dialog"
          );
          setUserStatus("new");
          return false;
        }
      } else {
        // Authentication failed - check if user exists without auth (they might have canceled signing)
        console.log(
          "🔄 Authentication failed, checking if user exists in system..."
        );
        const userExists = await checkUserExistsWithoutAuth(walletAddress);

        if (userExists) {
          console.log(
            "✅ User exists but not authenticated - showing sign button"
          );
          setUserStatus("existing");
          setUserData(null);
          return false; // Not authenticated yet, but they exist
        } else {
          console.log("❌ User does not exist - new user");
          setUserStatus("new");
          setUserData(null);
          return false;
        }
      }
    } catch (error) {
      console.error("Error checking user exists:", error);
      setUserStatus("new");
      setUserData(null);
      return false;
    }
  };

  // Handle user verification (for new users) - Authentication already done in checkUserExists
  const handleVerify = async () => {
    if (!address) return;

    try {
      console.log("Opening registration dialog for new user...");
      setShowVerificationDialog(true);
    } catch (error) {
      console.error("Error opening verification dialog:", error);
      toast.error("Failed to open verification dialog. Please try again.");
    }
  };

  // Handle successful verification (after user registration)
  const handleVerificationSuccess = async (newUserData: any) => {
    console.log("User registration successful:", newUserData);
    setUserData(newUserData);

    // Update verification status in cookies after successful verification
    const isSolanaChain =
      window.location.href.includes("solana") ||
      document.cookie.includes("erebrus_token_solana");
    const chainType = isSolanaChain ? "solana" : "evm";
    document.cookie = `erebrus_verified_${chainType}=true; path=/; secure=${
      process.env.NODE_ENV === "production"
    }; samesite=strict`;

    setUserStatus("verified");
    setShowVerified(true);
    setShowVerificationDialog(false);
    toast.success(
      `Welcome, ${
        newUserData?.username || "User"
      }! Account created and verified.`
    );

    // Hide the verified animation after 3 seconds
    setTimeout(() => {
      setShowVerified(false);
    }, 3000);
  };

  // Handle existing user login - Need to authenticate first
  const handleExistingUserLogin = async () => {
    if (!address) return;

    try {
      setUserStatus("signing");
      console.log("🔄 Existing user attempting to authenticate...");

      const authResult = await authenticate();

      if (authResult.success) {
        if (authResult.isVerified) {
          // Existing verified user - success
          setUserStatus("verified");
          setShowVerified(true);

          // Try to get their profile data
          const solanaToken = document.cookie
            .split("; ")
            .find((row) => row.startsWith("erebrus_token_solana="))
            ?.split("=")[1];

          const evmToken = document.cookie
            .split("; ")
            .find((row) => row.startsWith("erebrus_token_evm="))
            ?.split("=")[1];

          const pasetoToken = solanaToken || evmToken;

          if (pasetoToken) {
            try {
              const response = await fetch(
                "https://gateway.dev.netsepio.com/api/v1.0/profile",
                {
                  method: "GET",
                  headers: {
                    Authorization: `Bearer ${pasetoToken}`,
                    "Content-Type": "application/json",
                  },
                }
              );

              if (response.ok) {
                const result = await response.json();
                const userData = result.data || result;
                setUserData(userData);
                toast.success(`Welcome back, ${userData?.username || "User"}!`);
              } else {
                toast.success("Welcome back!");
              }
            } catch (profileError) {
              console.error("Profile fetch error:", profileError);
              toast.success("Welcome back!");
            }
          } else {
            toast.success("Welcome back!");
          }

          setTimeout(() => {
            setShowVerified(false);
          }, 3000);
        } else {
          // User authenticated but not verified - should not happen for existing users
          console.log(
            "⚠️ Existing user authenticated but not verified - showing verification dialog"
          );
          setUserStatus("new");
          setShowVerificationDialog(true);
        }
      } else {
        // Authentication failed - user canceled or error occurred
        console.log("❌ Authentication failed for existing user");
        setUserStatus("existing");
        toast.error("Authentication failed. Please try again.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setUserStatus("existing");
      toast.error("Login failed. Please try again.");
    }
  };

  // Reset state when wallet disconnects
  const resetAuthState = () => {
    setUserStatus("checking");
    setUserData(null);
    setShowVerified(false);
    setShowVerificationDialog(false);
  };

  // Check user status when wallet connects/disconnects
  useEffect(() => {
    if (isConnected && address) {
      console.log("Wallet connected, checking user status for:", address);
      checkUserExists(address);
    } else {
      console.log("Wallet disconnected, resetting auth state");
      resetAuthState();
    }
  }, [isConnected, address]);

  // Auto-show verification dialog for authenticated but unverified users
  useEffect(() => {
    if (isAuthenticated && isVerified === false && userStatus === "new") {
      console.log(
        "User is authenticated but not verified - showing verification dialog"
      );
      setShowVerificationDialog(true);
    }
  }, [isAuthenticated, isVerified, userStatus]);

  // Don't show anything if wallet is not connected
  if (!isConnected || !address) {
    return null;
  }

  // Don't show button if user is verified and animation is not showing
  if (userStatus === "verified" && !showVerified && isAuthenticated) {
    return null;
  }

  const getButtonProps = () => {
    // If currently authenticating with wallet
    if (isAuthenticating || userStatus === "signing") {
      return {
        content: (
          <div className="flex items-center gap-2 px-2">
            <Loader2 size={18} className="animate-spin" />
            <span className="text-sm">Signing...</span>
          </div>
        ),
        className:
          "bg-yellow-500 hover:bg-yellow-600 text-white cursor-not-allowed",
        disabled: true,
        onClick: () => {},
      };
    }

    switch (userStatus) {
      case "checking":
        return {
          content: <Loader2 size={20} className="animate-spin mx-auto" />,
          className: "p-2 w-12 bg-blue-500 text-white",
          disabled: true,
          onClick: () => {},
        };

      case "new":
        return {
          content: (
            <div className="flex items-center gap-2 px-2">
              <Lock size={18} />
              <span className="text-sm">Verify</span>
            </div>
          ),
          className: "bg-orange-500 hover:bg-orange-600 text-white",
          disabled: false,
          onClick: handleVerify,
        };

      case "existing":
        return {
          content: (
            <div className="flex items-center gap-2 px-2">
              <Pen size={18} />
              <span className="text-sm">Sign In</span>
            </div>
          ),
          className: "bg-green-500 hover:bg-green-600 text-white",
          disabled: false,
          onClick: handleExistingUserLogin,
        };

      case "verified":
        return {
          content: (
            <div className="flex items-center gap-2 px-2">
              <ShieldCheck size={18} className="animate-pulse" />
              <span className="text-sm">Verified!</span>
            </div>
          ),
          className: "bg-green-500 text-white",
          disabled: true,
          onClick: () => {},
        };

      default:
        return {
          content: <span className="text-sm">Error</span>,
          className: "bg-red-500 text-white",
          disabled: true,
          onClick: () => {},
        };
    }
  };

  const { content, className, disabled, onClick } = getButtonProps();

  return (
    <>
      <Button
        onClick={onClick}
        disabled={disabled}
        size="sm"
        className={cn(
          "ml-2 transition-all duration-200 font-medium",
          className
        )}
      >
        {content}
      </Button>

      {/* Verification Dialog */}
      <UserVerificationDialog
        isOpen={showVerificationDialog}
        onClose={() => setShowVerificationDialog(false)}
        walletAddress={address || ""}
        onSuccess={handleVerificationSuccess}
      />
    </>
  );
}
