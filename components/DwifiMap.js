import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Custom icon
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  shadowSize: [41, 41],
});

export default function DwifiMap() {
  const [nodes, setNodes] = useState([]);
  const socketRef = useRef(null); // Use ref to maintain WebSocket across renders

  useEffect(() => {
    const socket = new WebSocket('wss://dev.gateway.erebrus.io/api/v1.0/nodedwifi/stream');

    socket.onopen = function () {
      console.log('WebSocket is open now.');
    };

    socket.onmessage = function (event) {
      console.log('Received:', event.data);
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
    <div className="relative h-full w-full p-20 pl-20 pr-20">
      <MapContainer
        center={[20.5937, 78.9629]} 
        zoom={5} 
        style={{ height: '100%', width: '100%', padding: '20px',  }}
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
