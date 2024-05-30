import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";

const EREBRUS_GATEWAY_URL = process.env.NEXT_PUBLIC_EREBRUS_BASE_URL;

const NodesData = () => {
  const [nodesdata, setNodesData] = useState([]);
  const [activeNodesData, setActiveNodesData] = useState([]);
  const [uniqueRegionsCount, setUniqueRegionsCount] = useState(0);

  useEffect(() => {
  const fetchNodesData = async () => {
    try {
      const auth = Cookies.get("erebrus_token");

      const response = await axios.get(
        `${EREBRUS_GATEWAY_URL}api/v1.0/nodes/all`,
        {
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
          },
        }
      );

      if (response.status === 200) {
        const payload = response.data.payload;
        const filteredNodes = payload.filter(
          (node) => node?.status === "active" && (node.region === "JP" || node.region === "SG")
        );
        setNodesData(filteredNodes);
        setActiveNodesData(filteredNodes);
        const uniqueRegions = new Set(filteredNodes.map((node) => node.region ));
        setUniqueRegionsCount(uniqueRegions.size);
        console.log("erebrus nodes", payload);
        console.log("filtered nodes", filteredNodes );
      }
    } catch (error) {
      console.error("Error fetching nodes data:", error);
    }
  };

  fetchNodesData();
}, []);

  function elapsedTimeSince(timestamp) {
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
  }

  return (
    <div
      id="howto"
      className="flex flex-col items-center justify-start scroll-mt-16 lg:scroll-mt-0 min-h-screen"
      style={{ backgroundColor: "#010001" }}
    >
      <div className="font-figtree text-left text-gray-200 w-full p-3">
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
          <table className="w-full text-center">
          <thead style={{ height: "10px" }}>
  <tr>
    <th style={{ border: "solid 1px #FFFFFF66" }}>
      <div className="flex gap-4 justify-center items-center pt-4 pb-4 px-4">
        <img src="/nodetable4.png" className="w-12 h-12" />
        <div>NODE ID</div>
      </div>
    </th>
    <th style={{ border: "solid 1px #FFFFFF66" }}>
      <div className="flex gap-4 justify-center items-center pt-4 pb-4 px-4">
        <img src="/nodetable5.png" className="w-10 h-10" />
        <div>NODE NAME</div>
      </div>
    </th>
    <th style={{ border: "solid 1px #FFFFFF66" }}>
      <div className="flex gap-4 justify-center items-center pt-4 pb-4 px-4">
        <img src="/nodetable9.png" className="w-10 h-10" />
        <div>SUI ADDRESS</div>
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
  {nodesdata.map((node) => (
    <tr
      key={node.id}
      className={
        node.status === "inactive"
          ? "text-red-300"
          : "text-blue-100"
      }
      style={{ height: "60px" }}
    >
      <td style={{ border: "solid 1px #FFFFFF66" }}>
        <div className="flex gap-4 justify-center items-center py-2 px-4">
          {node.id.slice(0, 4)}...{node.id.slice(-4)}
        </div>
      </td>
      <td style={{ border: "solid 1px #FFFFFF66" }}>
        <div className="flex gap-4 justify-center items-center py-2 px-4">
          {node.name}
        </div>
      </td>
      <td style={{ border: "solid 1px #FFFFFF66" }}>
        <div className="flex gap-4 justify-center items-center py-2 px-4 overflow-hidden truncate text-clip text-nowrap max-w-xs">
          {`${node.walletAddress.slice(0, 3)}...${node.walletAddress.slice(-3)}`}
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
    </tr>
  ))}
</tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default NodesData;
