"use client"

import { useState, useEffect, type FormEvent, type ChangeEvent } from "react"
import { Cloud, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Shield, Lock, Database, Zap, Smartphone } from "lucide-react"
import { lib, enc } from "crypto-js"
import { generateKeyPair } from "curve25519-js"
import crypto from "crypto"
import { QRCodeSVG } from "qrcode.react"
import { saveAs } from "file-saver"
import { BackgroundBeams } from "@/components/ui/background-beams"
import FileUploadDemo from "@/components/file-upload-demo"
import { useAppKitAccount } from "@reown/appkit/react"
import NotLoggedIn from "./notLoggedin"
import Cookies from "js-cookie"
import axios from "axios"
import React from "react"
import MyVpnCard from "./MyVpnCard"
export interface FlowIdResponse {
  eula: string
  flowId: string
}

export interface WalletData {
  walletAddress: string | undefined
}

interface FormData {
  name: string
  region: string
}
export default function DashboardPage() {
  const EREBRUS_GATEWAY_URL = "https://gateway.erebrus.io/"
  const token = Cookies.get("erebrus_token")
  console.log("Token from cookies:", token)
  const [showClients, setShowClients] = useState(false)
  const [showFileStorage, setShowFileStorage] = useState(false)
  const [clients, setClients] = useState([{ id: 1, name: "tejas22", region: "DE", createdAt: "4/8/2025, 7:59:20 PM" }])
  const [verify, setverify] = useState<boolean>(false)
  const [buttonset, setbuttonset] = useState<boolean>(false)
  const [isOpen, setIsOpen] = useState(false)
  const [showQrCodeModal, setShowQrCodeModal] = useState(false)

  const initialFormData: FormData = {
    name: "",
    region: "",
  }
  const [formData, setFormData] = useState<FormData>(initialFormData)
  const [collectionsPage, setcollectionsPage] = useState<boolean>(true)
  const [collectionId, setcollectionId] = useState<string>()
  const [collectionName, setcollectionName] = useState<string>()
  const [collectionImage, setcollectionImage] = useState<string>()
  const [vpnPage, setvpnPage] = useState<boolean>(false)
  const [clientUUID, setClientUUID] = useState<string>("")
  const [valueFromChild2, setValueFromChild2] = useState<string>("")
  const [msg, setMsg] = useState<string>("")
  const [selectedIndex, setSelectedIndex] = useState<any>(null)
  const [regionname, setregionname] = useState<string>("")

  const handleCollectionClick = (collection: string, collectionName: string, collectionImage: string) => {
    setcollectionId(collection)
    setcollectionName(collectionName)
    setcollectionImage(collectionImage)
    setvpnPage(true)
    setcollectionsPage(false)
  }
  interface Subscription {
    type: string
    startTime: string
    endTime: string
  }
  const handleChildValue = (value: string) => {
    // Callback function to update the state in the parent component
    setValueFromChild2(value)
    console.log("valueFromChild2", value)
  }

  const [imageSrc, setImageSrc] = React.useState<string | null>(null)
  useEffect(() => {
    const fetchMetaData = async () => {
      console.log("collectionImage", collectionImage)
      const ipfsCid = collectionImage?.replace("ipfs://", "")

      // Fetching metadata from IPFS
      const metadataResponse = await axios.get(`https://ipfs.io/ipfs/${ipfsCid}`)
      const metadata = metadataResponse.data

      console.log("Metadata:", metadata)
      setImageSrc(metadata?.image.replace("ipfs://", ""))
    }
    fetchMetaData()
  }, [collectionImage])
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  const [subscriptionStatus, setSubscriptionStatus] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const { address, isConnected } = useAppKitAccount()
  const [ConfigFile, setConfigFile] = useState<string>("")
  const [VpnName, setVpnName] = useState<string>("")
  // Fetch subscription data
  useEffect(() => {
    const fetchSubscription = async () => {
      if (!token) {
        setLoading(false)
        return
      }

      try {
        const EREBRUS_GATEWAY_URL = "https://gateway.erebrus.io/"
        const response = await fetch(`${EREBRUS_GATEWAY_URL}api/v1.0/subscription`, {
          method: "GET",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        console.log("Subscription data:", data)
        if (data.status === "notFound") {
          setSubscriptionStatus("notFound")
        } else {
          setSubscription(data.subscription)
          setSubscriptionStatus(data.status)
        }

        setLoading(false)
      } catch (err) {
        console.error("Error fetching subscription:", err)
        setError("Failed to load subscription details")
        setLoading(false)
      }
    }

    fetchSubscription()
  }, [token])
  interface ProjectData {
    id: string
    name: string
    region: string
    createdAt: string
    created_at: string // Added property
    UUID: string // Added property
    walletAddress: number // Added property
    [key: string]: any // Add additional fields if necessary
  }
  const [projectsData, setprojectsData] = useState<ProjectData[] | null>(null)

  const fetchProjectsData = async () => {
    setLoading(true)
    try {
      const auth = Cookies.get("erebrus_token")

      const response = await axios.get(`${EREBRUS_GATEWAY_URL}api/v1.0/erebrus/clients`, {
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth}`,
        },
      })

      console.log("vpn decentralized", response)

      if (response.status === 200) {
        // Filter the data based on the domain ID
        const wallet = Cookies.get("erebrus_userid")
        const payload: any[] = response.data.payload
        const filteredData = payload.filter((item) => item?.userId === wallet)
        filteredData.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        setprojectsData(filteredData)
        console.log("decentralized", filteredData)
      }
    } catch (error) {
      console.error("Error fetching profile data:", error)
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    if (showClients === true) {
      fetchProjectsData()
    }
  }, [showClients]) // 👈 Only run when showClients changes
  // Format date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString("en-US", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      hour12: true,
    })
  }
  const regiondata = [
    { id: "SG", region: "Singapore" },
    { id: "IN", region: "India" },
    { id: "US", region: "United States" },
    { id: "JP", region: "Japan" },
    { id: "CA", region: "Canada" },
    { id: "GB", region: "United Kingdom" },
    { id: "AU", region: "Australia" },
    { id: "DE", region: "Germany" },
    // Add more nodes as needed
  ]
  const handleRegionChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target
    setregionname(value)
  }
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { id, value } = e.target
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: value,
    }))
  }
  interface Node {
    id: string
    status: string
    region: string
    walletAddress: string
    chainName: string
  }
  const [activeNodesData, setActiveNodesData] = useState<Node[]>([])
  const [nodesdata, setNodesData] = useState([])

  useEffect(() => {
    const fetchNodesData = async () => {
      try {
        const auth = Cookies.get("erebrus_token")

        const response = await axios.get(`${EREBRUS_GATEWAY_URL}api/v1.0/nodes/all`, {
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth}`,
          },
        })

        if (response.status === 200) {
          const payload = response.data.payload
          setNodesData(payload)
          interface Node {
            id: string
            status: string
            region: string
          }

          const filteredNodes = payload.filter(
            (node: Node) =>
              node.status === "active" && node.region !== undefined && node.region !== null && node.region.trim(),
          )
          setActiveNodesData(filteredNodes)

          // Extract and store unique regions
          const regions = Array.from(new Set(filteredNodes.map((node: Node) => node.region)))

          console.log("erebrus nodes", payload)
        }
      } catch (error) {
        console.error("Error fetching nodes data:", error)
      } finally {
      }
    }

    fetchNodesData()
  }, [])
  const generateSerialNumber = (region: string, index: number): string => {
    const number = (index + 1).toString().padStart(3, "0")
    return `${region}${number}`
  }
  const sliceWalletAddress = (walletAddress: string) => {
    return `${walletAddress.slice(0, 3)}...${walletAddress.slice(-3)}`
  }
  const sliceNodeId = (nodeId: string) => {
    return `${nodeId.slice(0, 3)}...${nodeId.slice(-3)}`
  }
  const handleDropdownToggle = () => {
    setIsOpen(!isOpen)
  }
  const genKeys = () => {
    const preSharedKey = lib.WordArray.random(32)
    // Encode the keys in base64

    const preSharedKeyB64 = preSharedKey.toString(enc.Base64)

    const keyPair = generateKeyPair(crypto.randomBytes(32))
    const privKey = Buffer.from(keyPair.private).toString("base64")
    const pubKey = Buffer.from(keyPair.public).toString("base64")
    const keys = {
      preSharedKey: preSharedKeyB64,
      privKey: privKey,
      pubKey: pubKey,
    }

    return keys
  }
  const [selectedOption, setSelectedOption] = useState<any>(null)
  const handleOptionClick = (option: { id: string; [key: string]: any }) => {
    setSelectedOption(option) // Ensuring option is an object
    setFormData((prevData) => ({ ...prevData, region: option.id }))
    setIsOpen(false)
  }

  const resetForm = () => {
    setFormData(initialFormData)
    setSelectedOption(null)
    setSelectedIndex(null)
    setregionname("")
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    setLoading(true)

    const auth = Cookies.get("erebrus_token")
    console.log("clicked")
    try {
      const keys = genKeys()
      const formDataObj = new FormData()
      formDataObj.append("name", formData.name)
      formDataObj.append("presharedKey", keys.preSharedKey)
      formDataObj.append("publicKey", keys.pubKey)

      // Convert FormData to JavaScript Object
      const formDataObject: { [key: string]: string | File | null } = {}
      formDataObj.forEach((value, key) => {
        formDataObject[key] = value
      })

      // Convert JavaScript Object to JSON string
      const jsonData = JSON.stringify(formDataObject)

      const response = await fetch(`${EREBRUS_GATEWAY_URL}api/v1.0/erebrus/client/${formData.region}`, {
        method: "POST",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth}`,
        },
        body: jsonData,
      })

      if (response.status === 200) {
        const responseData = await response.json()
        setVpnName(responseData.payload.client.Name)
        setClientUUID(responseData.payload.client.UUID)
        setFormData(initialFormData)
        console.log("vpn data", responseData)

        const configFile = `
        [Interface]
        Address = ${responseData.payload.client.Address}
        PrivateKey = ${keys.privKey}
        DNS = 1.1.1.1

        [Peer]
        PublicKey = ${responseData.payload.serverPublicKey}
        PresharedKey = ${responseData.payload.client.PresharedKey} 
        AllowedIPs = 0.0.0.0/0, ::/0
        Endpoint = ${responseData.payload.endpoint}:51820
        PersistentKeepalive = 16`
        setConfigFile(configFile)
        setverify(true)
        setShowQrCodeModal(true)
        setValueFromChild2("refreshafterclientcreate")

        fetchProjectsData()
        resetForm()
        // Close the form modal
        setbuttonset(false)
      } else {
        setMsg("Failed to create VPN. Try with unique name.")
      }
    } catch (error) {
      console.error("Error:", error)
      setMsg("Failed to create VPN. Try with unique name.")
    } finally {
      setLoading(false)
    }
  }
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div className="flex min-h-screen flex-col bg-slate-950 text-white relative">
      <div className="absolute inset-0 z-0">
        <BackgroundBeams />
      </div>
      {!token ? (
        <>
          <NotLoggedIn />
        </>
      ) : (
        <>
          {/* Main content */}
          <main className="relative z-10 flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 mt-16">
            {subscriptionStatus === "notFound" ? (
              <>
                <div className="grid gap-4 max-w-6xl mx-auto w-full justify-center items-center">
                  <Card className="bg-slate-900/60 border-slate-800 text-white">
                    <CardHeader>
                      <CardTitle>Upgrade Your Subscription</CardTitle>
                      <CardDescription className="text-slate-400">
                        Get access to premium features with our Quantum Tier
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-6">
                      <div className="rounded-lg bg-slate-800/50 p-6">
                        <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-blue-900/30 text-blue-400 mb-2">
                          PREMIUM
                        </span>
                        <h2 className="text-gray-100 text-2xl font-bold mb-2">Quantum Tier Subscription</h2>
                        <p className="text-gray-400 text-sm mb-6">Advanced security & networking features</p>

                        <div className="flex items-baseline mb-8">
                          <span className="text-white text-4xl font-bold">$5.99</span>
                          <span className="text-gray-500 ml-2">/month</span>
                          <span className="ml-3 text-xs bg-blue-900/30 text-blue-400 px-2 py-1 rounded">SAVE 40%</span>
                        </div>

                        <Button
                          className="w-full bg-gradient-to-r from-blue-700 to-blue-600 py-3 px-4 text-center text-white font-medium shadow-lg shadow-blue-900/20 hover:shadow-blue-900/40 transition-all duration-300"
                          onMouseEnter={() => setIsHovered(true)}
                          onMouseLeave={() => setIsHovered(false)}
                          onClick={async () => {
                            const auth = Cookies.get("erebrus_token")
                            try {
                              const response = await fetch(`${EREBRUS_GATEWAY_URL}api/v1.0/subscription/trial`, {
                                method: "POST",
                                headers: {
                                  Accept: "application/json, text/plain, */*",
                                  "Content-Type": "application/json",
                                  Authorization: `Bearer ${auth}`,
                                },
                                // body: jsonData,
                              })

                              if (response.status === 200) {
                                const responseData = await response.json()
                                console.log("trial subsc response", responseData)
                                window.location.reload()
                                // settrialbuytrue(true);
                                // for alert
                                setTimeout(() => {
                                  window.location.href = "/dashboard"
                                }, 3000)
                              }
                            } catch (error) {
                              console.error("Error:", error)
                            } finally {
                            }
                          }}
                        >
                          <span
                            className={`inline-block transition-transform duration-300 ${isHovered ? "scale-105" : ""}`}
                          >
                            Start 7-Day Free Trial
                          </span>
                        </Button>

                        <ul className="space-y-4 mt-8">
                          {[
                            {
                              icon: <Lock size={16} />,
                              text: "Decentralized Zero-Trust Network",
                            },
                            {
                              icon: <Shield size={16} />,
                              text: "Multi-layer Quantum Encryption",
                            },
                            {
                              icon: <Database size={16} />,
                              text: "Real-time Threat Analysis & Prevention",
                            },
                            {
                              icon: <Zap size={16} />,
                              text: "AI-powered Security Insights",
                            },
                            {
                              icon: <Smartphone size={16} />,
                              text: "Cross-platform Secure Access",
                            },
                          ].map((item, index) => (
                            <li
                              key={index}
                              className={`flex items-center text-gray-400 transition-all duration-300 ${
                                isHovered ? "translate-x-1" : ""
                              }`}
                              style={{ transitionDelay: `${index * 50}ms` }}
                            >
                              <div className="flex items-center justify-center w-6 h-6 rounded-full bg-blue-900/30 text-blue-400 mr-3">
                                {item.icon}
                              </div>
                              {item.text}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </>
            ) : (
              <>
                {showClients ? (
                  <div className="max-w-6xl w-full mx-auto">
                    <div className="flex justify-between items-center mb-6">
                      <h1 className="text-2xl font-bold">My VPN Clients</h1>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                          onClick={() => setShowClients(false)}
                        >
                          View Subscriptions
                        </Button>

                        <Button
                          onClick={() => {
                            setbuttonset(true)
                          }}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add More Clients
                        </Button>
                      </div>
                    </div>

                    <Card className="bg-slate-900/60 border-slate-800 text-white">
                      <CardHeader>
                        <div className="flex items-center gap-4">
                          {imageSrc ? (
                            <img
                              src={`${"https://nftstorage.link/ipfs"}/${imageSrc}`}
                              className="w-14 h-14 rounded-full"
                            />
                          ) : (
                            <img src="subscriptionprofile.webp" className="w-14 h-14 rounded-full" />
                          )}{" "}
                          <div>
                            <CardTitle>
                              {subscription ? `${subscription.type.toUpperCase()} Subscription` : "Loading..."}
                            </CardTitle>
                          </div>
                        </div>
                        <appkit-button />
                      </CardHeader>
                      <CardContent>
                        {projectsData && projectsData?.length !== 0 ? (
                          <>
                            {projectsData.map((metaData, index) => (
                              <div key={index} className="flex">
                                <MyVpnCard metaData={metaData} />
                              </div>
                            ))}{" "}
                          </>
                        ) : (
                          <>
                            <div className="text-center text-slate-400">Add Client</div>
                          </>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                ) : (
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-2 max-w-6xl mx-auto w-full">
                    <Card className="bg-slate-900/60 border-slate-800 text-white">
                      <CardHeader>
                        <CardTitle>Subscription</CardTitle>
                        <CardDescription className="text-slate-400">Your current plan and usage</CardDescription>
                      </CardHeader>
                      <CardContent className="p-6">
                        {loading ? (
                          <p className="text-slate-300">Loading subscription...</p>
                        ) : error ? (
                          <p className="text-red-400">{error}</p>
                        ) : subscription ? (
                          <div className="rounded-lg bg-slate-800/50 p-6">
                            <div className="flex items-center justify-between">
                              <div>
                                <h3 className="text-xl font-bold">{subscription.type.toUpperCase()} SUBSCRIPTION</h3>
                                <p className="text-sm text-slate-400">
                                  ({subscriptionStatus === "expired" ? "Expired" : "Valid for 7 days"})
                                </p>
                              </div>
                              <Button className="bg-blue-600 hover:bg-blue-700">
                                {subscriptionStatus === "expired" ? "Renew Plan" : "Upgrade Plan"}
                              </Button>
                            </div>
                            <div className="mt-6 space-y-2">
                              <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Start time:</span>
                                <span>{formatDate(subscription.startTime)}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-slate-400">End time:</span>
                                <span>{formatDate(subscription.endTime)}</span>
                              </div>
                              <div className="flex justify-between text-sm">
                                <span className="text-slate-400">Status:</span>
                                <span>{subscriptionStatus.toUpperCase()}</span>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <p className="text-slate-300">No subscription found</p>
                        )}
                        <div className="mt-6 flex gap-3">
                          <Button
                            variant="outline"
                            className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                            onClick={() => setShowClients(true)}
                          >
                            <Plus className="mr-2 h-4 w-4" />
                            Create Clients
                          </Button>
                          <Button
                            variant="outline"
                            className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                            onClick={() => setShowFileStorage(true)}
                          >
                            <Cloud className="mr-2 h-4 w-4" />
                            File Storage
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="bg-slate-900/60 border-slate-800 text-white">
                      <CardHeader>
                        <CardTitle>Mint</CardTitle>
                        <CardDescription className="text-slate-400">
                          Create and manage your digital assets
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="flex items-center justify-center p-6">
                        <div
                          className="rounded-lg border border-dashed border-blue-500 bg-slate-800/30 p-10 text-center w-full cursor-pointer"
                          onClick={() => (window.location.href = "/mint")}
                        >
                          <div className="flex flex-col items-center justify-center">
                            <Plus className="h-10 w-10 text-blue-500 mb-4" />
                            <p className="text-slate-300">Click to navigate to Mint page</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                )}
                {buttonset && (
                  <>
                    <div
                      style={{ backgroundColor: "#222944E5" }}
                      className="flex overflow-y-auto overflow-x-hidden fixed inset-0 z-50 justify-center items-center w-full max-h-full"
                      id="popupmodal"
                    >
                      <div className="relative p-4 w-full max-w-2xl max-h-full">
                        <div
                          className="relative rounded-3xl shadow dark:bg-gray-700 mx-auto w-full lg:w-3/4"
                          style={{
                            backgroundColor: "#202333",
                            border: "1px solid #0162FF",
                          }}
                        >
                          <div className="flex items-center justify-end p-4 md:p-5 rounded-t dark:border-gray-600">
                            <button
                              onClick={() => {
                                setbuttonset(false)
                              }}
                              type="button"
                              className="text-white bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                            >
                              <svg
                                className="w-3 h-3"
                                aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 14 14"
                              >
                                <path
                                  stroke="currentColor"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="2"
                                  d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                />
                              </svg>
                              <span className="sr-only">Close modal</span>
                            </button>
                          </div>
                          <section>
                            <div className="mx-auto max-w-3xl">
                              <div className="w-full mx-auto text-left px-6 md:px-10 pb-6 md:pb-10">
                                <div className="flex justify-between items-center mb-6">
                                  <h1 className="text-3xl font-bold">Create your client</h1>
                                </div>

                                <form onSubmit={handleSubmit}>
                                  <div className="space-y-6">
                                    {/* Client Name Input */}
                                    <div>
                                      <input
                                        type="text"
                                        id="name"
                                        className="w-full bg-gray-800 border border-gray-700 rounded-full py-3 px-6 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter Client Name (Max 8 characters)"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        maxLength={8}
                                        required
                                      />
                                    </div>

                                    {/* Region Selector */}
                                    <div className="relative">
                                      <select
                                        id="regionname"
                                        className="w-full bg-gray-800 border border-gray-700 rounded-full py-3 px-6 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        value={regionname}
                                        onChange={handleRegionChange}
                                        required
                                      >
                                        <option value="" disabled>
                                          Select Region
                                        </option>
                                        {regiondata.map((node) => (
                                          <option key={node.id} value={node.id}>
                                            {node.region}
                                          </option>
                                        ))}
                                      </select>
                                      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4">
                                        <svg
                                          className="w-5 h-5 text-gray-400"
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M19 9l-7 7-7-7"
                                          />
                                        </svg>
                                      </div>
                                    </div>

                                    {/* Node Selector */}
                                    <div className="relative">
                                      <div
                                        className="w-full bg-gray-800 border border-gray-700 rounded-full py-3 px-6 text-white cursor-pointer flex items-center justify-between"
                                        onClick={handleDropdownToggle}
                                      >
                                        {selectedOption ? (
                                          <div className="flex items-center">
                                            <span className="mr-2">
                                              {generateSerialNumber(regionname, selectedIndex)}-
                                            </span>
                                            <span>{sliceNodeId(selectedOption.id)}</span>
                                          </div>
                                        ) : (
                                          <span className="text-gray-400">Select Node ID</span>
                                        )}
                                        <svg
                                          className={`w-5 h-5 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                                          fill="none"
                                          stroke="currentColor"
                                          viewBox="0 0 24 24"
                                        >
                                          <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth="2"
                                            d="M19 9l-7 7-7-7"
                                          />
                                        </svg>
                                      </div>

                                      {isOpen && (
                                        <div className="absolute w-full mt-2 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10 max-h-60 overflow-y-auto">
                                          <div className="grid grid-cols-4 p-3 font-medium text-gray-300 border-b border-gray-700 sticky top-0 bg-gray-800">
                                            <div>S.No</div>
                                            <div>Node ID</div>
                                            <div>Wallet Address</div>
                                            <div>Chain</div>
                                          </div>

                                          {activeNodesData
                                            .filter((node) => !regionname || node.region === regionname)
                                            .map((option, index) => (
                                              <div
                                                key={option.id}
                                                className="grid grid-cols-4 p-3 hover:bg-gray-700 cursor-pointer border-b border-gray-700 last:border-b-0"
                                                onClick={() => {
                                                  handleOptionClick(option)
                                                  setSelectedIndex(index)
                                                }}
                                              >
                                                <div>{generateSerialNumber(regionname, index)}</div>
                                                <div>{sliceNodeId(option.id)}</div>
                                                <div>{sliceWalletAddress(option.walletAddress)}</div>
                                                <div>{option.chainName}</div>
                                              </div>
                                            ))}
                                        </div>
                                      )}
                                    </div>

                                    {/* Submit Button */}
                                    <div className="mt-8">
                                      <button
                                        type="submit"
                                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-full transition duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
                                      >
                                        Create Client
                                      </button>
                                      {msg && (
                                        <p
                                          className={`mt-3 text-center ${msg.includes("successful") ? "text-green-400" : "text-red-400"}`}
                                        >
                                          {msg}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </form>
                              </div>
                            </div>
                          </section>
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {showQrCodeModal && ConfigFile && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
                    <div className="relative w-full max-w-md mx-4">
                      <div
                        className="relative rounded-xl shadow-lg p-6"
                        style={{
                          backgroundColor: "#202333",
                          border: "1px solid #0162FF",
                        }}
                      >
                        <div className="py-4 space-y-4 mt-4">
                          {/* Add cross icon */}
                          <button
                            onClick={() => {
                              setShowQrCodeModal(false)
                            }}
                            className="absolute top-4 right-4 text-white hover:text-gray-300"
                          >
                            <svg
                              className="w-6 h-6"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>

                          <p className="text-3xl text-center font-semibold text-white mb-10">Download Configuration</p>

                          <div className="flex w-full flex-col items-center justify-center">
                            <div className="bg-white lg:mx-auto lg:my-4 lg:w-1/2 lg:p-0 p-3 justify-center flex h-60 rounded-3xl">
                              <div className="my-auto">
                                <QRCodeSVG value={ConfigFile} size={200} />
                              </div>
                            </div>

                            <div className="text-center text-white text-xs font-light w-2/3 mt-2">
                              Open{" "}
                              <a
                                href="https://www.wireguard.com/"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: "#5696FF" }}
                              >
                                WireGuard
                              </a>
                              &nbsp;app on mobile, scan the QR code <br /> to add a new connection, and instantly
                              connect to Erebrus VPN.
                            </div>

                            <div className="flex gap-4 w-3/4 mt-4">
                              <button
                                className="text-md rounded-lg text-white flex btn bg-blue-gray-700 flex-1"
                                onClick={() => {
                                  const blob = new Blob([ConfigFile], {
                                    type: "text/plain;charSet=utf-8",
                                  })
                                  saveAs(blob, `${VpnName}.conf`)
                                }}
                              >
                                <div
                                  className="flex cursor-pointer p-2 rounded-full gap-2 justify-center w-full hover:opacity-80 mb-5"
                                  style={{
                                    backgroundColor: "#0162FF",
                                  }}
                                >
                                  <div style={{ color: "white" }}>Download</div>
                                </div>
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {showFileStorage && !showClients && (
                  <Card className="bg-slate-900/60 border-slate-800 text-white mt-4 max-w-6xl mx-auto w-full">
                    <CardHeader className="flex flex-row items-center justify-between">
                      <div>
                        <CardTitle>File Storage</CardTitle>
                        <CardDescription className="text-slate-400">
                          Securely store files on the decentralized network
                        </CardDescription>
                      </div>
                      <Button
                        variant="outline"
                        className="border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
                        onClick={() => setShowFileStorage(false)}
                      >
                        Close
                      </Button>
                    </CardHeader>
                    <CardContent>
                      <FileUploadDemo />
                    </CardContent>
                  </Card>
                )}
              </>
            )}
          </main>
        </>
      )}
    </div>
  )
}
