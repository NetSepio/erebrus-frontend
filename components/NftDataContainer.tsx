
"use client";
import React from "react";
import NftdataCard from "./NftdataCard";
import Link from "next/link";
// import { useEffect, useState } from "react";

interface MyReviewContainerProps {
  metaDataArray: any[];
  MyReviews?: boolean;
  selectCollection: any;
  chainSymbol:string;
}

const NftdataContainer: React.FC<MyReviewContainerProps> = ({
  metaDataArray,
  MyReviews = false,
  selectCollection,
   chainSymbol,
}) => {
  const handleReviewDeleted = () => {
    window.location.reload();
  };

  // useEffect(() => {
  //   const call = () => {
  //     console.log("metaDataArray", metaDataArray);
  //   };
  //   call();
  // }, []);

  const handleClick = (
    collection_id: string,
    token_name: string,
    token_uri: string
  ) => {
    // Call the function passed as prop to change parent state
    selectCollection(collection_id, token_name, token_uri);
  };
  const renderNoReviewsFound = () => (
    <div className="w-full text-center py-20">
      <h2 className="text-4xl font-bold text-white">No Subscription</h2>
      <div className="bg-blue-500 text-white font-bold py-4 px-6 rounded-lg w-1/5 mx-auto my-20">
        <Link href="/plans">Try our free trial now</Link>
      </div>
    </div>
  );

  return (
    <>
      <div
        // className="mx-auto px-4 min-h-screen"
        // style={{ overflowY: "auto", maxHeight: "500px" }}
      >
        {metaDataArray?.length === 0 ? (
          // renderNoReviewsFound()
          <></>
        ) : (
          <div
            // style={{
            //   display: "grid",
            //   gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
            //   gap: "2rem",
            // }}
          >
            {metaDataArray?.map((metaData, index) => (
              <div
                key={index}
                className="py-2 flex"
                onClick={() =>
                  handleClick(
                    metaData.current_token_data.token_data_id,
                    metaData.current_token_data.token_name,
                    metaData.current_token_data.token_uri
                  )
                }
              >
               <NftdataCard
                  metaData={metaData}
                  MyReviews={MyReviews}
                  onReviewDeleted={handleReviewDeleted}
                  chainSymbol={chainSymbol} // Pass the chainSymbol prop here
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default NftdataContainer;