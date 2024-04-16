import React, { useEffect, useState } from "react";
import Link from "next/link";
import Cookies from "js-cookie";

const Plans = () => {
  const EREBRUS_GATEWAY_URL = process.env.NEXT_PUBLIC_EREBRUS_BASE_URL;
  const [trialbuytrue, settrialbuytrue] = useState(false);

  const trialbuy = async () => {
    const auth = Cookies.get("erebrus_token");
    try {
      const response = await fetch(
        `${EREBRUS_GATEWAY_URL}api/v1.0/subscription/trial`,
        {
          method: "POST",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth}`,
          },
          // body: jsonData,
        }
      );

      if (response.status === 200) {
        const responseData = await response.json();
        console.log("trial subsc response", responseData);
        settrialbuytrue(true);
        // for alert
        setTimeout(() => {
          window.location.href = "/subscription";
        }, 3000)
      }

    } catch (error) {
      console.error("Error:", error);
    } finally {
    }
  }
  return (
    <>
      <div className="flex mt-10 mx-auto min-h-screen max-w-6xl">

        <div className="relative p-4 w-full">
          <div
            className="relative rounded-3xl shadow dark:bg-gray-700 rounded-3xl mx-auto"
            style={{
              backgroundColor: "#202333",
              border: "1px solid #0162FF",
            }}
          >

            <section className="mt-14">
              <div className="mx-auto max-w-3xl">
                <div className="w-full mx-auto text-center px-10 pb-10">
                  <h1 className="text-4xl font-semibold leading-none tracking-normal text-gray-100 md:text-3xl md:tracking-tight">
                    <span className="text-white text-center">
                      111 NFT Mint
                    </span>
                  </h1>

                  <div className="text-left text-white mt-10 w-3/4 mx-auto">
                    &#x2022; Erebrus Trial package<br></br><br></br>
                    &#x2022; Comes with a unique NFT from a
                    limited collection of only 111 supply<br></br><br></br>
                    &#x2022; Utility NFT, tradable on marketplaces,
                    VPN usage tied with NFT ownership<br></br><br></br>
                    &#x2022; Unlimited client<br></br><br></br>
                    &#x2022; Only 1.11 SOL for a 12 month trial
                  </div>



                  <div className="flex-col gap-4 mr-4">

                    <div className="text-center w-1/2 mt-16 mx-auto">
                      <div className="mb-6">
                        <Link
                          style={{
                            backgroundColor: "#0162FF",
                          }}
                          href="/mint"
                          className="py-3 mb-2 px-16 text-md text-white font-semibold rounded-full w-full sm:mb-0 hover:bg-green-200 focus:ring focus:ring-green-300 focus:ring-opacity-80"
                        >
                          Mint NFT
                        </Link>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>

        <div className="relative p-4 w-full">
          <div
            className="relative rounded-3xl shadow dark:bg-gray-700 rounded-3xl mx-auto"
            style={{
              backgroundColor: "#202333",
              border: "1px solid #0162FF",
            }}
          >

            <section className="mt-14">
              <div className="mx-auto max-w-3xl">
                <div className="w-full mx-auto text-center px-10 pb-10">
                  <h1 className="text-4xl font-semibold leading-none tracking-normal text-gray-100 md:text-3xl md:tracking-tight">
                    <span className="text-white text-center">
                      $9.99/month
                    </span>
                  </h1>

                  <div className="text-left text-white mt-10 w-2/3 mx-auto">
                    &#x2022; Free trial for 7 days<br></br><br></br>
                    &#x2022; Pay by SOL, crytocurrency or Fiat<br></br><br></br>
                    &#x2022; Up to 5 options, more to come. <br></br> <br></br>
                    &#x2022;Multiple tiers
                  </div>
                  <div className="flex-col gap-4 mr-4 mt-10">

                    <div className="text-center w-1/2 mt-40 mx-auto">
                      <div className="mb-6">
                       <Link
                          style={{
                            backgroundColor: "#0162FF",
                          }}
                          href="/freetrail"
                          className="py-3 mb-2 px-8 text-md text-white font-semibold rounded-full w-full sm:mb-0 hover:bg-green-200 focus:ring focus:ring-green-300 focus:ring-opacity-80"
                        > 
                        <button onClick={trialbuy}>
                            Start free trial
                          </button>
                       </Link>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>

      {trialbuytrue &&
        <div className="fixed z-50 top-0 w-full">
          <div className="bg-blue-100 text-blue-700 px-4 py-3" role="alert">
            <p className="font-bold">Successfully Trial Subscription Taken!</p>
            <p className="text-sm">You are redirected to subscription page to view your current subscription plan and to create clients.</p>
          </div>
        </div>
      }
    </>
  )

}

export default Plans;