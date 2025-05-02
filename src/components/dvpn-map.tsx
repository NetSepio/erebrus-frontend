"use client"

import { useEffect, useState, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Globe, Server, Activity } from "lucide-react"

// Define the Node interface
interface Node {
  [x: string]: any
  id: number | string
  name: string
  status: string
  chainName?: string
  region?: string
  ipinfocountry?: string
  ipinfocity?: string
  ipinfolocation?: string
  nodename?: string
  downloadSpeed: string | number
  uploadSpeed: string | number
  startTimeStamp?: number
  lastPingedTimeStamp?: number
  walletAddress?: string
  walletAddressSol?: string
  totalUptime?: number
  upTimeUnit?: string
}

// This component is a wrapper that loads Leaflet only on the client side
const DvpnMap = ({ nodes }: { nodes: Node[] }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const mapInstanceRef = useRef<any>(null)
  const [activeNode, setActiveNode] = useState<Node | null>(null)
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    regions: 0,
  })

  useEffect(() => {
    // Calculate stats
    const activeNodes = nodes.filter((node) => node.status === "active").length
    const uniqueRegions = new Set(nodes.map((node) => node.ipinfocountry || node.region)).size

    setStats({
      total: nodes.length,
      active: activeNodes,
      regions: uniqueRegions,
    })
  }, [nodes])

  useEffect(() => {
    // This ensures we're on the client side
    if (typeof window === "undefined") return

    // Clean up function to handle unmounting
    const cleanupMap = () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }

      // Remove any leaflet artifacts that might be lingering
      document.querySelectorAll('.leaflet-container, [class^="leaflet-"]').forEach((el) => {
        el.remove()
      })
    }

    // Clean up any existing instances first
    cleanupMap()

    // Set a flag to indicate the component is mounted
    setIsLoaded(true)

    // Clean up when the component unmounts
    return () => {
      cleanupMap()
    }
  }, [])

  // Once the component is loaded, initialize the map
  useEffect(() => {
    if (!isLoaded || !mapContainerRef.current || !nodes.length) return

    // Dynamically import Leaflet to ensure it only loads on the client side
    const initMap = async () => {
      try {
        // Import Leaflet and related modules
        const L = (await import("leaflet")).default
        // Import Leaflet CSS dynamically
        await import("leaflet/dist/leaflet.css")

        // Fix Leaflet's icon issue in Next.js
        delete (L.Icon.Default.prototype as any)._getIconUrl
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
          iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
          shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
        })

        // Ensure the container is clean
        if (mapContainerRef.current) {
          mapContainerRef.current.innerHTML = ""
        }

        // Initialize the map with dark mode
        if (!mapContainerRef.current) {
          console.error("Map container is not available.")
          return
        }

        const map = L.map(mapContainerRef.current, {
          center: [20, 0],
          zoom: 2,
          zoomControl: false, // We'll add it in a better position
          attributionControl: false, // We'll add it back with custom styling
        })
        mapInstanceRef.current = map

        // Add zoom control to the top-right
        L.control.zoom({ position: "topright" }).addTo(map)

        // Add attribution with custom styling
        L.control
          .attribution({
            position: "bottomright",
            prefix: '<a href="https://erebrus.io" class="text-blue-400">Erebrus DVPN</a>',
          })
          .addTo(map)

        // Add dark mode tile layer
        L.tileLayer("https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png", {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: "abcd",
          maxZoom: 20,
        }).addTo(map)

        // Create a custom animated icon for active nodes
        const activeNodeIcon = L.divIcon({
          className: "custom-node-icon",
          html: `
            <div class="node-marker active-node">
              <div class="pulse-ring"></div>
              <div class="node-dot"></div>
            </div>
          `,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
          popupAnchor: [0, -15],
        })

        // Create icon for inactive nodes
        const inactiveNodeIcon = L.divIcon({
          className: "custom-node-icon",
          html: `
            <div class="node-marker inactive-node">
              <div class="node-dot"></div>
            </div>
          `,
          iconSize: [20, 20],
          iconAnchor: [10, 10],
          popupAnchor: [0, -10],
        })

        // Helper function to get circular offsets for nodes at the same location
        const getCircularOffset = (index: number, total: number, radius = 0.1): [number, number] => {
          const angle = (index / total) * 2 * Math.PI
          return [Math.cos(angle) * radius, Math.sin(angle) * radius]
        }

        // Calculate offsets for nodes at the same location
        const offsetMap: Record<string, Node[]> = {}
        const finalOffsets: Record<string, [number, number]> = {}

        nodes.forEach((node) => {
          let lat, lon

          if (node.ipinfolocation) {
            ;[lat, lon] = node.ipinfolocation.split(",").map(Number)
          } else if (node.location) {
            lat = node.location.lat
            lon = node.location.lng
          } else {
            return
          }

          const key = `${lat},${lon}`
          if (!offsetMap[key]) {
            offsetMap[key] = []
          }
          offsetMap[key].push(node)
        })

        for (const key in offsetMap) {
          const nodesAtLocation = offsetMap[key]
          nodesAtLocation.forEach((node, index) => {
            finalOffsets[node.id.toString()] = getCircularOffset(index, nodesAtLocation.length)
          })
        }

        // Add markers for each node
        nodes.forEach((node) => {
          let lat, lon

          if (node.ipinfolocation) {
            ;[lat, lon] = node.ipinfolocation.split(",").map(Number)
          } else if (node.location) {
            lat = node.location.lat
            lon = node.location.lng
          } else {
            return
          }

          const [offsetLat, offsetLon] = finalOffsets[node.id.toString()] || [0, 0]
          const isActive = node.status === "active"

          const marker = L.marker([lat + offsetLat, lon + offsetLon], {
            icon: isActive ? activeNodeIcon : inactiveNodeIcon,
          }).addTo(map)

          // Custom popup with dark theme
          const popupContent = `
            <div class="node-popup">
              <div class="node-popup-header ${isActive ? "active" : "inactive"}">
                <h3>${node.nodename || node.name}</h3>
                <span class="status-badge">${isActive ? "Active" : "Inactive"}</span>
              </div>
              <div class="node-popup-content">
                <div class="info-row">
                  <span class="info-label">Country:</span>
                  <span class="info-value">${node.ipinfocountry || node.region || "Unknown"}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">City:</span>
                  <span class="info-value">${node.ipinfocity || "Unknown"}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Chain:</span>
                  <span class="info-value">${node.chainName || "Unknown"}</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Download:</span>
                  <span class="info-value">${
                    typeof node.downloadSpeed === "number"
                      ? `${node.downloadSpeed.toFixed(2)} Mbps`
                      : node.downloadSpeed
                  }</span>
                </div>
                <div class="info-row">
                  <span class="info-label">Upload:</span>
                  <span class="info-value">${
                    typeof node.uploadSpeed === "number" ? `${node.uploadSpeed.toFixed(2)} Mbps` : node.uploadSpeed
                  }</span>
                </div>
              </div>
            </div>
          `

          const popup = L.popup({
            className: "custom-popup",
            closeButton: true,
            autoClose: true,
            closeOnEscapeKey: true,
          }).setContent(popupContent)

          marker.bindPopup(popup)

          // Set active node on click
          marker.on("click", () => {
            setActiveNode(node)
          })
        })

        // Attempt to load GeoJSON data
        // try {
        //   const response = await fetch("/countries.json")
        //   const geojsonData = await response.json()

        //   L.geoJSON(geojsonData, {
        //     style: (feature) => {
        //       if (!feature?.properties) return {}

        //       const country = feature.properties.ISO_A2
        //       const count = nodes.filter((node) => node.ipinfocountry === country).length

        //       return {
        //         fillColor:
        //           count > 3
        //             ? "#4f46e5" // indigo-600
        //             : count > 2
        //               ? "#6366f1" // indigo-500
        //               : count > 1
        //                 ? "#818cf8" // indigo-400
        //                 : count > 0
        //                   ? "#a5b4fc" // indigo-300
        //                   : "#1e293b", // slate-800
        //         weight: 1,
        //         opacity: 0.8,
        //         color: "#334155", // slate-700
        //         dashArray: "3",
        //         fillOpacity: count > 0 ? 0.6 : 0.2,
        //       }
        //     },
        //     onEachFeature: (feature, layer) => {
        //       if (!feature.properties) return

        //       const country = feature.properties.ISO_A2
        //       const count = nodes.filter((node) => node.ipinfocountry === country).length

        //       if (count > 0) {
        //         layer.bindTooltip(`${feature.properties.ADMIN}: ${count} nodes`, {
        //           permanent: false,
        //           direction: "center",
        //           className: "country-tooltip",
        //         })
        //       }
        //     },
        //   }).addTo(map)
        // } catch (error) {
        //   console.error("Failed to load GeoJSON data:", error)
        // }

        // Add custom CSS for styling
        const style = document.createElement("style")
        style.textContent = `
          /* Map container styles */
          .leaflet-container {
            background-color: #0f172a; /* slate-900 */
            color: #e2e8f0; /* slate-200 */
            font-family: ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
          }
          
          /* Custom node markers */
          .node-marker {
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          
          .node-dot {
            width: 10px;
            height: 10px;
            border-radius: 50%;
            background: #4f46e5; /* indigo-600 */
            box-shadow: 0 0 10px rgba(79, 70, 229, 0.8);
            z-index: 2;
          }
          
          .inactive-node .node-dot {
            background: #94a3b8; /* slate-400 */
            box-shadow: 0 0 5px rgba(148, 163, 184, 0.5);
            width: 8px;
            height: 8px;
          }
          
          .pulse-ring {
            position: absolute;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            background: rgba(79, 70, 229, 0.3);
            animation: pulse 2s infinite;
            z-index: 1;
          }
          
          @keyframes pulse {
            0% {
              transform: scale(0.5);
              opacity: 1;
            }
            70% {
              transform: scale(1.2);
              opacity: 0.3;
            }
            100% {
              transform: scale(0.5);
              opacity: 1;
            }
          }
          
          /* Custom popup styles */
          .custom-popup .leaflet-popup-content-wrapper {
            background-color: #1e293b; /* slate-800 */
            color: #e2e8f0; /* slate-200 */
            border-radius: 8px;
            padding: 0;
            overflow: hidden;
            box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5);
            border: 1px solid #334155; /* slate-700 */
          }
          
          .custom-popup .leaflet-popup-tip {
            background-color: #1e293b; /* slate-800 */
            box-shadow: 0 3px 14px rgba(0, 0, 0, 0.4);
          }
          
          .custom-popup .leaflet-popup-close-button {
            color: #94a3b8; /* slate-400 */
            margin-right: 6px;
            margin-top: 6px;
          }
          
          .custom-popup .leaflet-popup-content {
            margin: 0;
            width: 250px !important;
          }
          
          .node-popup {
            font-size: 14px;
          }
          
          .node-popup-header {
            padding: 12px 15px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            border-bottom: 1px solid #334155; /* slate-700 */
          }
          
          .node-popup-header.active {
            background-color: rgba(79, 70, 229, 0.2); /* indigo-600 with opacity */
          }
          
          .node-popup-header.inactive {
            background-color: rgba(148, 163, 184, 0.1); /* slate-400 with opacity */
          }
          
          .node-popup-header h3 {
            margin: 0;
            font-weight: 600;
            font-size: 16px;
            color: #f8fafc; /* slate-50 */
          }
          
          .status-badge {
            font-size: 12px;
            padding: 2px 8px;
            border-radius: 9999px;
            font-weight: 500;
          }
          
          .active .status-badge {
            background-color: rgba(16, 185, 129, 0.2); /* emerald-600 with opacity */
            color: #10b981; /* emerald-500 */
          }
          
          .inactive .status-badge {
            background-color: rgba(239, 68, 68, 0.2); /* red-500 with opacity */
            color: #ef4444; /* red-500 */
          }
          
          .node-popup-content {
            padding: 12px 15px;
          }
          
          .info-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 8px;
          }
          
          .info-row:last-child {
            margin-bottom: 0;
          }
          
          .info-label {
            font-weight: 500;
            color: #94a3b8; /* slate-400 */
          }
          
          .info-value {
            color: #e2e8f0; /* slate-200 */
          }
          
          /* Country tooltip */
          .country-tooltip {
            background-color: #1e293b; /* slate-800 */
            color: #e2e8f0; /* slate-200 */
            border: 1px solid #334155; /* slate-700 */
            border-radius: 4px;
            padding: 6px 10px;
            font-size: 12px;
            font-weight: 500;
            box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
          }
          
          /* Zoom controls */
          .leaflet-control-zoom {
            border: none !important;
            margin-top: 15px !important;
            margin-right: 15px !important;
          }
          
          .leaflet-control-zoom a {
            background-color: #1e293b !important; /* slate-800 */
            color: #e2e8f0 !important; /* slate-200 */
            border: 1px solid #334155 !important; /* slate-700 */
            width: 36px !important;
            height: 36px !important;
            line-height: 36px !important;
            font-size: 18px !important;
          }
          
          .leaflet-control-zoom a:hover {
            background-color: #334155 !important; /* slate-700 */
          }
          
          .leaflet-control-zoom-in {
            border-top-left-radius: 6px !important;
            border-top-right-radius: 6px !important;
          }
          
          .leaflet-control-zoom-out {
            border-bottom-left-radius: 6px !important;
            border-bottom-right-radius: 6px !important;
          }
          
          /* Attribution control */
          .leaflet-control-attribution {
            background-color: rgba(15, 23, 42, 0.7) !important; /* slate-900 with opacity */
            color: #94a3b8 !important; /* slate-400 */
            padding: 4px 8px !important;
            border-radius: 4px 0 0 0 !important;
            font-size: 11px !important;
          }
          
          .leaflet-control-attribution a {
            color: #818cf8 !important; /* indigo-400 */
          }
        `
        document.head.appendChild(style)
      } catch (error) {
        console.error("Error initializing map:", error)
      }
    }

    // Initialize the map
    initMap()

    // Clean up when nodes change
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove()
        mapInstanceRef.current = null
      }
    }
  }, [isLoaded, nodes])

  return (
    <div className="relative h-full w-full bg-slate-900 rounded-xl overflow-hidden border border-slate-800">
      {/* Stats overlay */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 md:flex-row">
        <Card className="bg-slate-900/80 backdrop-blur-md border-slate-700 shadow-xl w-auto">
          <CardContent className="p-4 flex gap-4">
            <div className="flex items-center gap-2">
              <Badge className="bg-indigo-600 text-white h-8 w-8 flex items-center justify-center p-0 rounded-full">
                <Server className="h-4 w-4" />
              </Badge>
              <div>
                <p className="text-xs text-slate-400">Total Nodes</p>
                {nodes.length ? (
                  <p className="text-lg font-semibold text-white">{stats.total}</p>
                ) : (
                  <Skeleton className="h-6 w-8 bg-slate-700" />
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge className="bg-emerald-600 text-white h-8 w-8 flex items-center justify-center p-0 rounded-full">
                <Activity className="h-4 w-4" />
              </Badge>
              <div>
                <p className="text-xs text-slate-400">Active</p>
                {nodes.length ? (
                  <p className="text-lg font-semibold text-white">{stats.active}</p>
                ) : (
                  <Skeleton className="h-6 w-8 bg-slate-700" />
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Badge className="bg-blue-600 text-white h-8 w-8 flex items-center justify-center p-0 rounded-full">
                <Globe className="h-4 w-4" />
              </Badge>
              <div>
                <p className="text-xs text-slate-400">Regions</p>
                {nodes.length ? (
                  <p className="text-lg font-semibold text-white">{stats.regions}</p>
                ) : (
                  <Skeleton className="h-6 w-8 bg-slate-700" />
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Selected node info panel */}
      {activeNode && (
        <div className="absolute bottom-4 right-4 z-10 max-w-sm">
          <Card className="bg-slate-900/80 backdrop-blur-md border-slate-700 shadow-xl">
            <CardHeader className="p-4 pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg text-white">{activeNode.nodename || activeNode.name}</CardTitle>
                <Badge
                  className={`${
                    activeNode.status === "active" ? "bg-emerald-900/50 text-emerald-400" : "bg-red-900/50 text-red-400"
                  }`}
                >
                  {activeNode.status === "active" ? "Active" : "Inactive"}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="p-4 pt-0">
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-slate-400">Location:</div>
                <div className="text-white">
                  {activeNode.ipinfocountry || activeNode.region || "Unknown"}
                  {activeNode.ipinfocity && `, ${activeNode.ipinfocity}`}
                </div>

                <div className="text-slate-400">Chain:</div>
                <div className="text-white">{activeNode.chainName || "Unknown"}</div>

                <div className="text-slate-400">Download:</div>
                <div className="text-white">
                  {typeof activeNode.downloadSpeed === "number"
                    ? `${activeNode.downloadSpeed.toFixed(2)} Mbps`
                    : activeNode.downloadSpeed}
                </div>

                <div className="text-slate-400">Upload:</div>
                <div className="text-white">
                  {typeof activeNode.uploadSpeed === "number"
                    ? `${activeNode.uploadSpeed.toFixed(2)} Mbps`
                    : activeNode.uploadSpeed}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {!isLoaded && (
        <div className="h-full w-full flex items-center justify-center text-white">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            <p>Loading interactive map...</p>
          </div>
        </div>
      )}
      <div
        ref={mapContainerRef}
        className="h-full w-full"
        style={{
          visibility: isLoaded ? "visible" : "hidden",
        }}
      />
    </div>
  )
}

export default DvpnMap
