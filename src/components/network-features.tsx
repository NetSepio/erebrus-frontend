"use client"

import { useEffect, useState } from "react"
import { Shield, Lock, Globe, Zap } from "lucide-react"
import { motion } from "framer-motion"

const features = [
  {
    icon: <Shield className="w-10 h-10" />,
    title: "Enhanced Privacy",
    description:
      "Your data is encrypted and routed through multiple nodes, ensuring your online activities remain private.",
  },
  {
    icon: <Lock className="w-10 h-10" />,
    title: "Secure Connections",
    description: "Military-grade encryption protects your data from prying eyes and potential threats.",
  },
  {
    icon: <Globe className="w-10 h-10" />,
    title: "Global Access",
    description: "Access content from anywhere in the world without restrictions or censorship.",
  },
  {
    icon: <Zap className="w-10 h-10" />,
    title: "High Performance",
    description: "Our optimized network ensures fast and reliable connections for seamless browsing.",
  },
]

export function NetworkFeatures() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="grid gap-8 mt-12 md:grid-cols-2 lg:grid-cols-4">
      {features.map((feature, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="p-6 text-center rounded-lg bg-background/50 backdrop-blur-sm border border-border/50"
        >
          <div className="flex items-center justify-center p-2 mx-auto rounded-full w-fit bg-primary/10 text-primary">
            {feature.icon}
          </div>
          <h3 className="mt-4 text-xl font-semibold">{feature.title}</h3>
          <p className="mt-2 text-sm text-muted-foreground">{feature.description}</p>
        </motion.div>
      ))}
    </div>
  )
}
