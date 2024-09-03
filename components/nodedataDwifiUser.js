"use client"
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { motion } from "framer-motion";
import Link from "next/link";

const NodeDwifiStreamUser = () => {
  const [data, setData] = useState([]);
  const [noData, setNoData] = useState(false);


  useEffect(() => {
    const socket = new WebSocket('wss://dev.gateway.erebrus.io/api/v1.0/nodedwifi/stream');
    const wallet = Cookies.get("erebrus_wallet");

    socket.onopen = function (event) {
      console.log('WebSocket is open now.');
    };

    socket.onmessage = function (event) {
      const newData = JSON.parse(event.data);

      if (newData.wallet_address === wallet) {
        setData((prevData) => {
          const updatedData = prevData.map((item) => {
            if (item.id === newData.id) {
              return newData;
            }
            return item;
          });

          const existingIndex = prevData.findIndex((item) => item.id === newData.id);
          if (existingIndex === -1) {
            updatedData.push(newData);
          }

          return updatedData;
        });
        setNoData(false);
      }
    };

    socket.onerror = function (event) {
      console.error('WebSocket error:', event);
    };

    socket.onclose = function (event) {
      console.log('WebSocket is closed now.');
    };

    // Set a timeout to check if any data has been received
    const timeoutId = setTimeout(() => {
      if (data.length === 0) {
        setNoData(true);
      }
    }, 2); // Wait for 5 seconds

    return () => {
      socket.close();
      clearTimeout(timeoutId);
    };
  }, []);

  const uniqueNodesData = data.reduce((acc, item) => {
    if (!acc[item.id]) {
      acc[item.id] = {...item, status: [item.status[0]]};
    }
    return acc;
  }, {});

  if (noData) {
    return (
      /* eslint-disable */
      <div className="bg-gray-900 text-white p-6 rounded-lg shadow-lg">
        <div className="flex justify-between pb-3 items-center">
          <h2 className="text-xl text-white font-semibold">
            Scan To Explore The ÐWi-Fi Nodes Around You
          </h2>
          <button
            className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-500 transition duration-300"
          ><Link href='/scan' >Scan</Link>
          </button>
        </div>
        <h1 className="text-3xl font-bold mb-6">DWifi Nodes Dashboard</h1>
        <div className="bg-gray-800 rounded-lg p-8 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-400">No dVPN Nodes</h3>
        
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
      <div className="flex justify-between pb-3 items-center">
        <h2 className="text-xl text-white font-semibold">
          Scan To Explore The ÐWi-Fi Nodes Around You
        </h2>
        <button
          className="bg-blue-600 text-white font-semibold py-2 px-6 rounded-lg hover:bg-blue-500 transition duration-300"
        >
          <Link  href='/scan' >Scan</Link>
        </button>
      </div>
      <h1 className="text-3xl font-bold mb-6">DWifi Nodes Dashboard</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full bg-gray-800 rounded-lg overflow-hidden">
          <thead className="bg-gray-700">
            <tr className="flex justify-between space-x-2">
              {["Host SSID", "Gateway", "Chain", "Interface", "Connected Devices", "Status", "Location", "Connected At", "Last Pinged"].map((header) => (
                <th key={header} className="flex-1 px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-600">
            {Object.values(uniqueNodesData).map((item) => (
              <tr
                key={item.id}
                className={`flex justify-between space-x-2 transition-colors duration-200 ${
                  item.connected === "true" ? "text-red-300" : "text-blue-300"
                }`}
              >
                <td className="flex-1 px-6 py-4 whitespace-nowrap">{item.status[0].hostSSID}</td>
                <td className="flex-1 px-6 py-4 whitespace-nowrap">{item.gateway}</td>
                <td className="flex-1 px-6 py-4 whitespace-nowrap">{item.chain_name}</td>
                <td className="flex-1 px-6 py-4 whitespace-nowrap">{item.status[0].interfaceName}</td>
                <td className="flex-1 px-6 py-4 whitespace-nowrap">{item.status.length}</td>
                <td className="flex-1 px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    item.connected === "true" ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                  }`}>
                    {item.connected === "true" ? "Offline" : "Online"}
                  </span>
                </td>
                <td className="flex-1 px-6 py-4 whitespace-nowrap">{item.location}</td>
                <td className="flex-1 px-6 py-4 whitespace-nowrap">{new Date(item.status[0].connectedAt).toLocaleString()}</td>
                <td className="flex-1 px-6 py-4 whitespace-nowrap">{new Date(item.status[0].lastChecked).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default NodeDwifiStreamUser;