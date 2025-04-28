"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export function GradientBackground() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed inset-0 z-0 overflow-hidden">
      <div className="absolute inset-0 bg-background/95" />
      <motion.div
        className="absolute inset-0 opacity-30"
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.3 }}
        transition={{ duration: 1 }}
      >
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/20 via-background to-background" />
        <div className="absolute top-0 right-0 w-3/4 h-3/4 bg-gradient-to-bl from-primary/10 via-background to-background" />
        <div className="absolute bottom-0 left-0 w-2/3 h-2/3 bg-gradient-to-tr from-primary/5 via-background to-background" />
      </motion.div>
    </div>
  )
}
