"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, Home, FileText, LayoutDashboard } from "lucide-react";
import { FloatingDock } from "@/components/ui/floating-dock";
import { motion, AnimatePresence } from "framer-motion";
import Cookies from "js-cookie";
import UserDropdown from "@/components/login/UserDropdown";
import { useAppKit } from "@reown/appkit/react";

const ErebrusNavbar = () => {
  const [avatarUrl, setAvatarUrl] = useState("");

  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [showDock, setShowDock] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
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

  const handleDeleteCookie = async () => {
    try {
      const appKit = useAppKit();

      // Disconnect the wallet

      await appKit.close();
      console.log("AppKit connection closed");

      // Set localStorage flag for MetaMask disconnection
      localStorage.setItem(
        "wagmi.io.metamask.disconnected",
        JSON.stringify(true)
      );

      // Remove cookies
      Cookies.remove("erebrus_token", { path: "/" });
      Cookies.remove("erebrus_wallet", { path: "/" });
      Cookies.remove("erebrus_userid", { path: "/" });
      Cookies.remove("Chain_symbol", { path: "/" });
      console.log("Cookies cleared");

      // Redirect to homepage
      window.location.href = "/";

      return true;
    } catch (error) {
      console.error("Logout error:", error);
      return false;
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
        <header className="container mx-auto px-6">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link href="/" className="flex items-center">
              <Image
                src="/images/Erebrus_logo_wordmark.webp"
                alt="Erebrus"
                width={150}
                height={40}
                className="h-10 w-auto"
              />
            </Link>

            {/* Desktop Navigation */}
            <nav
              className="hidden md:flex items-center space-x-8"
              aria-label="Main Navigation"
            >
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
            </nav>

            {/* Login Button Component */}
            <div className="flex items-center">
              {token ? (
                <>
                  <UserDropdown
                    avatarUrl={avatarUrl}
                    handlePasetoClick={handlePasetoClick}
                    paseto={token}
                  />
                </>
              ) : (
                <>
                  <appkit-button />
                </>
              )}
            </div>

            {/* Mobile Menu Button */}
            <nav className="md:hidden" aria-label="Mobile Navigation">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="text-white focus:outline-none"
              >
                {isOpen ? <X size={28} /> : <Menu size={28} />}
              </button>
            </nav>
          </div>
        </header>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.nav
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="md:hidden absolute w-full bg-black/95 backdrop-blur-md"
              aria-label="Mobile Navigation Menu"
            >
              <nav
                className="container mx-auto px-6 flex flex-col space-y-4 py-6"
                aria-label="Mobile Navigation Links"
              >
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
              </nav>
            </motion.nav>
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
