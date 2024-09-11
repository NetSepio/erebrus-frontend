"use client"
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { motion } from "framer-motion";
import Link from "next/link";
import { ethers } from 'ethers';
import contractABI from '../components/peaqabi/contractABI.json';


const contractAddress = '0x5940445e1e8A419ebea10B45c5d1C0F603926F41';

const NodeDwifiStreamUser = () => {
  const [data, setData] = useState([]);
  const [noData, setNoData] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [editingNode, setEditingNode] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [expandedLocations, setExpandedLocations] = useState({});

  useEffect(() => {
    checkConnection();
  }, []);

  async function checkConnection() {
    if (typeof window.ethereum !== 'undefined') {
      try {
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        setIsConnected(true);
        fetchOperators();
      } catch (error) {
        console.error('Failed to connect:', error);
        setIsConnected(false);
        setError('Failed to connect to MetaMask. Please try again.');
      }
    } else {
      setError('Please install MetaMask to use this feature.');
    }
  }

  async function fetchOperators() {
    setError(null);
    setData([]);
    setIsLoading(true);
    setNoData(false);

    const walletAddress = Cookies.get('erebrus_wallet');
    if (!walletAddress) {
      setError('Wallet address not found in cookies.');
      setIsLoading(false);
      setNoData(true);
      return;
    }

    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();

      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      const operators = [];
      for (let i = 0; i <= 50; i++) {
        try {
          const result = await contract.wifiNodeOperators(i);
          if (result.user.toLowerCase() === walletAddress.toLowerCase()) {
            operators.push({
              id: i,
              user: result.user,
              ssid: result.ssid,
              location: result.location,
              isActive: result.isActive,
              pricePerMinute: ethers.utils.formatUnits(result.pricePerMinute, 'ether'),
              connectedAt: new Date().toISOString(),
              lastChecked: new Date().toISOString()
            });
          }
        } catch (error) {
          console.error(`Error querying index ${i}:`, error);
        }
      }

      if (operators.length > 0) {
        setData(operators);
      } else {
        setNoData(true);
      }
    } catch (error) {
      console.error('Error fetching operators:', error);
      setError('An error occurred while fetching operators. Please try again later.');
      setNoData(true);
    } finally {
      setIsLoading(false);
    }
  }
  const handleEdit = (node) => {
    setEditingNode(node);
  };
  const toggleLocation = (id) => {
    setExpandedLocations(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };


  const handleSave = async (updatedNode) => {
    setError(null);
    setIsSaving(true);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);
  
      // Convert price to wei
      const priceInWei = ethers.utils.parseEther(updatedNode.pricePerMinute);
  
      // Call the smart contract function to update the node
      const tx = await contract.updateWiFiNode(
        updatedNode.id,
        updatedNode.ssid,
        updatedNode.location,
        priceInWei
      );
  
      // Wait for the transaction to be mined
      await tx.wait();
  
      // Update the local state immediately
      setData(prevData => prevData.map(node => 
        node.id === updatedNode.id ? {...node, ...updatedNode} : node
      ));
  
      // Update the editing node state
      setEditingNode({...updatedNode});
  
      // Re-fetch the operators data to get the updated information
      await fetchOperators();
  
      // Close the popup after successful update
      setEditingNode(null);
    } catch (error) {
      console.error('Error updating node:', error);
      if (error.data && error.data.message && error.data.message.includes("Erebrus: Unauthorized")) {
        setError('You are not authorized to update this node. Only the node owner can make changes.');
      } else {
        setError('Failed to update node. Please try again.');
      }
    } finally {
      setIsSaving(false);
    }
  };
  {isSaving && (
  <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
  </div>
)}

  const EditPopup = ({ node, onSave, onCancel }) => {
    const [editedNode, setEditedNode] = useState(node);

    const handleChange = (e) => {
      setEditedNode({ ...editedNode, [e.target.name]: e.target.value });
    };
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
        <div className="bg-gray-800 p-5 rounded-lg shadow-xl">
          <h2 className="text-xl mb-4">Edit Node (ID: {node.id})</h2>
          <input
            name="ssid"
            value={editedNode.ssid}
            onChange={handleChange}
            placeholder="SSID"
            className="mb-2 p-2 w-full bg-gray-700 text-white rounded"
            disabled={isSaving}
          />
          <input
            name="location"
            value={editedNode.location}
            onChange={handleChange}
            placeholder="Location"
            className="mb-2 p-2 w-full bg-gray-700 text-white rounded"
            disabled={isSaving}
          />
          <input
            name="pricePerMinute"
            value={editedNode.pricePerMinute}
            onChange={handleChange}
            placeholder="Price Per Minute"
            className="mb-2 p-2 w-full bg-gray-700 text-white rounded"
            disabled={isSaving}
          />
          <div className="flex justify-end mt-4">
            <button 
              onClick={() => onSave(editedNode)} 
              className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save'}
            </button>
            <button 
              onClick={onCancel} 
              className="bg-gray-500 text-white px-4 py-2 rounded"
              disabled={isSaving}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (noData) {
    return (
      <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6">DWifi Nodes Dashboard</h1>
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <h3 className="mt-2 text-sm font-medium text-gray-400">No dVPN Nodes</h3>
          {/* eslint-disable-next-line */}
          <p className="mt-1 text-sm text-gray-500">You don't have any dVPN nodes running at the moment.</p>
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { duration: 1 } }}
            className="mt-6"
          >
            <Link href="https://discord.com/invite/5uaFhNpRF6" target="_blank" rel="noopener noreferrer">
              Run Your Node
            </Link>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg">
      <h1 className="text-3xl font-bold mb-6">DWifi Nodes Dashboard</h1>
      {!isConnected && (
        <button onClick={checkConnection} className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-500 transition duration-300">
          Connect Wallet
        </button>
      )}
      {isLoading && <p>Loading...</p>}
      {error && <p style={{color: 'red'}}>{error}</p>}
      {!noData && (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
            <thead className="bg-gray-700">
              <tr>
                {["Node ID", "SSID", "User", "Chain", "Status", "Location", "Price Per Minute", "Connected At", "Last Pinged", "Actions"].map((header) => (
                  <th key={header} className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-600">
              {data.map((item) => (
                <tr key={item.id} className="transition-colors duration-200">
                  <td className="px-6 py-4 whitespace-nowrap">{item.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.ssid}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
        {item.user.slice(0, 3)}...{item.user.slice(-3)}
      </td>
                  <td className="px-6 py-4 whitespace-nowrap">peaq</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      item.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                    }`}>
                      {item.isActive ? "Online" : "Offline"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {expandedLocations[item.id] ? (
                      <span>{item.location}</span>
                    ) : (
                      <span>
                        {item.location.length > 20
                          ? `${item.location.slice(0, 20)}...`
                          : item.location}
                      </span>
                    )}
                    {item.location.length > 20 && (
                      <button
                        onClick={() => toggleLocation(item.id)}
                        className="ml-2 text-blue-500 hover:text-blue-600"
                      >
                        {expandedLocations[item.id] ? 'Show less' : 'Show more'}
                      </button>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{item.pricePerMinute} AGNG</td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(item.connectedAt).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{new Date(item.lastChecked).toLocaleString()}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={() => handleEdit(item)}
                      className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition duration-300"
                    >
                      Edit
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {editingNode && (
        <EditPopup
          node={editingNode}
          onSave={handleSave}
          onCancel={() => setEditingNode(null)}
        />
      )}
      {(isLoading || isSaving) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-sm">
          <div className=" bg-transparent rounded-lg p-8 flex flex-col items-center">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
            <p className="mt-4 text-xl font-semibold">
              {isLoading ? "Loading..." : "Saving changes..."}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
export default NodeDwifiStreamUser;