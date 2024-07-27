"use client"
import React, { useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const NodeDwifiStreamUser = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    const socket = new WebSocket('wss://dev.gateway.erebrus.io/api/v1.0/nodedwifi/stream');

    socket.onopen = function (event) {
      console.log('WebSocket is open now.');
    };

    socket.onmessage = function (event) {
      const newData = JSON.parse(event.data);

      // Check if the walletAddress is "123"
      const wallet = Cookies.get("erebrus_wallet");
      if (newData.wallet_address === wallet) {

      setData((prevData) => {
        // Update existing data if the ID already exists
        const updatedData = prevData.map((item) => {
          if (item.id === newData.id) {
            return newData;
          }
          return item;
        });

        // If the ID doesn't exist, append the new data
        const existingIndex = prevData.findIndex((item) => item.id === newData.id);
        if (existingIndex === -1) {
          updatedData.push(newData);
        }

        return updatedData;
      });
    }
    };

    socket.onerror = function (event) {
      console.error('WebSocket error:', event);
    };

    socket.onclose = function (event) {
      console.log('WebSocket is closed now.');
    };

    return () => {
      socket.close();
    };
  }, []);

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