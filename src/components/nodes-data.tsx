/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowUpDown,
  Search,
  Filter,
  RefreshCw,
  CheckCircle,
  XCircle,
  Globe,
  Download,
  Upload,
  Clock,
  ExternalLink,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

// Define the Node interface
interface Node {
  id: string;
  name: string;
  nodename?: string;
  status: string;
  chainName?: string;
  region?: string;
  ipinfocountry?: string;
  ipinfocity?: string;
  ipinfolocation?: string;
  downloadSpeed: number;
  uploadSpeed: number;
  startTimeStamp?: number;
  lastPingedTimeStamp?: number;
  walletAddress?: string;
  walletAddressSol?: string;
  totalUptime?: number;
  upTimeUnit?: string;
}

const EREBRUS_GATEWAY_URL =
  process.env.NEXT_PUBLIC_GATEWAY_URL ||

export default function NodesData() {
  const router = useRouter();
  const [nodes, setNodes] = useState<Node[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Node;
    direction: "asc" | "desc";
  } | null>(null);
  const [filters, setFilters] = useState<{
    status: string[];
    region: string[];
  }>({
    status: [],
    region: [],
  });
  const [stats, setStats] = useState({
    total: 0,
    active: 0,
    regions: 0,
  });

  // Fetch nodes data
  useEffect(() => {
    async function fetchNodes() {
      setLoading(true);
      try {
        const response = await fetch(
          `${EREBRUS_GATEWAY_URL}api/v1.0/nodes/all`
        );
        const data = await response.json();
        if (data && Array.isArray(data.payload)) {
          setNodes(data.payload);

          // Calculate stats
          const activeNodes = data.payload.filter(
            (node: Node) => node.status === "active"
          ).length;
          const uniqueRegions = new Set(
            data.payload.map((node: Node) => node.ipinfocountry || node.region)
          ).size;

          setStats({
            total: data.payload.length,
            active: activeNodes,
            regions: uniqueRegions,
          });
        } else {
          setNodes([]);
        }
      } catch (error) {
        setNodes([]);
      } finally {
        setLoading(false);
      }
    }

    fetchNodes();

    // Set up auto-refresh every 5 minutes
    const intervalId = setInterval(() => {
      fetchNodes();
    }, 5 * 60 * 1000);

    return () => clearInterval(intervalId);
  }, []);

  // Handle sorting
  const handleSort = (key: keyof Node) => {
    let direction: "asc" | "desc" = "asc";

    if (sortConfig && sortConfig.key === key) {
      direction = sortConfig.direction === "asc" ? "desc" : "asc";
    }

    setSortConfig({ key, direction });
  };

  // Handle filtering
  const toggleFilter = (type: "status" | "region", value: string) => {
    setFilters((prev) => {
      const currentFilters = [...prev[type]];
      const index = currentFilters.indexOf(value);

      if (index === -1) {
        currentFilters.push(value);
      } else {
        currentFilters.splice(index, 1);
      }

      return {
        ...prev,
        [type]: currentFilters,
      };
    });
  };

  // Format uptime
  const formatUptime = (timestamp?: number, unit?: string) => {
    if (!timestamp) return "N/A";

    const now = Math.floor(Date.now() / 1000);
    const uptimeSeconds = now - timestamp;

    if (uptimeSeconds < 60) return `${uptimeSeconds} seconds`;
    if (uptimeSeconds < 3600)
      return `${Math.floor(uptimeSeconds / 60)} minutes`;
    if (uptimeSeconds < 86400)
      return `${Math.floor(uptimeSeconds / 3600)} hours`;
    return `${Math.floor(uptimeSeconds / 86400)} days`;
  };

  // Navigate to node detail page
  const handleNodeClick = (nodeId: string) => {
    router.push(`/usernode/${nodeId}`);
  };

  // Apply filters and sorting to nodes
  const filteredAndSortedNodes = useMemo(() => {
    let result = [...nodes];

    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (node) =>
          node.name.toLowerCase().includes(term) ||
          (node.nodename && node.nodename.toLowerCase().includes(term)) ||
          (node.ipinfocountry &&
            node.ipinfocountry.toLowerCase().includes(term)) ||
          (node.ipinfocity && node.ipinfocity.toLowerCase().includes(term))
      );
    }

    // Apply status filter
    if (filters.status.length > 0) {
      result = result.filter((node) => filters.status.includes(node.status));
    }

    // Apply region filter
    if (filters.region.length > 0) {
      result = result.filter((node) =>
        filters.region.includes(node.ipinfocountry || node.region || "Unknown")
      );
    }

    // Apply sorting
    if (sortConfig) {
      result.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue === undefined) return 1;
        if (bValue === undefined) return -1;

        if (aValue < bValue) {
          return sortConfig.direction === "asc" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "asc" ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [nodes, searchTerm, sortConfig, filters]);

  // Get unique regions for filter
  const uniqueRegions = useMemo(() => {
    const regions = new Set<string>();
    nodes.forEach((node) => {
      regions.add(node.ipinfocountry || node.region || "Unknown");
    });
    return Array.from(regions).sort();
  }, [nodes]);

  return (
    <TooltipProvider>
      <div className="nodes-data-page pt-16 px-4 lg:px-20 bg-[#20253A]">
        <div className="text-2xl font-semibold text-gray-300 mb-8">
          Erebrus ÐVPN Nodes Data
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-900/30 to-blue-800/10 border-blue-800/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-gray-300 text-lg">
                Total Nodes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-10 w-20 bg-blue-900/30" />
              ) : (
                <div className="text-3xl font-bold text-white">
                  {stats.total}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-900/30 to-green-800/10 border-green-800/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-gray-300 text-lg">
                Active Nodes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-10 w-20 bg-green-900/30" />
              ) : (
                <div className="text-3xl font-bold text-white">
                  {stats.active}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-900/30 to-purple-800/10 border-purple-800/30">
            <CardHeader className="pb-2">
              <CardTitle className="text-gray-300 text-lg">
                Regions Covered
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-10 w-20 bg-purple-900/30" />
              ) : (
                <div className="text-3xl font-bold text-white">
                  {stats.regions}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <label htmlFor="node-search" className="sr-only">
              Search nodes by name, region, or city
            </label>
            <Input
              id="node-search"
              placeholder="Search by name, region, or city..."
              className="pl-10 bg-gray-800/50 border-gray-700 text-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-gray-800/50 border-gray-700 text-white"
                  aria-label="Filter nodes by status"
                >
                  <Filter className="mr-2 h-4 w-4" /> Status
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => toggleFilter("status", "active")}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-4 h-4 mr-2 rounded-full ${
                        filters.status.includes("active")
                          ? "bg-green-500"
                          : "bg-gray-300"
                      }`}
                    ></div>
                    Active
                  </div>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => toggleFilter("status", "inactive")}
                >
                  <div className="flex items-center">
                    <div
                      className={`w-4 h-4 mr-2 rounded-full ${
                        filters.status.includes("inactive")
                          ? "bg-red-500"
                          : "bg-gray-300"
                      }`}
                    ></div>
                    Inactive
                  </div>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-gray-800/50 border-gray-700 text-white"
                  aria-label="Filter nodes by region"
                >
                  <Globe className="mr-2 h-4 w-4" /> Region
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="max-h-60 overflow-y-auto">
                {uniqueRegions.map((region) => (
                  <DropdownMenuItem
                    key={region}
                    onClick={() => toggleFilter("region", region)}
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-4 h-4 mr-2 rounded-full ${
                          filters.region.includes(region)
                            ? "bg-blue-500"
                            : "bg-gray-300"
                        }`}
                      ></div>
                      {region}
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            <Button
              variant="outline"
              className="bg-gray-800/50 border-gray-700 text-white"
              onClick={() => {
                setSearchTerm("");
                setFilters({ status: [], region: [] });
                setSortConfig(null);
              }}
              aria-label="Reset all filters"
            >
              <RefreshCw className="mr-2 h-4 w-4" /> Reset
            </Button>
          </div>
        </div>

        {/* Applied Filters */}
        {(filters.status.length > 0 || filters.region.length > 0) && (
          <div className="flex flex-wrap gap-2 mb-4">
            {filters.status.map((status) => (
              <Badge
                key={status}
                variant="secondary"
                className="bg-blue-900/30 text-blue-200"
              >
                Status: {status}
                <button
                  className="ml-2 text-blue-200 hover:text-white"
                  onClick={() => toggleFilter("status", status)}
                  aria-label={`Remove status filter: ${status}`}
                >
                  ×
                </button>
              </Badge>
            ))}

            {filters.region.map((region) => (
              <Badge
                key={region}
                variant="secondary"
                className="bg-purple-900/30 text-purple-200"
              >
                Region: {region}
                <button
                  className="ml-2 text-purple-200 hover:text-white"
                  onClick={() => toggleFilter("region", region)}
                  aria-label={`Remove region filter: ${region}`}
                >
                  ×
                </button>
              </Badge>
            ))}
          </div>
        )}

        {/* Results count */}
        <div className="text-sm text-gray-400 mb-4">
          Showing {filteredAndSortedNodes.length} of {nodes.length} nodes
        </div>

        {/* Nodes Table */}
        <div className="rounded-lg border border-gray-700 overflow-hidden mb-8">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-gray-800/70">
                <TableRow>
                  <TableHead
                    className="text-gray-300 cursor-pointer hover:text-white"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center">
                      Name
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="text-gray-300 cursor-pointer hover:text-white"
                    onClick={() => handleSort("status")}
                  >
                    <div className="flex items-center">
                      Status
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="text-gray-300 cursor-pointer hover:text-white"
                    onClick={() => handleSort("chainName")}
                  >
                    <div className="flex items-center">
                      Chain
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="text-gray-300 cursor-pointer hover:text-white">
                    <div className="flex items-center">
                      Location
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="text-gray-300 cursor-pointer hover:text-white"
                    onClick={() => handleSort("downloadSpeed")}
                  >
                    <div className="flex items-center">
                      <Download className="mr-1 h-4 w-4" />
                      Speed
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="text-gray-300 cursor-pointer hover:text-white"
                    onClick={() => handleSort("uploadSpeed")}
                  >
                    <div className="flex items-center">
                      <Upload className="mr-1 h-4 w-4" />
                      Speed
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="text-gray-300 cursor-pointer hover:text-white"
                    onClick={() => handleSort("startTimeStamp")}
                  >
                    <div className="flex items-center">
                      <Clock className="mr-1 h-4 w-4" />
                      Uptime
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="text-gray-300">
                    <span className="sr-only">Actions</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  Array(5)
                    .fill(0)
                    .map((_, index) => (
                      <TableRow
                        key={index}
                        className="bg-gray-900/30 border-gray-800"
                      >
                        <TableCell>
                          <Skeleton className="h-6 w-32 bg-gray-800/50" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-20 bg-gray-800/50" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-24 bg-gray-800/50" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-32 bg-gray-800/50" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-16 bg-gray-800/50" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-16 bg-gray-800/50" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-24 bg-gray-800/50" />
                        </TableCell>
                        <TableCell>
                          <Skeleton className="h-6 w-8 bg-gray-800/50" />
                        </TableCell>
                      </TableRow>
                    ))
                ) : filteredAndSortedNodes.length > 0 ? (
                  filteredAndSortedNodes.map((node) => (
                    <TableRow
                      key={node.id}
                      className="bg-gray-900/30 border-gray-800 hover:bg-gray-800/30 cursor-pointer"
                      onClick={() => handleNodeClick(node.id)}
                    >
                      <TableCell className="font-medium text-white">
                        {node.nodename || node.name}
                      </TableCell>
                      <TableCell>
                        {node.status === "active" ? (
                          <Badge className="bg-green-900/30 text-green-300 border-green-700/30">
                            <CheckCircle className="mr-1 h-3 w-3" /> Active
                          </Badge>
                        ) : (
                          <Badge className="bg-red-900/30 text-red-300 border-red-700/30">
                            <XCircle className="mr-1 h-3 w-3" /> Inactive
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {node.chainName || "Unknown"}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span className="text-gray-300">
                            {node.ipinfocountry || node.region || "Unknown"}
                            {node.ipinfocity && `, ${node.ipinfocity}`}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {node.downloadSpeed
                          ? `${node.downloadSpeed.toFixed(2)} Mbps`
                          : "N/A"}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {node.uploadSpeed
                          ? `${node.uploadSpeed.toFixed(2)} Mbps`
                          : "N/A"}
                      </TableCell>
                      <TableCell className="text-gray-300">
                        {formatUptime(node.startTimeStamp, node.upTimeUnit)}
                      </TableCell>
                      <TableCell>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-gray-400 hover:text-white"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleNodeClick(node.id);
                              }}
                              aria-label={`View details for node ${
                                node.nodename || node.name
                              }`}
                            >
                              <ExternalLink className="h-4 w-4" />
                              <span className="sr-only">View details</span>
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent>
                            <p>View node details</p>
                          </TooltipContent>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-8 text-gray-400"
                    >
                      No nodes found matching your filters
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
}
