// pages/nodeinfo/[nodeId].tsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";
import { ReactWorldCountriesMap } from "react-world-countries-map";

const EREBRUS_GATEWAY_URL = process.env.NEXT_PUBLIC_EREBRUS_BASE_URL;


interface Node {
  id: string;
  name: string;
  region: string;
  ipinfocity: string;
  ipinfocountry: string;
  ipinfotimezone: string;
  ipinfoorg: string;
  nodename: string;
  status: string;
  startTimeStamp: number;
  lastPingedTimeStamp: number;
  uploadSpeed: number;
  downloadSpeed: number;
  domain: string;
  ipinfoip: string;
  chainName: string;
  price: number; // or string
}

interface Client {
  nodeId: string;
  UUID: string;
  name: string;
  userId: string;
  region: string;
  created_at: string;
}

const NodeDetail: React.FC = () => {
  const [node, setNode] = useState<Node | null>(null);
  const [clients, setClients] = useState<Client[]>([]);
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    if (id) {
      axios
        .get(`${EREBRUS_GATEWAY_URL}api/v1.0/erebrus/clients/node/${id}`, {
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          if (response.data.payload) {
            const payload: Client[] = response.data.payload;
            const filteredNodes = payload.filter((node) => node.nodeId === id);
            filteredNodes.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
            setClients(filteredNodes);
            console.log("nodes client", filteredNodes);
          } else {
            setClients([]);
          }
        })
        .catch((error) => {
          console.error("Error fetching node data:", error);
        });
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      axios
        .get(`${EREBRUS_GATEWAY_URL}api/v1.0/nodes/all`, {
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
          },
        })
        .then((response) => {
          const payload: Node[] = response.data.payload;
          const filteredNode = payload.find((node) => node.id === id);
          setNode(filteredNode || null);
        })
        .catch((error) => {
          console.error("Error fetching node data:", error);
        });
    }
  }, [id]);

  if (!node) {
    return <div>Loading...</div>;
  }

  const data = [{ country: `${node.region}`, value: 0 }];
  // const data = [{ country: node.region, value: 0 }];

  return (
    <div className="bg-black text-white p-6 md:p-20">
      <div className="text-2xl md:text-4xl font-semibold">{node.name}</div>
  
      <div className="text-base md:text-lg">
        <div className="mt-6 md:mt-10">
          IP City: {node.ipinfocity}, {node.ipinfocountry}
        </div>
        <div className="mt-2">IP TimeZone: {node.ipinfotimezone}</div>
        <div className="mt-2">IP Org: {node.ipinfoorg}</div>
      </div>
  
      <div className="flex flex-col md:flex-row gap-4 mt-6 md:mt-10">
        <div
          className="md:w-2/3 rounded-xl px-4 py-4 md:px-10"
          style={{
            backgroundColor: "#040819",
            backgroundImage: "linear-gradient(180deg, #5696FF33, #1B213A66)",
            border: "1px solid #5696FF",
          }}
        >
          <div>
          <div>
          <div>
  {/* Header Section */}
  <div className="hidden md:grid grid-cols-4 gap-4 text-base md:text-xl">
    <div className="font-semibold" style={{ color: "#FFFFFF99" }}>Node Name</div>
    <div className="font-semibold" style={{ color: "#FFFFFF99" }}>Status</div>
    <div className="font-semibold" style={{ color: "#FFFFFF99" }}>Start Time</div>
    <div className="font-semibold" style={{ color: "#FFFFFF99" }}>Last Pinged</div>
  </div>

  {/* Data Section for Desktop */}
  <div className="hidden md:grid grid-cols-4 gap-4 text-sm md:text-lg mt-4">
    <div className="py-4">{node.nodename}</div>
    <div className="py-4 capitalize">
      <span className={node.status === "active" ? "text-green-500" : "text-red-300"}>{node.status}</span>
    </div>
    <div className="py-4">{new Date(node.startTimeStamp * 1000).toLocaleString()}</div>
    <div className="py-4">{new Date(node.lastPingedTimeStamp * 1000).toLocaleString()}</div>
  </div>

  {/* Data Section for Mobile */}
  <div className="md:hidden flex flex-col gap-4 text-sm md:text-lg mt-4">
    <div className="flex justify-between">
      <div className="font-semibold" style={{ color: "#FFFFFF99" }}>Node Name:</div>
      <div>{node.nodename}</div>
    </div>
    <div className="flex justify-between">
      <div className="font-semibold" style={{ color: "#FFFFFF99" }}>Status:</div>
      <div className={node.status === "active" ? "text-green-500" : "text-red-300"}>{node.status}</div>
    </div>
    <div className="flex justify-between">
      <div className="font-semibold" style={{ color: "#FFFFFF99" }}>Start Time:</div>
      <div>{new Date(node.startTimeStamp * 1000).toLocaleString()}</div>
    </div>
    <div className="flex justify-between">
      <div className="font-semibold" style={{ color: "#FFFFFF99" }}>Last Pinged:</div>
      <div>{new Date(node.lastPingedTimeStamp * 1000).toLocaleString()}</div>
    </div>
  </div>
</div>
</div>
</div>
</div>
  
        <div
          className="md:w-1/3 rounded-xl px-4 py-4 md:px-10"
          style={{
            backgroundColor: "#1B213A",
          }}
        >
          <div>
  <div className="text-base md:text-xl" style={{ color: "#FFFFFF99" }}>
    Bandwidth trans. data
  </div>
</div>
<div className="flex flex-col md:flex-row gap-4 justify-between mt-4">
  <div className="text-center">
    <div className="relative inline-block">
      <img src="/ellipse1.png" className="w-20 h-20 md:w-40 md:h-40" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-xs md:text-base">
        <div className="text-sm md:text-lg font-semibold">{node.uploadSpeed}</div>
        <div className="text-xs md:text-sm">Kbps Speed</div>
      </div>
    </div>
    <div className="mt-2 text-xs md:text-base">Upload</div>
  </div>
  
  <div className="text-center">
    <div className="relative inline-block">
      <img src="/ellipse1.png" className="w-20 h-20 md:w-40 md:h-40" />
      <div className="absolute inset-0 flex flex-col items-center justify-center text-xs md:text-base">
        <div className="text-sm md:text-lg font-semibold">{node.downloadSpeed}</div>
        <div className="text-xs md:text-sm">Kbps Speed</div>
      </div>
    </div>
    <div className="mt-2 text-xs md:text-base">Download</div>
  </div>
</div>
</div>
</div>

  
      <div className="flex flex-col md:flex-row gap-4 mt-4">
        <div className="md:w-1/2 rounded-xl">
          <ReactWorldCountriesMap
            color="blue"
            title="Node Region"
            // value-prefix="IP info city:   "
            size="xl"
            data={data}
          />
        </div>
        <div className="md:w-1/2 flex flex-col gap-4">
          <div
            className="rounded-xl px-4 py-10 md:px-10 md:py-24"
            style={{
              backgroundImage: `url(/dns_bg.png)`,
              backgroundPosition: "center",
            }}
          >
            <div className="text-base md:text-xl" style={{ color: "#FFFFFF99" }}>
              Domain
            </div>
            <div className="text-2xl md:text-3xl">{node.domain}</div>
          </div>
  
          <div
            className="rounded-xl px-4 py-8 md:px-10 md:py-8 mt-4"
            style={{
              backgroundColor: "#1B213A",
              backgroundImage: "radial-gradient(#5F9AF933, #5F9AF900)",
            }}
          >
            <div className="text-base md:text-xl" style={{ color: "#FFFFFF99" }}>
              IP Address
            </div>
            <div className="text-2xl md:text-3xl">{node.ipinfoip}</div>
          </div>
  
          <div
            className="rounded-xl px-4 py-10 md:px-10 md:py-10 mt-4"
            style={{
              backgroundColor: "#1B213A",
              backgroundImage: "radial-gradient(#5F9AF933, #5F9AF900)",
            }}
          >
            <div className="text-base md:text-xl" style={{ color: "#FFFFFF99" }}>
              Chain
            </div>
            <div className="text-2xl md:text-3xl">{node.chainName}</div>
          </div>
        </div>
      </div>
  
      <div className="flex flex-col md:flex-row gap-4 mt-4">
        <div
          className="md:w-2/3 rounded-xl px-4 py-4 md:px-10 md:py-4 mt-4"
          style={{
            backgroundColor: "#040819",
            backgroundImage: "linear-gradient(180deg, #5696FF33, #1B213A66)",
            border: "1px solid #5696FF",
          }}
        >
<div>
  {/* Header Section for Desktop */}
  <div className="hidden md:grid grid-cols-4 gap-4 text-base md:text-xl">
    <div className="font-semibold" style={{ color: "#FFFFFF99" }}>Client Name</div>
    <div className="font-semibold" style={{ color: "#FFFFFF99" }}>User ID</div>
    <div className="font-semibold md:text-center" style={{ color: "#FFFFFF99" }}>Region</div>
    <div className="font-semibold md:text-center" style={{ color: "#FFFFFF99" }}>Created At</div>
  </div>

  {/* Data Section for Desktop */}
  {clients.map((client) => (
    <div className="hidden md:grid grid-cols-4 gap-4 text-sm md:text-lg mt-4" key={client.UUID}>
      <div className="py-2">{client.name}</div>
      <div className="py-2">{client.userId}</div>
      <div className="py-2 md:text-center">{client.region}</div>
      <div className="py-2 md:text-center">{new Date(client.created_at).toLocaleString()}</div>
    </div>
  ))}

  {/* Data Section for Mobile */}
  {clients.map((client) => (
    <div className="md:hidden flex flex-col gap-4 text-sm md:text-lg mt-4" key={client.UUID}>
      <div className="flex justify-between">
        <div className="font-semibold" style={{ color: "#FFFFFF99" }}>Client Name:</div>
        <div>{client.name}</div>
      </div>
      <div className="flex justify-between">
        <div className="font-semibold" style={{ color: "#FFFFFF99" }}>User ID:</div>
        <div>{client.userId}</div>
      </div>
      <div className="flex justify-between">
        <div className="font-semibold" style={{ color: "#FFFFFF99" }}>Region:</div>
        <div>{client.region}</div>
      </div>
      <div className="flex justify-between">
        <div className="font-semibold" style={{ color: "#FFFFFF99" }}>Created At:</div>
        <div>{new Date(client.created_at).toLocaleString()}</div>
      </div>
    </div>
  ))}
</div>
</div>
        <div
          className="rounded-xl px-4 py-8 md:px-10 md:py-10 w-full md:w-1/3 mt-4 max-h-48"
          style={{
            backgroundColor: "#1B213A",
            backgroundImage: "radial-gradient(#5F9AF933, #5F9AF900)",
            overflowY: "auto",
          }}
        >
          <div className="text-base md:text-xl" style={{ color: "#FFFFFF99" }}>
            Price
          </div>
          <div className="text-2xl md:text-3xl">{node.price}</div>
        </div>
      </div>
    </div>
  );
}  

export default NodeDetail;