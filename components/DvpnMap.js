import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import geojsonData from '../utils/countries.json';

const MapContainer = dynamic(() => import('react-leaflet').then((module) => module.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then((module) => module.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then((module) => module.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then((module) => module.Popup), { ssr: false });
const GeoJSON = dynamic(() => import('react-leaflet').then((module) => module.GeoJSON), { ssr: false });

const animatedIcon = L.divIcon({
  className: 'custom-animated-icon',
  html: `
    <div style="
      width: 20px;
      height: 20px;
      background: radial-gradient(circle, #007bff, white);
      border-radius: 50%;
      border: 2px solid white;
      animation: pulse 1.5s infinite;
    "></div>
  `,
  iconSize: [20, 20],
  iconAnchor: [10, 10],
  popupAnchor: [0, -10],
});

const getCircularOffset = (index, total, radius = 0.05) => {
  const angle = (index / total) * 2 * Math.PI;
  return [Math.cos(angle) * radius, Math.sin(angle) * radius];
};

const DvpnMap = ({ nodes }) => {
  const [isClient, setIsClient] = useState(false);
  const [offsets, setOffsets] = useState({});

  useEffect(() => {
    setIsClient(true);

    const offsetMap = {};
    nodes.forEach((node) => {
      const [lat, lon] = node.ipinfolocation.split(',').map(Number);
      const key = `${lat},${lon}`;

      if (!offsetMap[key]) {
        offsetMap[key] = [];
      }
      offsetMap[key].push(node);
    });

    const finalOffsets = {};
    for (const key in offsetMap) {
      const nodesAtLocation = offsetMap[key];
      nodesAtLocation.forEach((node, index) => {
        finalOffsets[node.id] = getCircularOffset(index, nodesAtLocation.length);
      });
    }

    setOffsets(finalOffsets);
  }, [nodes]);

  if (!isClient) {
    return null;
  }

  const getCountryStyle = (feature) => {
    const country = feature.properties.ISO_A2;
    const count = nodes.filter(node => node.ipinfocountry === country).length;

    return {
      fillColor: count > 3 ? '#0e038c' :
        count > 2 ? '#1500ff' :
          count > 1 ? '#007bff' :
            count > 0 ? '#7fd0f5' :
              '#f7f7f7',
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
    };
  };

  const onEachCountry = (feature, layer) => {
    const country = feature.properties.ISO_A2;
    const count = nodes.filter(node => node.ipinfocountry === country).length;

    if (count > 0) {
      layer.bindTooltip(`${feature.properties.ADMIN}: ${count} nodes`, {
        permanent: true,
        direction: 'center',
        className: 'country-tooltip',
      });
    }
  };

  return (
    <div className="relative h-full w-full p-20 px-15 bg-[#20253A] mb-5">

      <MapContainer
        center={[20, 0]}
        zoom={2}
        minZoom={2}
        maxZoom={10}
        style={{ height: '100%', width: '100%', padding: '20px', borderRadius: '20px', border: '2px solid gray', boxShadow: '0 0px 25px black' }}
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

        <GeoJSON
          data={geojsonData}
          style={getCountryStyle}
          onEachFeature={onEachCountry}
        />

        {nodes.map((node, index) => {
          const [lat, lon] = node.ipinfolocation.split(',').map(Number);
          const [offsetLat, offsetLon] = offsets[node.id] || [0, 0];
          return (
            <Marker key={index} position={[lat + offsetLat, lon + offsetLon]} icon={animatedIcon}>
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
            transform: scale(0.5);
          }
          50% {
            transform: scale(1.2);
          }
          100% {
            transform: scale(0.5);
          }
        }

        .popup-content {
          font-family: Arial, sans-serif;
          font-size: 14px;
          line-height: 1.6;
          color: #333;
          background-color: #f9f9f9;
          border-radius: 8px;
          padding: 10px;
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        }

        .popup-title {
          margin-top: 0;
          font-size: 16px;
          font-weight: bold;
          color: #FF5F6D;
        }

        .popup-content p {
          margin: 5px 0;
        }

        .popup-content strong {
          color: #333;
        }

        .country-tooltip {
          font-size: 12px;
          background-color: #ffffff;
          border: 1px solid #dddddd;
          border-radius: 4px;
          padding: 4px;
        }
      `}</style>
    </div>
  );
};

export default DvpnMap;
