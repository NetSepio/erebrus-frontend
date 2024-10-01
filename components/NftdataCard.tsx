import Link from "next/link";
// import { removePrefix } from "../utils/ipfsUtil";
import React, {useEffect} from "react";
import axios from "axios";
import { FaPaperclip } from "react-icons/fa";
import Image from "next/image";

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

  // React.useEffect(() => {
  //   if (
  //     metaData &&
  //     metaData.current_token_data &&
  //     metaData.current_token_data.token_uri
  //   ) {
  //     console.log(metaData.current_token_data.token_data_id);
  //     fetch(metaData.current_token_data.token_uri)
  //       .then((response) => response.json())
  //       .then((jsonData: any) => {
  //         // Assuming there's an "image" property in the JSON containing the image URL
  //         const imageUrl = jsonData.image;
  //         setImageSrc(imageUrl);
  //       })
  //       .catch((error) => {
  //         console.error(
  //           `Error fetching token URI (${metaData.current_token_data.token_uri}): ${error}`
  //         );
  //       });
  //   }
  // }, [metaData]);

  useEffect(() => {
    const fetchMetaData = async () => {
      if (chainSymbol === 'sol') {
        // Handling for Solana NFTs
        if (metaData?.current_token_data?.token_uri) {
          try {
            const response = await axios.get(metaData.current_token_data.token_uri);
            const metadata = response.data;
            console.log("Solana Metadata:", metadata);
            setImageSrc(metadata?.image);
            setAttributes(metadata?.attributes);
          } catch (error) {
            console.error("Error fetching Solana metadata:", error);
          }
        }
      } else {
        // Existing code for Aptos NFTs
        const ipfsCid = metaData?.current_token_data?.token_uri.replace("ipfs://", "");
        if (ipfsCid) {
          try {
            const metadataResponse = await axios.get(`https://ipfs.io/ipfs/${ipfsCid}`);
            const metadata = metadataResponse.data;
            console.log("Aptos Metadata:", metadata);
            setImageSrc(metadata?.image.replace("ipfs://", ""));
            setAttributes(metadata?.attributes);
          } catch (error) {
            console.error("Error fetching Aptos metadata:", error);
          }
        }
      }
    };
    fetchMetaData();
  }, [metaData, chainSymbol]);

  if (!metaData) {
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

  return (
    <div className="w-full cursor-pointer rounded-3xl" style={{ backgroundColor:'#202333', border: '1px solid #0162FF'}}>
      <div className="w-full h-full rounded-lg p-6 relative">
        {chainSymbol === 'sol' && (
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
                  chainSymbol === 'sol'
                    ? imageSrc || metaData.current_token_data.cdn_asset_uris.cdn_image_uri
                    : `https://nftstorage.link/ipfs/${imageSrc}`
                }
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
            <div className="w-full">
              <h3 className="leading-12 mb-2 text-white">
                <div className="lg:flex md:flex justify-between">
                  <div className="text-xl font-semibold mt-4">
                    {metaData.current_token_data.token_name}
                  </div>
                  <a
              href={`https://explorer.solana.com/tx/dyu7uefnn2Y2bKCDu6uTP4pVBPcBu4RPwsV522rjtbR6B2BJyA4vWC4eLGosDXqPzMpXsaBgzbE8VjqMkaYgf6g?cluster=devnet  -- <@748192618659315753>`}
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
                    {metaData.current_token_data.description}
                  </div>
                </div>
              </div>

              {attributes && chainSymbol === 'sol' && (
                
                <div className="flex-wrap flex gap-2 text-xs text-white justify-center rounded-full px-4 py-2 mt-4" style={{backgroundColor:'#0162FF'}}>
                  {attributes.map((attr, index) => (
                    <div key={index} className="">{attr.value}</div>
                  ))}
                  
                </div>
                
              )}

              {attributes && chainSymbol !== 'sol' && (
                <div className="flex-wrap flex gap-2 text-xs text-white rounded-full px-4 py-2 mt-4" style={{backgroundColor:'#0162FF'}}>
                  {Object.entries(attributes).map(([key, value]) => (
                    <div key={key} className="ml-4">{key}: {value.toString()}</div>
                  ))}
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