"use client"

import { useEffect, useState } from "react"
import { Network, Globe, Activity } from "lucide-react"
import { motion } from "framer-motion"

export function DashboardStats() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="grid gap-4 mb-8 md:grid-cols-3">
      {[
        { icon: <Network className="w-6 h-6 text-primary" />, label: "NO. OF NODES", value: "14" },
        { icon: <Globe className="w-6 h-6 text-primary" />, label: "NO. OF REGIONS", value: "6" },
        { icon: <Activity className="w-6 h-6 text-primary" />, label: "ACTIVE NODES", value: "12" },
      ].map((stat, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: index * 0.1 }}
          className="flex items-center gap-4 p-4 border rounded-lg bg-background/50 backdrop-blur-sm"
        >
          <div className="p-2 rounded-full bg-primary/10">{stat.icon}</div>
          <div>
            <p className="text-xs font-medium text-muted-foreground">{stat.label}</p>
            <p className="text-2xl font-bold">{stat.value}</p>
          </div>
        </motion.div>
      ))}
    </div>
  )
}
