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
import { useWalletAuth } from "@/context/appkit";

const ErebrusNavbar = () => {
  // Use the updated authentication hook
  const { isConnected, address, isAuthenticated, isVerified } = useWalletAuth();

  const [avatarUrl, setAvatarUrl] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showDock, setShowDock] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Helper function to get the correct authentication token
  const getAuthToken = () => {
    const solanaToken = Cookies.get("erebrus_token_solana");
    const evmToken = Cookies.get("erebrus_token_evm");
    return solanaToken || evmToken || null;
  };

  const token = getAuthToken();
  useEffect(() => {
    if (token && isAuthenticated) {
      const getRandomNumber = () => Math.floor(Math.random() * 1000);
      const imageUrl = `https://robohash.org/${getRandomNumber()}`;
      setAvatarUrl(imageUrl);
    }
  }, [token, isAuthenticated]);

  const handlePasetoClick = () => {
    // Handle paseto QR code display
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
              {isConnected && isAuthenticated && isVerified && token ? (
                <UserDropdown
                  avatarUrl={avatarUrl}
                  handlePasetoClick={handlePasetoClick}
                  paseto={token}
                />
              ) : (
                <>
                  <appkit-button />
                  <AuthButton />
                </>
              )}
            </div>

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
