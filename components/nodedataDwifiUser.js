"use client"
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import Link from "next/link";
import { motion } from "framer-motion";

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

  const handleRunNode = () => {
    // Implement the logic to run a node
    console.log("Running a new node...");
  };

  if (noData) {
    return (
      <div className="text-white px-3 flex flex-col items-center justify-center h-[10vh]">
        <p className="mb-4 text-2xl">You do not have any running nodes.</p>
        <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1, transition: { duration: 1 } }}
            className="text-black font-bold py-3 px-10 rounded-full bg-white text-lg" 
            // style={{backgroundImage: 'linear-gradient(#FFFFFF00, #0099FF)'}}
          >
            <Link href="https://discord.com/invite/5uaFhNpRF6" target="_blank"
              rel="noopener noreferrer">
              Run Your Node
            </Link>
          </motion.div>
      </div>
    );
  }
  return (
    <div className='text-white px-3'>


<div className="overflow-x-auto">
            <table className="min-w-full bg-black rounded-lg">
            <thead style={{ height: "10px" }}>
              <tr>
              <th style={{ border: "solid 1px #FFFFFF66" }}>
                  <div className="flex gap-4 justify-center items-center pt-4 pb-4 px-4">
                    <img src="/nodetable9.png" className="w-10 h-10" />
                    <div>Host SSID</div>
                  </div>
                </th>
                <th style={{ border: "solid 1px #FFFFFF66" }}>
                  <div className="flex gap-4 justify-center items-center pt-4 pb-4 px-4">
                    <img src="/nodetable4.png" className="w-12 h-12" />
                    <div>Gateway</div>
                  </div>
                </th>
                <th style={{ border: "solid 1px #FFFFFF66" }}>
                  <div className="flex gap-4 justify-center items-center pt-4 pb-4 px-4">
                    <img src="/nodetable4.png" className="w-12 h-12" />
                    <div>Chain</div>
                  </div>
                </th>
                <th style={{ border: "solid 1px #FFFFFF66" }}>
                  <div className="flex gap-4 justify-center items-center pt-4 pb-4 px-4">
                    <img src="/nodetable7.png" className="w-10 h-10" />
                    <div>Interface</div>
                  </div>
                </th>
                <th style={{ border: "solid 1px #FFFFFF66" }}>
                  <div className="flex gap-4 justify-center items-center pt-4 pb-4 px-4">
                    <img src="/nodetable7.png" className="w-10 h-10" />
                    <div>Connected Devices</div>
                  </div>
                </th>
                <th style={{ border: "solid 1px #FFFFFF66" }}>
                  <div className="flex gap-4 justify-center items-center pt-4 pb-4 px-4">
                    <img src="/nodetable7.png" className="w-10 h-10" />
                    <div>Status</div>
                  </div>
                </th>
                <th style={{ border: "solid 1px #FFFFFF66" }}>
                  <div className="flex gap-4 justify-center items-center pt-4 pb-4 px-4">
                    <img src="/nodetable7.png" className="w-10 h-10" />
                    <div>Location</div>
                  </div>
                </th>
                <th style={{ border: "solid 1px #FFFFFF66" }}>
                  <div className="flex gap-4 justify-center items-center pt-4 pb-4 px-4">
                    <img src="/nodetable9.png" className="w-10 h-10" />
                    <div>Connected At</div>
                  </div>
                </th>
                <th style={{ border: "solid 1px #FFFFFF66" }}>
                  <div className="flex gap-4 justify-center items-center pt-4 pb-4 px-4">
                    <img src="/nodetable9.png" className="w-10 h-10" />
                    <div>Last Pinged</div>
                  </div>
                </th>
              </tr>
            </thead>
              <tbody>
              {data.map((item) => (
            item.status.map((device, index) => (
              <tr key={`${item.id}-${index}`}>
                {index === 0 && (
                  <>
                    {/* <td rowSpan={item.status.length}>{item.id}</td> */}
                    <td rowSpan={item.status.length}
                    style={{ border: "solid 1px #FFFFFF66" }}>
                    <div className="flex gap-4 justify-center items-center py-2 px-4">
                       {item.status[0].hostSSID}
                      </div>
                      </td>
                    <td rowSpan={item.status.length}
                    style={{ border: "solid 1px #FFFFFF66" }}>
                    <div className="flex gap-4 justify-center items-center py-2 px-4">
                       {item.gateway}
                      </div>
                      </td>
                      <td rowSpan={item.status.length}
                    style={{ border: "solid 1px #FFFFFF66" }}>
                    <div className="flex gap-4 justify-center items-center py-2 px-4">
                       {item.chain_name}
                      </div>
                      </td>
                      <td style={{ border: "solid 1px #FFFFFF66" }}>
                <div className="flex gap-4 justify-center items-center py-2 px-4">
                  {item.status[0].interfaceName}
                  </div>
                  </td>

                  <td style={{ border: "solid 1px #FFFFFF66" }}>
                <div className="flex gap-4 justify-center items-center py-2 px-4">
                  {item.status.length}
                  </div>
                  </td>
                  
                  <td style={{ border: "solid 1px #FFFFFF66" }}>
                <div className="flex gap-4 justify-center items-center py-2 px-4">
                  {item.connected == "true" ? "Offline" : "Online"}
                  </div>
                  </td>

                  <td style={{ border: "solid 1px #FFFFFF66" }}>
                <div className="flex gap-4 justify-center items-center py-2 px-4">
                  {item.location}
                  </div>
                  </td>
                 
                <td style={{ border: "solid 1px #FFFFFF66" }}>
                <div className="flex gap-4 justify-center items-center py-2 px-4">
                  {new Date(item.status[0].connectedAt).toLocaleString()}
                  </div></td>
                <td style={{ border: "solid 1px #FFFFFF66" }}>
                <div className="flex gap-4 justify-center items-center py-2 px-4">
                  {new Date(item.status[0].lastChecked).toLocaleString()}
                  </div>
                </td>
                </>
                )}
              </tr>
            ))
          ))}
            </tbody>
            </table>
          </div>
    </div>
  );
};

export default NodeDwifiStreamUser;