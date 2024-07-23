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
    <div className="bg-black text-white p-20">
      <div className="text-4xl font-semibold">{node.name}</div>

      <div className="text-lg">
        <div className="mt-10">
          IP City: {node.ipinfocity}, {node.ipinfocountry}
        </div>
        <div className="mt-2">IP TimeZone: {node.ipinfotimezone}</div>
        <div className="mt-2">IP Org: {node.ipinfoorg}</div>
      </div>

      <div className="flex gap-4 mt-10">
        <div
          className="w-2/3 rounded-xl px-10 py-4"
          style={{
            backgroundColor: "#040819",
            backgroundImage: "linear-gradient(180deg, #5696FF33, #1B213A66)",
            border: "1px solid #5696FF",
          }}
        >
          <div className="flex">
            <div className="text-xl w-1/4" style={{ color: "#FFFFFF99" }}>
              Node Name
            </div>
            <div className="text-xl w-1/4" style={{ color: "#FFFFFF99" }}>
              Status
            </div>
            <div className="text-xl w-1/4" style={{ color: "#FFFFFF99" }}>
              Start Time
            </div>
            <div className="text-xl w-1/4" style={{ color: "#FFFFFF99" }}>
              Last Pinged
            </div>
          </div>

          <div className="text-lg flex mt-10">
            <div className="w-1/4">{node.nodename}</div>
            <div className="w-1/4 capitalize">
              <span className={node.status === "active" ? "text-green-500" : "text-red-300"}>{node.status}</span>
            </div>
            <div className="w-1/4">{new Date(node.startTimeStamp * 1000).toLocaleString()}</div>
            <div className="w-1/4">{new Date(node.lastPingedTimeStamp * 1000).toLocaleString()}</div>
          </div>
        </div>
        <div
          className="w-1/3 rounded-xl px-10 py-4"
          style={{
            backgroundColor: "#1B213A",
          }}
        >
          <div>
            <div className="text-xl" style={{ color: "#FFFFFF99" }}>
              Bandwidth trans. data
            </div>
          </div>
          <div className="flex gap-4 justify-between mt-4">
            <div>
              <div className="relative text-center">
                <img src="/ellipse1.png" className="w-40 h-40" />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  {node.uploadSpeed}
                  <div>Kbps Speed</div>
                </div>
              </div>
              <div className="text-center">Upload</div>
            </div>
            <div>
              <div className="relative text-center">
                <img src="/ellipse1.png" className="w-40 h-40" />
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  {node.downloadSpeed}
                  <div>Kbps Speed</div>
                </div>
              </div>
              <div className="text-center">Download</div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 mt-4">
        <div className="w-1/2 rounded-xl">
          <ReactWorldCountriesMap
            color="blue"
            title="Node Region"
            // value-prefix="IP info city:   "
            size="xl"
            data={data}
          />
        </div>
        <div className="w-1/2">
          <div
            className="rounded-xl px-10 py-24"
            style={{
              backgroundImage: `url(/dns_bg.png)`,
              backgroundPosition: "center",
            }}
          >
            <div className="text-xl" style={{ color: "#FFFFFF99" }}>
              Domain
            </div>
            <div className="text-3xl">{node.domain}</div>
          </div>

          <div
            className="rounded-xl px-10 py-8 mt-4"
            style={{
              backgroundColor: "#1B213A",
              backgroundImage: "radial-gradient(#5F9AF933, #5F9AF900)",
            }}
          >
            <div className="text-xl" style={{ color: "#FFFFFF99" }}>
              IP Address
            </div>
            <div className="text-3xl">{node.ipinfoip}</div>
          </div>

          <div
            className="rounded-xl px-10 py-10 mt-4"
            style={{
              backgroundColor: "#1B213A",
              backgroundImage: "radial-gradient(#5F9AF933, #5F9AF900)",
            }}
          >
            <div className="text-xl" style={{ color: "#FFFFFF99" }}>
              Chain
            </div>
            <div className="text-3xl">{node.chainName}</div>
          </div>
        </div>
      </div>

      <div className="flex gap-4">
        <div
          className="w-2/3 rounded-xl px-10 py-4 mt-4"
          style={{
            backgroundColor: "#040819",
            backgroundImage: "linear-gradient(180deg, #5696FF33, #1B213A66)",
            border: "1px solid #5696FF",
          }}
        >
          <div className="flex">
            <div className="text-xl w-1/4" style={{ color: "#FFFFFF99" }}>
              Client Name
            </div>
            <div className="text-xl w-1/4" style={{ color: "#FFFFFF99" }}>
              User ID
            </div>
            <div className="text-xl w-1/4 text-center" style={{ color: "#FFFFFF99" }}>
              Region
            </div>
            <div className="text-xl w-1/4 text-center" style={{ color: "#FFFFFF99" }}>
              Created At
            </div>
          </div>

          {clients.map((client) => (
            <div className="text-lg flex mt-10" key={client.UUID}>
              <div className="w-1/4">{client.name}</div>
              <div className="w-1/4">{client.userId}</div>
              <div className="w-1/4 text-center">{client.region}</div>
              <div className="w-1/4 text-center">{new Date(client.created_at).toLocaleString()}</div>
            </div>
          ))}
        </div>

        <div
          className="rounded-xl px-10 pt-10 w-1/3 mt-4 max-h-80"
          style={{
            backgroundImage: `url(/dns_bg.png)`,
            backgroundPosition: "center",
          }}
        >
          <div className="text-xl" style={{ color: "#FFFFFF99" }}>
            Total Clients
          </div>
          <div className="text-6xl">{clients?.length ? clients?.length : 0}</div>
        </div>
      </div>
    </div>
  );
};

export default NodeDetail;
