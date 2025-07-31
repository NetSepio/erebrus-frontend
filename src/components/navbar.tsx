"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Home, FileText, LayoutDashboard } from "lucide-react";
import { FloatingDock } from "@/components/ui/floating-dock";
import { motion, AnimatePresence } from "framer-motion";
import Cookies from "js-cookie";
import UserDropdown from "@/components/login/UserDropdown";
import { AuthButton } from "./AuthButton";

const ErebrusNavbar = () => {
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showDock, setShowDock] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [showVerifyDialog, setShowVerifyDialog] = useState(false);
  const [showSignInDialog, setShowSignInDialog] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const address = Cookies.get("erebrus_wallet");
  const token = Cookies.get("erebrus_token");
  useEffect(() => {
    if (token) {
      const getRandomNumber = () => Math.floor(Math.random() * 1000);
      const imageUrl = `https://robohash.org/${getRandomNumber()}`;
      setAvatarUrl(imageUrl);
    }
  }, [token]);
  const handlePasetoClick = () => {
    console.log("Show paseto QR code");
  };

  // Dummy check for verification, replace with your logic
  useEffect(() => {
    // For demo, check a cookie or localStorage for verification status
    const verified = Cookies.get("erebrus_verified") === "true";
    setIsVerified(!!verified);
  }, [token]);

  // Handler for successful verification
  const handleVerificationSuccess = (userData) => {
    setIsVerified(true);
    Cookies.set("erebrus_verified", "true");
    setShowVerifyDialog(false);
  };

  // Handler for successful sign-in
  const handleSignInSuccess = () => {
    setShowSignInDialog(false);
    // Optionally, set auth state/cookie here
  };

  // Stub for wallet registration check
  const handleVerifyClick = async () => {
    // TODO: Replace with backend call
    // Example: const res = await fetch(`/api/users/check-wallet?address=${address}`)
    // const { registered } = await res.json();
    const registered = false; // Change to backend result
    if (registered) {
      setShowSignInDialog(true);
    } else {
      setShowVerifyDialog(true);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Determine if we're scrolling up or down
      if (currentScrollY > lastScrollY) {
        // Scrolling down
        setScrolled(true);
        if (currentScrollY > 150) {
          setShowDock(true);
        }
      } else {
        // Scrolling up
        if (currentScrollY < 50) {
          setScrolled(false);
          setShowDock(false);
        } else {
          setScrolled(false);
          setShowDock(true);
        }
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  const navItems = [
    { name: "Explorer", link: "/explorer" },
    {
      name: "Docs",
      link: "https://docs.netsepio.com/erebrus/",
      external: true,
    },
    { name: "Dashboard", link: "/dashboard" },
  ];

  const dockItems = [
    {
      title: "Home",
      icon: <Home className="h-full w-full text-blue-500" />,
      href: "/",
    },
    {
      title: "Explorer",
      icon: <FileText className="h-full w-full text-blue-500" />,
      href: "/explorer",
    },
    {
      title: "Dashboard",
      icon: <LayoutDashboard className="h-full w-full text-blue-500" />,
      href: "/dashboard",
    },
  ];

  return (
    <>
      <motion.nav
        initial={{ y: 0, opacity: 1 }}
        animate={{
          y: scrolled ? -100 : 0,
          opacity: scrolled ? 0 : 1,
        }}
        transition={{ duration: 0.3 }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? "pointer-events-none" : "pointer-events-auto"
        } ${
          lastScrollY > 50
            ? "bg-black/80 backdrop-blur-md py-3 shadow-lg"
            : "bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image
                src="/images/Erebrus_logo_wordmark.webp"
                alt="Erebrus"
                width={150}
                height={40}
                className="h-10 w-auto"
                sizes="100vw"
              />
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              {navItems.map((item, index) => (
                <Link
                  key={index}
                  href={item.link}
                  className="text-white hover:text-blue-300 transition-colors duration-300 text-lg font-medium"
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                >
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Login & Verify Button Component */}
            <div className="flex items-center">
              {token ? (
                <>
                  <UserDropdown
                    avatarUrl={avatarUrl}
                    handlePasetoClick={handlePasetoClick}
                    paseto={token}
                  />
                  {!isVerified && (
                    <button
                      className="ml-3 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-400 text-white rounded-lg font-medium hover:opacity-90 transition-all"
                      onClick={handleVerifyClick}
                    >
                      Verify
                    </button>
                  )}
                </>
              ) : (
                <>
                  <appkit-button />
                  <AuthButton />
                </>
              )}
            </div>

            {/* Verification Dialog */}
            {showVerifyDialog && (
              <UserVerificationDialog
                isOpen={showVerifyDialog}
                onClose={() => setShowVerifyDialog(false)}
                walletAddress={address || ""}
                onSuccess={handleVerificationSuccess}
              />
            )}
            {/* Sign-in Dialog stub (replace with your actual sign-in dialog/component) */}
            {showSignInDialog && (
              <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                <div className="bg-[#1A1A1A] rounded-2xl border border-[#2A2A2A] max-w-md w-full max-h-[90vh] overflow-y-auto p-6">
                  <h2 className="text-xl font-bold text-white mb-4">Sign In</h2>
                  <p className="text-[#AAAAAA] mb-6">
                    Wallet already registered. Please sign in.
                  </p>
                  <button
                    className="w-full py-3 px-4 bg-gradient-to-r from-[#00A3FF] to-[#00F0FF] hover:opacity-90 text-white rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    onClick={handleSignInSuccess}
                  >
                    Sign In with Wallet
                  </button>
                  <button
                    className="w-full mt-3 py-3 px-4 bg-[#333333] hover:bg-[#3A3A3A] text-white rounded-lg transition-colors"
                    onClick={() => setShowSignInDialog(false)}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-white focus:outline-none"
                aria-label={
                  isOpen
                    ? "Close mobile navigation menu"
                    : "Open mobile navigation menu"
                }
              >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden absolute w-full bg-black/95 backdrop-blur-md"
            >
              <div className="container mx-auto px-6 flex flex-col space-y-4 py-6">
                {navItems.map((item, index) => (
                  <Link
                    key={index}
                    href={item.link}
                    className="text-white hover:text-blue-300 transition-colors duration-300 py-2 text-lg"
                    onClick={() => setIsOpen(false)}
                    target={item.external ? "_blank" : undefined}
                    rel={item.external ? "noopener noreferrer" : undefined}
                  >
                    {item.name}
                  </Link>
                ))}
                <div className="flex flex-col space-y-3 pt-4 border-t border-white/10">
                  {/* Mobile login buttons could go here if needed */}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Floating Dock */}
      <AnimatePresence>
        {showDock && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50"
          >
            <FloatingDock
              items={dockItems}
              desktopClassName="shadow-xl shadow-blue-500/10 border border-blue-500/20"
              mobileClassName="shadow-xl shadow-blue-500/10"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ErebrusNavbar;
