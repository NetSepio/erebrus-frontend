import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import Link from "next/link";

const EREBRUS_GATEWAY_URL = process.env.NEXT_PUBLIC_EREBRUS_BASE_URL;

const NodesData = () => {
  const [nodesdata, setNodesData] = useState([]);
  const [debugInfo, setDebugInfo] = useState({});

  useEffect(() => {
    fetchNodesData();
  }, []);

  const fetchNodesData = async () => {
    try {
      const response = await axios.get(`${EREBRUS_GATEWAY_URL}/api/v1.0/nodes/all`);
      
      console.log("API Response:", response.data);

      if (response.data.status === 200 && Array.isArray(response.data.payload)) {
        const erebrusWallet = Cookies.get('erebrus_wallet');
        const filteredNodes = response.data.payload.filter(node => node.walletAddress === erebrusWallet);
        
        setNodesData(filteredNodes);
        setDebugInfo({
          totalNodes: response.data.payload.length,
          erebrusWallet: erebrusWallet,
          filteredNodes: filteredNodes.length
        });
      } else {
        console.error("Unexpected response format:", response.data);
      }
    } catch (error) {
      console.error("Error fetching nodes data:", error);
      setDebugInfo({ error: error.message });
    }
  };
  const elapsedTimeSince = (timestamp) => {
    const givenTimeMilliseconds = timestamp * 1000;
    const currentTimeMilliseconds = new Date().getTime();
    const timeDifference = currentTimeMilliseconds - givenTimeMilliseconds;
    const timeDifferenceInSeconds = timeDifference / 1000;
    const seconds = Math.floor(timeDifferenceInSeconds % 60);
    const minutes = Math.floor((timeDifferenceInSeconds / 60) % 60);
    const hours = Math.floor((timeDifferenceInSeconds / (60 * 60)) % 24);
    const days = Math.floor(timeDifferenceInSeconds / (60 * 60 * 24));
    let elapsedTimeString = "";
    if (days > 0) {
      elapsedTimeString += `${days} d, `;
    }
    if (hours > 0 || days > 0) {
      elapsedTimeString += `${hours} h, `;
    }
    if (minutes > 0 || hours > 0 || days > 0) {
      elapsedTimeString += `${minutes} m, `;
    }
    elapsedTimeString += `${seconds} s`;
    return elapsedTimeString;
  };

  
  const handleRowClick = (nodeId) => {
    console.log("Node ID clicked:", nodeId);
  };


  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg">
    <h1 className="text-3xl font-bold mb-6">DVPN Nodes Dashboard</h1>
    
    {nodesdata.length > 0 ? (
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
        <thead className="bg-gray-700">
  <tr>
    {["Node Name", "Chain", "Wallet Address", "Region", "Network Speed", "Status", "Uptime", "Last Ping"].map((header) => (
      <th
        key={header}
        className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider"
        style={{ lineHeight: '1.5', height: 'auto', paddingTop: '12px', paddingBottom: '12px' }}
      >
        {header}
      </th>
    ))}
  </tr>
</thead>


          <tbody className="divide-y divide-gray-600">
            {nodesdata.map((node) => (
              <tr
                key={node.id}
                className={`hover:bg-gray-700 transition-colors duration-200 ${
                  node.status === "inactive" ? "text-red-300" : "text-blue-300"
                }`}
                onClick={() => handleRowClick(node.id)}
              >
                <td className="px-6 py-4 whitespace-nowrap">{node.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{node.chainName}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {node.walletAddress.slice(0, 6)}...{node.walletAddress.slice(-4)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{node.region}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-green-400">↓</span> {node.downloadSpeed.toFixed(2)} 
                  <span className="ml-2 text-yellow-400">↑</span> {node.uploadSpeed.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    node.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                  }`}>
                    {node.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {node.status === "inactive" ? "---" : elapsedTimeSince(node.startTimeStamp)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{elapsedTimeSince(node.lastPingedTimeStamp)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    ) : (
       /* eslint-disable */
      <div className="bg-gray-800 rounded-lg p-8 text-center">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h3 className="mt-2 text-sm font-medium text-gray-400">No dVPN Nodes</h3>
     
        <p className="mt-1 text-sm text-gray-500 mb-4">You don't have any dVPN nodes running at the moment.</p>
        <Link href="https://discord.com/invite/5uaFhNpRF6" target="_blank" rel="noopener noreferrer">
        
        Run Your Node
      
    </Link>
      </div>
      
    )}
    
  
    
  </div>
  );
};

export default NodesData;