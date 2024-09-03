import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const customIcon = new L.DivIcon({
  html: `<div class="custom-marker">
           <span class="anticon anticon-environment">
             <svg viewBox="64 64 896 896" focusable="false" class="" data-icon="environment" width="2em" height="2em" fill="currentColor" aria-hidden="true">
               <path d="M512 64C324.3 64 176 208.6 176 384c0 237 300.6 526.2 318.7 543.1a31.99 31.99 0 0045.4 0C547.4 910.2 848 621 848 384 848 208.6 699.7 64 512 64zm0 484c-70.7 0-128-57.3-128-128s57.3-128 128-128 128 57.3 128 128-57.3 128-128 128z"></path>
             </svg>
           </span>
         </div>`,
  className: 'ant-icon',
  iconSize: [25, 41], 
  iconAnchor: [12, 25],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  shadowSize: [41, 41],
});

// Create a custom icon for the current location
const currentLocationIcon = new L.DivIcon({
  html: `<div class="current-location-marker"></div>`,
  className: '', 
  iconSize: [20, 20], 
  iconAnchor: [10, 10], 
  popupAnchor: [0, -10], 
});

const style = document.createElement('style');
style.innerHTML = `
  .custom-marker {
    animation: pulse 2s infinite;
    color: #1E3A8A;
  }

  @keyframes pulse {
    0%, 100% {
      transform: scale(0.9);
      color: #1E3A8A;
      filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.5));
    }
    50% {
      transform: scale(1.1);
      color: #3B82F6;
      filter: drop-shadow(0 0 0px rgba(0, 0, 0, 0));
    }
  }

  .current-location-marker {
    background-color: blue;
    border-radius: 50%;
    width: 20px;
    height: 20px;
    position: relative;
    animation: pulseLocation 2s infinite;
  }

  @keyframes pulseLocation {
    0%, 100% {
      box-shadow: 0 0 0 0 rgba(59, 130, 246, 0.5);
    }
    50% {
      box-shadow: 0 0 20px 30px rgba(59, 130, 246, 0);
    }
  }
`;
document.head.appendChild(style);

// Component to handle current location marker
function CurrentLocationMarker() {
  const map = useMap();
  const [position, setPosition] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      console.log('Geolocation is not supported by your browser');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setPosition([latitude, longitude]);
        map.flyTo([latitude, longitude], 13); // Adjust the map's view to the user's location
      },
      (error) => {
        console.error('Error fetching geolocation:', error);
      }
    );
  }, [map]);

  return position === null ? null : (
    <Marker position={position} icon={currentLocationIcon}>
      <Popup ><div className="text-blue-800"><h6 className="text-lg text-blue-600">You are here</h6></div></Popup>
    </Marker>
  );
}

export default function WorldMap({ showCurrentLocation }) {
  const [nodes, setNodes] = useState([]);
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = new WebSocket('wss://dev.gateway.erebrus.io/api/v1.0/nodedwifi/stream');

    socket.onopen = () => console.log('WebSocket is open now.');
    socket.onmessage = (event) => {
      const newNode = JSON.parse(event.data);
      setNodes((prevNodes) => {
        const existingIndex = prevNodes.findIndex((node) => node.id === newNode.id);
        if (existingIndex !== -1) {
          return prevNodes.map((node) => (node.id === newNode.id ? newNode : node));
        } else {
          return [...prevNodes, newNode];
        }
      });
    };

    socket.onerror = (event) => console.error('WebSocket error:', event);
    socket.onclose = () => console.log('WebSocket is closed.');

    return () => socket.close();
  }, []);

  return (
    <div className="relative h-full w-full p-20 px-15 bg-[#20253A]">
      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        style={{ height: '100%', width: '100%', padding: '20px', borderRadius: '20px', border: '2px solid gray', boxShadow: '0 0px 25px black' }}
        maxBounds={[[6, 68], [37, 97]]}
        maxBoundsViscosity={1.0}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {nodes.map((node) => {
          const [lat, lon] = node.co_ordinates.split(',').map(Number);
          return (
            <Marker key={node.id} position={[lat, lon]} icon={customIcon}>
              <Popup>
                <div className="text-blue-800">
                  <h6 className="text-blue-600 text-lg"><strong>Address:</strong> {node.location}</h6>
                  <p><strong>Gateway:</strong> {node.gateway}</p>
                  <p><strong>Price per Minute:</strong> {node.price_per_min}</p>
                  <p><strong>Wallet Address:</strong> <span style={{ wordWrap: 'break-word' }}>{node.wallet_address}</span></p>
                  <p><strong>Chain Name:</strong> {node.chain_name}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
        {showCurrentLocation && <CurrentLocationMarker />}
      </MapContainer>
    </div>
  );
}
