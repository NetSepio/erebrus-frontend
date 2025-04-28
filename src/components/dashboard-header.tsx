"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export function DashboardHeader() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mb-8"
    >
      <h1 className="text-3xl font-bold md:text-4xl">Erebrus Decentralized VPN (DVPN) Network Nodes Overview</h1>
      <p className="mt-4 text-muted-foreground">
        Explore the Erebrus decentralized VPN network with our interactive map. View detailed information on active
        nodes, including their location, network performance, and status. This map provides real-time insights into the
        global distribution and operation of our secure and private VPN infrastructure.
      </p>
    </motion.div>
  )
}
