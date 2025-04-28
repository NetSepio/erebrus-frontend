import { useEffect } from "react";
import { WorldMap } from "./WorldMap"; // Assuming WorldMap is available in this path

export default function DePINRevolutionComponent() {
  // Sample connection points representing DePIN nodes across the globe
  const connectionPoints = [
    {
      start: { lat: 40.7128, lng: -74.006, label: "New York" }, // New York
      end: { lat: 37.7749, lng: -122.4194, label: "San Francisco" }, // San Francisco
    },
    {
      start: { lat: 51.5074, lng: -0.1278, label: "London" }, // London
      end: { lat: 1.3521, lng: 103.8198, label: "Singapore" }, // Singapore
    },
    {
      start: { lat: 35.6762, lng: 139.6503, label: "Tokyo" }, // Tokyo
      end: { lat: -33.8688, lng: 151.2093, label: "Sydney" }, // Sydney
    },
    {
      start: { lat: 52.52, lng: 13.405, label: "Berlin" }, // Berlin
      end: { lat: 19.076, lng: 72.8777, label: "Mumbai" }, // Mumbai
    },
    {
      start: { lat: -23.5505, lng: -46.6333, label: "São Paulo" }, // São Paulo
      end: { lat: 28.6139, lng: 77.209, label: "New Delhi" }, // New Delhi
    },
  ];

  useEffect(() => {
    // Force dark theme for this component
    document.documentElement.classList.add("dark");

    return () => {
      // Clean up if needed
      // document.documentElement.classList.remove('dark');
    };
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-black text-white overflow-hidden flex items-center justify-center">
      {/* Map as background - taking full width and height */}
      <div className="absolute inset-0 z-0 opacity-80">
        <WorldMap dots={connectionPoints} lineColor="#10b981" />
      </div>

      {/* Content overlay - centered both horizontally and vertically */}
      <div className="relative z-10 w-full max-w-4xl mx-auto px-6">
        <div className="bg-black bg-opacity-70 p-8 rounded-xl backdrop-blur-sm border border-gray-800">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-center bg-gradient-to-r from-emerald-400 to-blue-500 bg-clip-text text-transparent">
            Pioneering the DePIN Revolution
          </h1>

          <div className="space-y-6 text-lg">
            <div className="bg-gray-900 p-6 rounded-lg">
              
              <p>
                Prepare to witness a groundbreaking leap in internet technology
                with the Erebus Protocol, the vanguard in democratizing safe,
                private, and accessible internet through DePIN. By seamlessly
                integrating decentralized VPN (DVPN) and decentralized WIFI
                (DWIFI) within a robust infrastructure, Erebus is set to
                redefine digital connectivity with a focus on privacy and
                sovereignty.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
