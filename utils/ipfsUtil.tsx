import Link from "next/link";
// import { removePrefix } from "../modules/Utils/ipfsUtil";
import React from "react";
import eye2 from "../public/eye2.webp";
import Image from "next/image";

interface ReviewCardProps {
  metaData: {
    amount: number,
    current_token_data: {
      cdn_asset_uris: string[] | null,
      current_collection: {
        uri: string,
        max_supply: number,
        description: string,
        collection_name: string,
        collection_id: string,
        creator_address: string,
      },
      description: string,
      token_data_id: string,
      token_name: string,
      token_properties: any,
      token_standard: string,
      token_uri: string,
    },
  } | null;
  MyReviews?: boolean;
  // review?: ReviewCreated;
  onReviewDeleted?: () => void;
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
}) => {
  const [imageSrc, setImageSrc] = React.useState<string | null>(null);
  React.useEffect(() => {
    if (
      metaData &&
      metaData.current_token_data &&
      metaData.current_token_data.token_uri
    ) {
      fetch(metaData.current_token_data.token_uri)
        .then((response) => response.json())
        .then((jsonData: any) => {
          // Assuming there's an "image" property in the JSON containing the image URL
          const imageUrl = jsonData.image;
          setImageSrc(imageUrl);
        })
        .catch((error) => {
          console.error(
            `Error fetching token URI (${metaData.current_token_data.token_uri}): ${error}`
          );
        });
    }
  }, [metaData]);

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
    <div className="w-full">
      {/* <Link href={`/reviews/${metaData.domainName.replace(/^https:\/\//, '')}`}> */}
      <div className="w-full h-full rounded-lg border border-gray-500 p-2">
        <div>
          <div className="lg:flex m:flex justify-start gap-4">
            <div className="">
              {/* <img
                      alt="alt"
                      src={`${
                        "https://cloudflare-ipfs.com/ipfs"
                      }/${removePrefix(metaData?.logoHash)}`}
                      className=""
                      width="80"
                      height="80"
                    /> */}
              {imageSrc ? (
                <Image
                  src={imageSrc}
                  alt={metaData?.current_token_data.token_name}
                  width={80}
                  height={80}
                />
              ) : (
                <div className="w-80 h-80 bg-gray-300"></div>
              )}
            </div>
            <div className="w-full">
              <h3 className="leading-12 mb-2 text-white">
                <div className="lg:flex md:flex justify-between">
                  <div className="text-xl font-bold">
                    {metaData.current_token_data.token_name}
                  </div>
                </div>
              </h3>

              <div className="rounded-xl">
                <div className="text-sm text-white text-start flex mt-2">
                  <div className="">
                    {metaData.current_token_data.description}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* </Link> */}
    </div>
  );
};

export default NftdataCard;
