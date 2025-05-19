"use client"

import { useState, useEffect } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Filter, SortDesc, ChevronDown } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { Badge } from "@/components/ui/badge"

// Mock data based on the screenshot
const nodes = [
  {
    id: 1,
    name: "ECLIPSE-DEV",
    chain: "eclipse",
    wallet: "ERk...V3t",
    region: "IN",
    downloadSpeed: "31.0328616644823",
    uploadSpeed: "28.5139682406685",
    status: "active",
    uptime: "47 d, 0 h, 20 m, 35 s",
    lastPing: "47 d, 0 h, 20 m, 1 s",
  },
  {
    id: 2,
    name: "rising_usurper",
    chain: "risetestnet",
    wallet: "0xa...D63",
    region: "US",
    downloadSpeed: "667.35675592972",
    uploadSpeed: "9.6689718174807",
    status: "active",
    uptime: "1 h, 43 m, 40 s",
    lastPing: "2 s",
  },
  {
    id: 3,
    name: "SuchNode-test-1",
    chain: "APTOS",
    wallet: "...",
    region: "SE",
    downloadSpeed: "986.9028",
    uploadSpeed: "856.9659",
    status: "active",
    uptime: "84 d, 19 h, 4 m, 38 s",
    lastPing: "2 s",
  },
  {
    id: 4,
    name: "ECLIPSE-DEV",
    chain: "eclipse",
    wallet: "ERk...V3t",
    region: "IN",
    downloadSpeed: "0",
    uploadSpeed: "0.1359069791872",
    status: "active",
    uptime: "47 d, 4 h, 43 m, 30 s",
    lastPing: "47 d, 4 h, 42 m, 54 s",
  },
  {
    id: 5,
    name: "universal_roar",
    chain: "solana",
    wallet: "8Tp...jHi",
    region: "SG",
    downloadSpeed: "3956.3063732943",
    uploadSpeed: "1182.0686534310",
    status: "active",
    uptime: "1 d, 13 h, 22 m, 11 s",
    lastPing: "2 s",
  },
  {
    id: 6,
    name: "ECLIPSE-DEV",
    chain: "eclipse",
    wallet: "ERk...V3t",
    region: "IN",
    downloadSpeed: "0",
    uploadSpeed: "0.2612765551983",
    status: "active",
    uptime: "48 d, 19 h, 13 m, 31 s",
    lastPing: "48 d, 19 h, 12 m, 55 s",
  },
  {
    id: 7,
    name: "ECLIPSE-DEV",
    chain: "eclipse",
    wallet: "ERk...V3t",
    region: "IN",
    downloadSpeed: "31.3257744459595",
    uploadSpeed: "32.4714682907108",
    status: "active",
    uptime: "47 d, 3 h, 21 m, 34 s",
    lastPing: "47 d, 3 h, 21 m, 3 s",
  },
  {
    id: 8,
    name: "ECLIPSE-DEV",
    chain: "eclipse",
    wallet: "ERk...V3t",
    region: "IN",
    downloadSpeed: "30.9685563865706",
    uploadSpeed: "33.0594113619596",
    status: "active",
    uptime: "47 d, 3 h, 27 m, 25 s",
    lastPing: "47 d, 3 h, 26 m, 54 s",
  },
  {
    id: 9,
    name: "ECLIPSE-DEV",
    chain: "eclipse",
    wallet: "ERk...V3t",
    region: "IN",
    downloadSpeed: "0",
    uploadSpeed: "0.1522116362097",
    status: "active",
    uptime: "47 d, 3 h, 32 m, 38 s",
    lastPing: "47 d, 3 h, 32 m, 2 s",
  },
  {
    id: 10,
    name: "solis",
    chain: "solana",
    wallet: "ApG...1iN",
    region: "FI",
    downloadSpeed: "4341.1913688607",
    uploadSpeed: "756.85361724445",
    status: "active",
    uptime: "1 d, 13 h, 47 m, 29 s",
    lastPing: "2 s",
  },
  {
    id: 11,
    name: "american_eagle",
    chain: "solana",
    wallet: "5d9...Myj",
    region: "US",
    downloadSpeed: "4929.7306396867",
    uploadSpeed: "972.49489543702",
    status: "active",
    uptime: "1 d, 13 h, 42 m, 8 s",
    lastPing: "2 s",
  },
  {
    id: 12,
    name: "shadow_serpent",
    chain: "peaq",
    wallet: "0x1...f0C",
    region: "DE",
    downloadSpeed: "550.25045756783",
    uploadSpeed: "366.83527334278",
    status: "inactive",
    uptime: "---",
    lastPing: "8 d, 4 h, 22 m, 13 s",
  },
]

export function NodeTable() {
  const [mounted, setMounted] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const filteredNodes = nodes.filter(
    (node) =>
      node.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.chain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      node.region.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="space-y-4"
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:w-64">
          <Input
            placeholder="Search nodes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="absolute w-4 h-4 text-muted-foreground top-3 left-3"
          >
            <circle cx="11" cy="11" r="8" />
            <path d="m21 21-4.3-4.3" />
          </svg>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <SortDesc className="w-4 h-4" />
                Sort
                <ChevronDown className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Name (A-Z)</DropdownMenuItem>
              <DropdownMenuItem>Name (Z-A)</DropdownMenuItem>
              <DropdownMenuItem>Region</DropdownMenuItem>
              <DropdownMenuItem>Status</DropdownMenuItem>
              <DropdownMenuItem>Uptime (Highest)</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="border rounded-lg bg-background/50 backdrop-blur-sm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-medium">NODE NAME</TableHead>
              <TableHead className="font-medium">CHAIN</TableHead>
              <TableHead className="font-medium">WALLET ADDRESS</TableHead>
              <TableHead className="font-medium">REGION</TableHead>
              <TableHead className="font-medium">NETWORK SPEED</TableHead>
              <TableHead className="font-medium">STATUS</TableHead>
              <TableHead className="font-medium">UPTIME</TableHead>
              <TableHead className="font-medium">LAST PING</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredNodes.map((node) => (
              <TableRow key={node.id} className="hover:bg-muted/50">
                <TableCell className="font-medium">{node.name}</TableCell>
                <TableCell>{node.chain}</TableCell>
                <TableCell className="font-mono text-xs">{node.wallet}</TableCell>
                <TableCell>{node.region}</TableCell>
                <TableCell>
                  <div className="text-xs">
                    <div>DL: {node.downloadSpeed}</div>
                    <div>UL: {node.uploadSpeed}</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant={node.status === "active" ? "success" : "destructive"}>{node.status}</Badge>
                </TableCell>
                <TableCell>{node.uptime}</TableCell>
                <TableCell>{node.lastPing}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  )
}
