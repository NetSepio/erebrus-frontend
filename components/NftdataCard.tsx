import Link from "next/link";
// import { removePrefix } from "../utils/ipfsUtil";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaPaperclip } from "react-icons/fa";
import Image from "next/image";
import Cookies from "js-cookie";

interface ReviewCardProps {
  metaData: {
    amount: number;
    current_token_data: {
      cdn_asset_uris: {
        cdn_image_uri: string;
      };
      current_collection: {
        uri: string;
        max_supply: number;
        description: string;
        collection_name: string;
        collection_id: string;
        creator_address: string;
      };
      description: string;
      token_data_id: string;
      token_name: string;
      token_properties: any;
      token_standard: string;
      token_uri: string;
    };
  } | null;
  MyReviews?: boolean;
  // review?: ReviewCreated;
  onReviewDeleted?: () => void;
  chainSymbol?: string;
}

const background = {
  backgroundColor: "#222944",
};

const color = {
  color: "#788AA3",
};

const color2 = {
  color: "#11D9C5",
};

const backgroundbutton = {
  backgroundColor: "#11D9C5",
};

const truncateDescription = (
  description: string,
  maxLength: number
): string => {
  const words = description.split(" ");
  const truncatedWords = words.slice(0, maxLength);
  return truncatedWords.join(" ") + (words.length > maxLength ? "..." : "");
};

const NftdataCard: React.FC<ReviewCardProps> = ({
  metaData,
  MyReviews = false,
  onReviewDeleted,
  chainSymbol,
}) => {
  const [imageSrc, setImageSrc] = React.useState<string | null>(null);
  const [attributes, setAttributes] = React.useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  const getUserAddressFromCookie = () => {
    return Cookies.get("erebrus_wallet") || "";
  };
  const userAddress = getUserAddressFromCookie();
   useEffect(() => {
    const fetchMetaData = async () => {
      if (
        !metaData ||
        !metaData.current_token_data ||
        !metaData.current_token_data.token_uri
      ) {
        console.log("Missing metadata or token URI");
        setIsLoading(false);
        return;
      }

      try {
        let metadata;
        if (chainSymbol === "sol") {
          const response = await axios.get(metaData.current_token_data.token_uri);
          metadata = response.data;
          console.log("Solana Metadata:", metadata);
        } else if (chainSymbol === "apt") {
          const ipfsCid = metaData.current_token_data.token_uri.replace(
            "ipfs://",
            ""
          );
          console.log("IPFS CID:", ipfsCid);
          const metadataResponse = await axios.get(
            `https://ipfs.io/ipfs/${ipfsCid}`
          );
          metadata = metadataResponse.data;
          console.log("Aptos Metadata:", metadata);
        } else {
          console.log("Unsupported chain");
          setIsLoading(false);
          return;
        }

        const imageUrl =
          metadata?.image ||
          metadata?.image_url ||
          metadata?.imageUrl ||
          metadata?.url;
        setImageSrc(imageUrl?.replace("ipfs://", "https://ipfs.io/ipfs/"));
        setAttributes({
          name: metadata.name,
          description: metadata.description,
          symbol: metadata.symbol,
          externalUrl: metadata.external_url,
          collection: metadata.collection,
          ...metadata.attributes,
        });
      } catch (error) {
        console.error("Error fetching metadata:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMetaData();
  }, [metaData, chainSymbol]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center w-full max-w-sm mx-auto">
        <div
          className="w-full h-72 p-5 bg-center bg-cover"
          style={{ display: "flex", alignItems: "center" }}
        >
          <div className="animate-spin rounded-full h-32 w-32 mx-auto border-t-2 border-b-2 border-green-200"></div>
        </div>
      </div>
    );
  }

  if (!metaData) {
    return null;
  }


  return (
    <div
      className="w-full cursor-pointer rounded-3xl"
      style={{ backgroundColor: "#202333", border: "1px solid #0162FF" }}
    >
      <div className="w-full h-full rounded-lg p-6 relative">
        {chainSymbol === "sol" && (
          <div className="absolute top-2 left-2 flex items-center">
            <img
              src="./solanaicon.png" // Update with the correct path to your Solana icon
              alt="Solana Icon"
              className="w-10 h-10 rounded-full"
            />
          </div>
        )}
        <div>
          <div className="flex flex-col">
            <div className="">
              <img
                alt={metaData.current_token_data.token_name}
                src={
                  imageSrc ||
                  metaData.current_token_data.cdn_asset_uris?.cdn_image_uri
                }
                className="w-full h-48 object-cover rounded-lg"
                onError={(e) => {
                  console.error(
                    "Image failed to load:",
                    (e.target as HTMLImageElement).src
                  );
                  (e.target as HTMLImageElement).src =
                    "/path/to/placeholder/image.png"; // Fallback image
                }}
              />
            </div>
            <div className="w-full">
              <h3 className="leading-12 mb-2 text-white">
                <div className="lg:flex md:flex justify-between">
                  <div className="text-xl font-semibold mt-4">
                    {attributes?.name || metaData.current_token_data.token_name}
                  </div>
                  <a
                    href={
                      chainSymbol === "apt"
                        ? `https://aptoscan.com/account/${userAddress}#tokens`
                        : attributes?.externalUrl
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 text-white"
                  >
                    <FaPaperclip size={20} />
                  </a>
                </div>
              </h3>

              <div className="rounded-xl">
                <div className="text-sm text-white text-start flex mt-2">
                  <div className="">
                    {attributes?.description ||
                      metaData.current_token_data.description}
                  </div>
                </div>
              </div>

              {attributes && chainSymbol === "sol" && (
                <div
                  className="flex-wrap flex gap-2 text-xs text-white justify-center rounded-full px-4 py-2 mt-4"
                  style={{ backgroundColor: "#0162FF" }}
                >
                  <div>Symbol: {attributes.symbol}</div>
                  <div>Collection: {attributes.collection?.name}</div>
                  <div>Family: {attributes.collection?.family}</div>
                </div>
              )}

              {attributes && chainSymbol === "apt" && (
                <div
                  className="flex-wrap flex gap-2 text-xs text-white rounded-full px-4 py-2 mt-4 justify-center"
                  style={{ backgroundColor: "#0162FF" }}
                >
                  Access Vpn
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NftdataCard;
