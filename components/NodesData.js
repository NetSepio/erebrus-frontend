import React, { useEffect, useState, useRef } from "react"; 
import axios from "axios";
import { FilterOutlined, SortAscendingOutlined } from '@ant-design/icons';
import Cookies from "js-cookie";

const EREBRUS_GATEWAY_URL = process.env.NEXT_PUBLIC_EREBRUS_BASE_URL;

const NodesData = () => {
  const [nodesdata, setNodesData] = useState([]);
  const [filteredNodesData, setFilteredNodesData] = useState([]);
  const [activeNodesData, setActiveNodesData] = useState([]);
  const [uniqueRegionsCount, setUniqueRegionsCount] = useState(0);
  const [statusFilter, setStatusFilter] = useState("all");
  const [regionFilter, setRegionFilter] = useState("all");
  const [chainFilter, setChainFilter] = useState("all");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [showFilters, setShowFilters] = useState(false);
  const filterRef = useRef(null);
  const [sortBy, setSortBy] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [sortByDisplay, setSortByDisplay] = useState("");
 
  

  useEffect(() => {
    fetchNodesData();
  }, []);

  useEffect((value) => {
    if(isOpen){
      handleSort(value)
    }
    filterAndSortNodes();
  }, [nodesdata, statusFilter, regionFilter, chainFilter, sortConfig, showFilters]);



  const handleFilterChange = (filterType, value) => {
    switch (filterType) {
      case 'status':
        setStatusFilter(value);
        break;
      case 'region':
        setRegionFilter(value);
        break;
      case 'chain':
        setChainFilter(value);
        break;
    }
    setShowFilters(false);
  };

  const sortOptions = {
    name: "Name",
    status: "Status",
    region: "Region",
    networkSpeed: "Network Speed"
  };

  const handleSort = (key) => {
    console.log("in handle sort ")
    setSortConfig((prevConfig) => {
      console.log("in handle sort config ", prevConfig, sortConfig)
      const direction = prevConfig.key === key && prevConfig.direction === "ascending"
        ? "descending"
        : "ascending";
      
      return { key, direction };
    });
  };
  
  const handleSortChange = (value) => {
    console.log("in handle sort change ");
    
    if (value) {
      handleSort(value);
      console.log("in handle sort change done ");
      setSortBy(value);
      setSortByDisplay(sortOptions[value]);
      setTimeout(() => {
        setIsOpen(false);
      }, 100);
    }
  };
  
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target) &&
        !event.target.closest('.dropdown-menu')
      ) {
        setShowFilters(false);
        setIsOpen(false);
      }
    };
  
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [filterRef, isOpen]);


  const fetchNodesData = async () => {
    try {
      const response = await axios.get(
        `${EREBRUS_GATEWAY_URL}/api/v1.0/nodes/all`,
        {
          headers: {
            Accept: "application/json, text/plain, /",
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200 && response.data) {
        const payload = response.data.payload;
        setNodesData(payload);
        const filteredNodes = payload.filter((node) => node.status === "active");
        setActiveNodesData(filteredNodes);
        const uniqueRegions = new Set(payload.map((node) => node.region));
        setUniqueRegionsCount(uniqueRegions.size);
      }
    } catch (error) {
      console.error("Error fetching nodes data:", error);
      setNodesData([]);
      setActiveNodesData([]);
      setUniqueRegionsCount(0);
    }
  };
  const toggleDropdown = () => {
    setIsOpen((prevState) => !prevState);
    
  };

  const filterAndSortNodes = () => {
    let filtered = nodesdata;

    if (statusFilter !== "all") {
      filtered = filtered.filter((node) => node.status === statusFilter);
    }
    if (regionFilter !== "all") {
      filtered = filtered.filter((node) => node.region === regionFilter);
    }
    if (chainFilter !== "all") {
      filtered = filtered.filter((node) => node.chainName === chainFilter);
    }

    if (sortConfig.key) {
      filtered.sort((a, b) => {
        if (sortConfig.key === "networkSpeed") {
          const aSpeed = parseFloat(a.downloadSpeed) + parseFloat(a.uploadSpeed);
          const bSpeed = parseFloat(b.downloadSpeed) + parseFloat(b.uploadSpeed);
          return sortConfig.direction === "desending" ? aSpeed - bSpeed : bSpeed - aSpeed;
        }
        if (sortConfig.key === "uptime") {
          return sortConfig.direction === "ascending"
            ? a.startTimeStamp - b.startTimeStamp
            : b.startTimeStamp - a.startTimeStamp;
        }
        if (sortConfig.key === "lastPing") {
          return sortConfig.direction === "ascending"
            ? a.lastPingedTimeStamp - b.lastPingedTimeStamp
            : b.lastPingedTimeStamp - a.lastPingedTimeStamp;
        }
        if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "ascending" ? -1 : 1;
        if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "ascending" ? 1 : -1;
        return 0;
      });
    }

    setFilteredNodesData(filtered);
  };

  // const handleSort = (key) => {
  //   let direction = "ascending";
  //   if (sortConfig.key === key && sortConfig.direction === "ascending") {
  //     direction = "descending";
  //   }
  //   setSortConfig({ key, direction });
  // };

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

  const handleRowClick = (id) => {
    window.location.href = `/nodeinfo/${id}`;
  };

  return (
    <div
      id="howto"
      className="flex flex-col items-center justify-start scroll-mt-16 lg:scroll-mt-0 min-h-screen"
      style={{ backgroundColor: "#20253A" }}
    >
      <div className="font-figtree text-left text-gray-200 w-full px-3">
        <div className="text-white">
          <div className="flex uppercase">
            <div
              className="flex gap-4 w-1/3 justify-center items-center p-6 mb-10"
              style={{ border: "solid 1px #FFFFFF66" }}
            >
              <img src="/nodetable1.png" className="w-20 h-20" />
              <div>
                <div>No. of Nodes</div>
                <div className="text-3xl">{nodesdata.length}</div>
              </div>
            </div>
            <div
              className="flex gap-4 w-1/3 justify-center items-center p-6  mb-10"
              style={{ border: "solid 1px #FFFFFF66" }}
            >
              <img src="/nodetable2.png" className="w-14 h-14" />
              <div>
                <div>No. of Regions</div>
                <div className="text-3xl">{uniqueRegionsCount}</div>
              </div>
            </div>
            <div
              className="flex gap-4 w-1/3 justify-center items-center p-6  mb-10"
              style={{ border: "solid 1px #FFFFFF66" }}
            >
              <img src="/nodetable3.png" className="w-20 h-12" />
              <div>
                <div>Active Nodes</div>
                <div className="text-3xl">{activeNodesData.length}</div>
              </div>
            </div>
          </div>

          <div className="mb-4 flex justify-end gap-10">
          <div className="relative inline-block" ref={filterRef}>
  <button
    onClick={() => setShowFilters(!showFilters)}
    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-12 rounded"
  >
    <FilterOutlined /> {statusFilter !== 'all' || regionFilter !== 'all' || chainFilter !== 'all' ? 'Filters Applied' : 'Filter'}
  </button>
  {showFilters && (
    <div className="absolute right-0 mt-2 w-48 bg-blue-500 rounded-md shadow-lg z-10">
      <div className="py-1">
        <select
          value={statusFilter}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          className="block w-full px-4 py-2 text-white bg-blue-500 hover:bg-blue-400"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
        <select
          value={regionFilter}
          onChange={(e) => handleFilterChange('region', e.target.value)}
          className="block w-full px-4 py-2 text-white bg-blue-500 hover:bg-blue-400"
        >
          <option value="all">All Regions</option>
          <option value="CA">CA</option>
          <option value="JP">JP</option>
          <option value="SG">SG</option>
          <option value="IN">IN</option>
          <option value="GB">GB</option>
          <option value="AU">AU</option>
          <option value="US">US</option>
        </select>
        <select
          value={chainFilter}
          onChange={(e) => handleFilterChange('chain', e.target.value)}
          className="block w-full px-4 py-2 text-white bg-blue-500 hover:bg-blue-400"
        >
          <option value="all">All Chains</option>
          <option value="APT">APT</option>
          <option value="EVM">EVM</option>
          <option value="SUI">SUI</option>
          <option value="SOL">SOL</option>
          <option value="PEAQ">PEAQ</option>
        </select>
      </div>
    </div>
  )}
</div>

 


<div className="relative inline-block text-left min-w-[30vh] ">
      <button
        onClick={toggleDropdown}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-12 rounded inline-flex items-center"
        >
       <SortAscendingOutlined />  { sortByDisplay || ' Sort'} <svg className={`-mr-1 ml-2 h-5 w-5 transform transition-transform ${ isOpen ? 'rotate-180' : 'rotate-0' }`}  xmlns="http://www.w3.org/2000/svg"  viewBox="0 0 20 20"  fill="currentColor"  aria-hidden="true">
          <path
            fillRule="evenodd"
            d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.25 4.25a.75.75 0 01-1.06 0l-4.25-4.25a.75.75 0 01.02-1.06z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {isOpen && (
        <div
        className="origin-top-right absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-blue-500 ring-1 ring-black ring-opacity-5 dropdown-menu"
        role="menu"
        aria-orientation="vertical"
        aria-labelledby="options-menu"
      > <div className="py-1 " role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
            <button
              className="block px-4 py-2 text-md text-white hover:bg-blue-400 w-full text-left"
              onClick={() => handleSortChange('name') }
            >
              Name
            </button>
            <button
              className="block px-4 py-2 text-md text-white hover:bg-blue-400 w-full text-left"
              onClick={() => handleSortChange('status')}
            >
              Status
            </button>
            <button
              className="block px-4 py-2 text-md text-white hover:bg-blue-400 w-full text-left"
              onClick={() => handleSortChange('region')}
            >
              Region
            </button>
            <button
              className="block px-4 py-2 text-md text-white hover:bg-blue-400 w-full text-left"
              onClick={() => handleSortChange('networkSpeed')}
            >
              Network Speed
            </button>
          </div>
        </div>
      )}
    </div>
      </div>
        

          <div className="overflow-x-auto">
            <table className="min-w-full bg-[#20253A] rounded-lg">
            <thead style={{ height: "10px" }}>
              <tr>
                <th style={{ border: "solid 1px #FFFFFF66" }}>
                  <div className="flex gap-4 justify-center items-center pt-4 pb-4 px-4">
                    <img src="/nodetable4.png" className="w-12 h-12" />
                    <div>NODE NAME</div>
                  </div>
                </th>
                <th style={{ border: "solid 1px #FFFFFF66" }}>
                  <div className="flex gap-4 justify-center items-center pt-4 pb-4 px-4">
                    <img src="/nodetable5.png" className="w-10 h-10" />
                    <div>CHAIN</div>
                  </div>
                </th>
                <th style={{ border: "solid 1px #FFFFFF66" }}>
                  <div className="flex gap-4 justify-center items-center pt-4 pb-4 px-4">
                    <img src="/nodetable5.png" className="w-10 h-10" />
                    <div>WALLET ADDRESS</div>
                  </div>
                </th>
                <th style={{ border: "solid 1px #FFFFFF66" }}>
                  <div className="flex gap-4 justify-center items-center pt-4 pb-4 px-4">
                    <img src="/nodetable6.png" className="w-10 h-10" />
                    <div>REGION</div>
                  </div>
                </th>
                <th style={{ border: "solid 1px #FFFFFF66" }}>
                  <div className="flex gap-4 justify-center items-center pt-4 pb-4 px-4">
                    <img src="/nodetable7.png" className="w-10 h-10" />
                    <div>NETWORK SPEED</div>
                  </div>
                </th>
                <th style={{ border: "solid 1px #FFFFFF66" }}>
                  <div className="flex gap-4 justify-center items-center pt-4 pb-4 px-4">
                    <img src="/nodetable8.png" className="w-10 h-10" />
                    <div>STATUS</div>
                  </div>
                </th>
                <th style={{ border: "solid 1px #FFFFFF66" }}>
                  <div className="flex gap-4 justify-center items-center pt-4 pb-4 px-4">
                    <img src="/nodetable9.png" className="w-10 h-10" />
                    <div>UPTIME</div>
                  </div>
                </th>
                <th style={{ border: "solid 1px #FFFFFF66" }}>
                  <div className="flex gap-4 justify-center items-center pt-4 pb-4 px-4">
                    <img src="/nodetable9.png" className="w-10 h-10" />
                    <div>LAST PING</div>
                  </div>
                </th>
              </tr>
            </thead>
              <tbody>
              {nodesdata.length === 0 ? (
                <tr className="table-row" style={{ height: "60px" }}>
                  <td
                    colSpan="8" 
                    style={{ 
                      textAlign: "center",
                      border: "solid 1px #FFFFFF66",
                      padding: "16px" 
                    }}
                  >
                    <div className="flex justify-center items-center py-2 px-4">
                      No Nodes Available
                    </div>
                  </td>
                </tr>
              ) : (
              filteredNodesData.map((node) => (
                <tr
                  key={node.id}
                  className={`table-row cursor-pointer ${
                    node.status === "inactive"
                      ? "text-red-300"
                      : "text-blue-100"
                  }`}
                  style={{ height: "60px" }} // Adjust the height as needed
                  onClick={() => handleRowClick(node.id)}
                >
                  <td style={{ border: "solid 1px #FFFFFF66" }}>
                    <div className="flex gap-4 justify-center items-center py-2 px-4">
                      {/* {node.id.slice(0, 4)}...{node.id.slice(-4)} */}
                      {node.name}
                    </div>
                  </td>
                  <td style={{ border: "solid 1px #FFFFFF66" }}>
                    <div className="flex gap-4 justify-center items-center py-2 px-4">
                      {node.chainName}
                    </div>
                  </td>
                  <td style={{ border: "solid 1px #FFFFFF66" }}>
                    <div className="flex gap-4 justify-center items-center py-2 px-4">
                      {node.walletAddress.slice(0, 3)}...
                      {node.walletAddress.slice(-3)}
                    </div>
                  </td>
                  <td style={{ border: "solid 1px #FFFFFF66" }}>
                    <div className="flex gap-4 justify-center items-center py-2 px-4">
                      {node.region}
                    </div>
                  </td>
                  <td style={{ border: "solid 1px #FFFFFF66" }}>
                    <div className="flex gap-4 justify-center items-center py-2 px-4">
                      <span>DL:</span>
                      {node.downloadSpeed}
                      <span>UL:</span>
                      {node.uploadSpeed}
                    </div>
                  </td>
                  <td style={{ border: "solid 1px #FFFFFF66" }}>
                    <div className="flex gap-4 justify-center items-center py-2 px-4">
                      {node.status}
                    </div>
                  </td>
                  <td style={{ border: "solid 1px #FFFFFF66" }}>
                    <div className="flex gap-4 justify-center items-center py-2 px-4">
                      {node.status === "inactive"
                        ? "---"
                        : elapsedTimeSince(node.startTimeStamp)}
                    </div>
                  </td>
                  <td style={{ border: "solid 1px #FFFFFF66" }}>
                    <div className="flex gap-4 justify-center items-center py-2 px-4">
                      {elapsedTimeSince(node.lastPingedTimeStamp)}
                    </div>
                  </td>
                  {/* <td style={{paddingTop:'20px'}}>{node.lastPinged}</td> */}
                </tr>
              ))
              )}
            </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NodesData;