import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Custom icon
const customIcon = new L.DivIcon({
  html: `<div class="custom-marker">
           <span class="anticon anticon-environment">
             <svg viewBox="64 64 896 896" focusable="false" class="" data-icon="environment" width="2em" height="2em" fill="currentColor" aria-hidden="true">
               <path d="M512 64C324.3 64 176 208.6 176 384c0 237 300.6 526.2 318.7 543.1a31.99 31.99 0 0045.4 0C547.4 910.2 848 621 848 384 848 208.6 699.7 64 512 64zm0 484c-70.7 0-128-57.3-128-128s57.3-128 128-128 128 57.3 128 128-57.3 128-128 128z"></path>
             </svg>
           </span>
         </div>`,
  className: 'ant-icon',
  iconSize: [25, 41], // Twice the original size
  iconAnchor: [12, 25], // Adjust anchor to be at the bottom center of the icon
  popupAnchor: [1, -34], // Adjust popup position
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  shadowSize: [41, 41],
});


// Add this CSS to handle the animation
const style = document.createElement('style');
style.innerHTML = `
  .custom-marker {
    animation: pulse 2s infinite;
    color: #1E3A8A; /* Dark blue */
  }

  @keyframes pulse {
    0%, 100% {
      transform: scale(0.9);
      color: #1E3A8A; /* Dark blue */
      filter: drop-shadow(0 0 10px rgba(0, 0, 0, 0.5));
    }
    50% {
      transform: scale(1.1);
      color: #3B82F6; /* Normal blue */
      filter: drop-shadow(0 0 0px rgba(0, 0, 0, 0));
    }
  }
`;
document.head.appendChild(style);

export default function DwifiMap() {
  const [nodes, setNodes] = useState([]);
  const socketRef = useRef(null); // Use ref to maintain WebSocket across renders

  useEffect(() => {
    const socket = new WebSocket('wss://dev.gateway.erebrus.io/api/v1.0/nodedwifi/stream');

    socket.onopen = function () {
      console.log('WebSocket is open now.');
    };

    socket.onmessage = function (event) {
      console.log('Received:');
    };

    socket.onerror = function (event) {
      console.error('WebSocket error:', event);
    };

    socket.onclose = function (event) {
      console.log('WebSocket is closed now.', event);
    };

    return () => {
      socket.close();
    };
  }, []);

  useEffect(() => {
    function connectWebSocket() {
      // Initialize the WebSocket connection
      socketRef.current = new WebSocket('wss://dev.gateway.erebrus.io/api/v1.0/nodedwifi/stream');

      // Handle the WebSocket connection opening
      socketRef.current.onopen = function () {
        console.log('WebSocket is open now.');
      };

      // Handle incoming WebSocket messages
      socketRef.current.onmessage = function (event) {
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

      // Handle WebSocket errors
      socketRef.current.onerror = function (event) {
        console.error('WebSocket error:', event);
      };

      // Handle WebSocket closure
      socketRef.current.onclose = function () {
        console.log('WebSocket is closed. Attempting to reconnect...');
        setTimeout(connectWebSocket, 5000); // Attempt to reconnect after 5 seconds
      };
    }

    // Establish WebSocket connection
    connectWebSocket();

    // Cleanup function
    return () => {
      console.log('Cleaning up WebSocket connection...');
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, []); // Empty dependency array ensures this runs once

  return (
    <div className="relative h-full w-full p-20 px-15 bg-[#20253A]">
      <MapContainer
        center={[20.5937, 78.9629]} 
        zoom={5} 
        style={{ height: '100%', width: '100%', padding: '20px', borderRadius: '20px', border: '2px solid gray',   boxShadow: '0 0px 25px black'  }}
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
                  <h6 className="text-blue-600 text-lg "><strong>Address:</strong> {node.location}</h6>
                  <p><strong>Gateway:</strong> {node.gateway}</p>
                  <p><strong>Price per Minute:</strong> {node.price_per_min}</p>
                  <p><strong>Wallet Address:</strong> <span style={{ wordWrap: 'break-word' }}>{node.wallet_address}</span></p>
                  <p><strong>Chain Name:</strong> {node.chain_name}</p>
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
