"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MapPin } from "lucide-react";
import { motion } from "framer-motion";

export function HeroSection() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section className="container px-4 py-24 mx-auto text-center md:py-32">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-3xl mx-auto"
      >
        <h2 className="text-4xl font-bold tracking-tight md:text-6xl">
          Decentralized Access with{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-primary/70">
            Erebrus DVPN
          </span>
        </h2>
        <p className="mt-6 text-xl text-muted-foreground">
          Unrestricted Uncensored Web Access
        </p>
        <div className="flex flex-col items-center justify-center gap-4 mt-10 md:flex-row">
          <Button asChild size="lg" className="w-full md:w-auto" aria-label="Run your own Erebrus node">
            <Link href="/run-node">Run Your Node</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full md:w-auto"
            aria-label="View active Erebrus node map"
          >
            <Link href="/dashboard" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Active Node Map
            </Link>
          </Button>
        </div>
      </motion.div>
    </section>
  );
}
