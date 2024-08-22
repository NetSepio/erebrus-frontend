import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Dynamically import components with ssr: false
const MapContainer = dynamic(() => import('react-leaflet').then((module) => module.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then((module) => module.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then((module) => module.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then((module) => module.Popup), { ssr: false });

// Define a custom animated icon
const animatedIcon = L.divIcon({
  className: 'custom-animated-icon',
  html: `
    <div style="
      width: 20px;
      height: 20px;
      background: radial-gradient(circle, blue, white);
      border-radius: 50%;
      animation: pulse 2s infinite;
    "></div>
  `,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  popupAnchor: [0, -10],
});

const DvpnMap = ({ nodes }) => {
  const [isClient, setIsClient] = useState(false);
  const [offsets, setOffsets] = useState({});

  useEffect(() => {
    setIsClient(true);

    // Initialize offsets
    const offsetMap = {};
    nodes.forEach((node) => {
      const [lat, lon] = node.ipinfolocation.split(',').map(Number);
      const key = `${lat},${lon}`;
      if (!offsetMap[key]) {
        offsetMap[key] = [0, 0];
      } else {
        // Apply a small offset if multiple markers have the same coordinates
        offsetMap[key] = [offsetMap[key][0] + 0.01, offsetMap[key][1] + 0.01];
      }
    });
    setOffsets(offsetMap);
  }, [nodes]);

  if (!isClient) {
    return null;
  }

  return (
    <div className="relative h-full w-full p-20 pl-20 pr-20">
      <MapContainer
        center={[20, 0]}
        zoom={2}
        minZoom={2}
        maxZoom={5}
        style={{ height: '100%', width: '100%', padding: '20px',  }}
        // className="leaflet-container"
        // maxBounds={[[-90, -180], [90, 180]]}
        // maxBoundsViscosity={1.0}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
         {/* <TileLayer
          url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" // CartoDB Dark theme URL
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | Map tiles by <a href="https://carto.com/attributions">CartoDB</a>'
          noWrap={true}
        /> */}
         {/* <TileLayer
          url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png"
          attribution='&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>'
          noWrap={true}
        /> */}
        {nodes.map((node, index) => {
          const [lat, lon] = node.ipinfolocation.split(',').map(Number);
          const key = `${lat},${lon}`;
          const offset = offsets[key] || [0, 0];
          return (
            <Marker
              key={index}
              position={[lat + offset[0], lon + offset[1]]}
              icon={animatedIcon}
            >
              <Popup>
                <div className="text-blue-800">
                  <h3 className="text-blue-900 text-lg font-semibold">{node.name}</h3>
                  <p><strong>Country:</strong> {node.ipinfocountry}</p>
                  <p><strong>City:</strong> {node.ipinfocity}</p>
                  <p><strong>Node Name:</strong> {node.nodename}</p>
                  <p><strong>Download Speed:</strong> {node.downloadSpeed} Mbps</p>
                  <p><strong>Upload Speed:</strong> {node.uploadSpeed} Mbps</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      <style jsx>{`
        @keyframes pulse {
          0% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(1);
          }
        }

      `}</style>
    </div>
  );
};

export default DvpnMap;
