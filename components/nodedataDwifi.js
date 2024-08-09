"use client"
import React, { useState, useEffect, useRef } from 'react';

const NodeDwifiStream = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [chainFilter, setChainFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" });
  const [showFilters, setShowFilters] = useState(false);
  const filterRef = useRef(null);
  const [showSortOptions, setShowSortOptions] = useState(false);
  const [sortBy, setSortBy] = useState('');
  const sortRef = useRef(null);
  

  useEffect(() => {
    const socket = new WebSocket('wss://dev.gateway.erebrus.io/api/v1.0/nodedwifi/stream');

    socket.onopen = function (event) {
      console.log('WebSocket is open now.');
    };

    socket.onmessage = function (event) {
      const newData = JSON.parse(event.data);

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

  useEffect(() => {
    filterAndSortData();
  }, [data, statusFilter, chainFilter, sortConfig]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (filterRef.current && !filterRef.current.contains(event.target)) {
        setShowFilters(false);
      }
      if (sortRef.current && !sortRef.current.contains(event.target)) {
        setShowSortOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const filterAndSortData = () => {
    let filtered = data;

    if (statusFilter !== "all") {
      filtered = filtered.filter((item) => {
        const isConnected = item.connected === "false"; // "false" means online, "true" means offline
        return statusFilter === "online" ? isConnected : !isConnected;
      });
    }
    
    if (chainFilter !== "all") {
      filtered = filtered.filter((item) => item.chain_name === chainFilter);
    }

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        let aValue, bValue;
        
        if (sortConfig.key === "hostSSID") {
          aValue = a.status[0]?.hostSSID || "";
          bValue = b.status[0]?.hostSSID || "";
        } else {
          aValue = a[sortConfig.key];
          bValue = b[sortConfig.key];
        }

        if (typeof aValue === 'string') {
          aValue = aValue.toLowerCase();
          bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) return sortConfig.direction === "ascending" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
    }

    setFilteredData(filtered);
  };

  const handleFilterChange = (filterType, value) => {
    switch (filterType) {
      case 'status':
        setStatusFilter(value);
        break;
      case 'chain':
        setChainFilter(value);
        break;
    }
    setShowFilters(false);
  };

  const handleSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
    // setShowSortOptions(false);
    console.log(`Sorting by: ${key}`);
    setSortBy(key);
    setShowSortOptions(false);
  };

  return (
    <div className='text-white px-3'>
      <div className="mb-4 flex justify-end gap-7">
        <div className="relative inline-block" ref={filterRef}>
        <button
    onClick={() => setShowFilters(!showFilters)}
    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-12 rounded"
  >
    {statusFilter !== 'all' || chainFilter !== 'all' ? 'Filters Applied' : 'Filters'}
  </button>
          {showFilters && (
            <div className="absolute right-0 mt-2 w-48 bg-blue-500 rounded-md shadow-lg z-10">
              <div className="py-1">
                <select
                  value={statusFilter}
                  onChange={(e) => handleFilterChange('status', e.target.value)}
                  className="block w-full px-4 py-2 text-white bg-blue-500 hover:bg-gray-700"
                >
                  <option value="all">All Status</option>
                  <option value="online">Online</option>
                  <option value="offline">Offline</option>
                </select>
                <select
                  value={chainFilter}
                  onChange={(e) => handleFilterChange('chain', e.target.value)}
                  className="block w-full px-4 py-2 text-white bg-blue-500 hover:bg-gray-700"
                >
                  <option value="all">All Chains</option>
                  <option value="Apt">APT</option>
                  <option value="Evm">EVM</option>
                  <option value="Sui">SUI</option>
                  <option value="Sol">SOL</option>
                  <option value="Peaq">PEAQ</option>
                </select>
              </div>
            </div>
          )}
        </div>
        <div className="relative inline-block ml-4" ref={sortRef}>
      <button
        onClick={() => setShowSortOptions(!showSortOptions)}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-12 rounded"
      >
        Sort By: {sortBy || 'Select'}
      </button>
      {showSortOptions && (
        <div className="absolute right-0 mt-2 w-48 bg-blue-500 rounded-md shadow-lg z-10">
          <div className="py-1">
            <button
              onClick={() => handleSort('hostSSID')}
              className="block w-full text-left px-4 py-2 text-white hover:bg-gray-700"
            >
              Host SSID
            </button>
            <button
              onClick={() => handleSort('gateway')}
              className="block w-full text-left px-4 py-2 text-white hover:bg-gray-700"
            >
              Gateway
            </button>
            <button
              onClick={() => handleSort('chain_name')}
              className="block w-full text-left px-4 py-2 text-white hover:bg-gray-700"
            >
              Chain
            </button>
            <button
              onClick={() => handleSort('location')}
              className="block w-full text-left px-4 py-2 text-white hover:bg-gray-700"
            >
              Location
            </button>
          </div>
        </div>
      )}
    </div>  
      </div>
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
            {filteredData.map((item) => (
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
                  {item.connected == "true" ? "Online" : "Offline"}
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

export default NodeDwifiStream;