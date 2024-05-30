import React, { useEffect, useState} from "react";
import Link from "next/link";
import Cookies from "js-cookie";
const EREBRUS_GATEWAY_URL = process.env.NEXT_PUBLIC_EREBRUS_BASE_URL;

const Plans = () => {

  const [trialbuytrue, settrialbuytrue] = useState(false);

  const trialbuy = async() =>{
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
              setTimeout(()=>{
                  window.location.href="/subscription";
              },3000)
        }

      } catch (error) {
        console.error("Error:", error);
      } finally {
      }
  }

    return(
      <>
      <div className="mt-10 mx-auto min-h-screen max-w-7xl">
<div className="text-center text-4xl text-white">Pay for what you use</div>
      
              <div className="lg:flex mt-10 mx-auto justify-center">

                        <div className="relative p-2 lg:w-2/5">
                          <div
                            className="relative rounded-3xl shadow dark:bg-gray-700 rounded-3xl mx-auto"
                            style={{
                              backgroundColor: "#202333",
                              border: "1px solid #0162FF",
                            }}
                          >
                            
                            <section className="mt-14">
                              <div className="mx-auto max-w-3xl">
                                <div className="w-full mx-auto px-10 pb-10">
                                  
                                  <h1 className="w-3/4 mx-auto mb-2 text-4xl font-semibold leading-none tracking-normal text-gray-100 md:text-3xl md:tracking-tight">
                                    <span className="text-white" style={{color: '#5696FF'}}>
                                    NFT
                                    </span>
                                  </h1>
                                  <h1 className="w-3/4 mx-auto text-4xl font-semibold leading-none tracking-normal text-gray-100 md:text-3xl md:tracking-tight">
                                    <span className="text-white">
                                    1.11 SUI/ 3 month
                                    </span>
                                  </h1>
                            
                                  <h1 className="mt-4 w-3/5 ml-10 font-bold leading-none tracking-normal rounded-full py-2 px-4 text-sm text-black" style={{backgroundColor:'#E3EEFF'}}>
                                  Early Node Operator Access
                                  </h1>

                                  <h1 className="mt-4 w-2/5 ml-10 font-bold leading-none tracking-normal rounded-full py-2 px-4 text-sm text-black" style={{backgroundColor:'#E3EEFF'}}>
                                  80 NFTs available
                                  </h1>

                                  <div className="text-left text-white mt-10 w-3/4 mx-auto">
                                  &#x2022; Limited collection of only 111<br></br>
                                  &#x2022; Tradable with VPN access benefits<br></br>
                                  &#x2022; Unlimited Clients
                                  </div>

                                      <div className="flex-col gap-4 mr-4">

                                        <div className="text-center lg:w-1/2 mt-20 mx-auto">
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

                        <div className="relative p-2 lg:w-2/5">
                          <div
                            className="relative rounded-3xl shadow dark:bg-gray-700 rounded-3xl mx-auto"
                            style={{
                              backgroundColor: "#202333",
                              border: "1px solid #0162FF",
                            }}
                          >
                        
                            <section className="mt-14">
                              <div className="mx-auto max-w-3xl">
                                <div className="w-full mx-auto px-10 pb-10">

                                <h1 className="w-3/4 mx-auto mb-2 text-4xl font-semibold leading-none tracking-normal text-gray-100 md:text-3xl md:tracking-tight">
                                    <span className="text-white" style={{color: '#5696FF'}}>
                                    Standard 
                                    </span>
                                  </h1>
                                  <h1 className="w-3/4 mx-auto text-4xl font-semibold leading-none tracking-normal text-gray-100 md:text-3xl md:tracking-tight">
                                    <span className="text-white">
                                    1.11 SUI/ 3 month
                                    </span>
                                  </h1>

                                  <h1 className="mt-4 w-2/5 ml-10 font-bold leading-none tracking-normal rounded-full py-2 px-4 text-sm text-black" style={{backgroundColor:'#E3EEFF'}}>
                                  Free trial for 7 days
                                  </h1>

                                  <h1 className="mt-4 w-1/3 ml-10 font-bold leading-none tracking-normal rounded-full py-2 px-4 text-sm text-black" style={{backgroundColor:'#E3EEFF'}}>
                                  No credit card
                                  </h1>

                                  <div className="text-left text-white mt-10 w-2/3 mx-auto">
                                  &#x2022; Free trial for 7 days<br></br>
                                  &#x2022; Pay by SUI<br></br>
                                  &#x2022; Up to 5 options, more to come.<br></br>
                                  &#x2022; Multiple tiers
                                  </div>

                                      <div className="flex-col gap-4 mr-4 mt-10">

                                        <div className="text-center lg:w-1/2 mt-14 mx-auto">
                                          <div className="mb-6 py-3 px-8 text-md text-white font-semibold rounded-full w-full sm:mb-0"
                                          style={{
                                            backgroundColor: "#0162FF",
                                            // border:'solid 1px #0162FF',
                                          }}>
                                            {/* <Link
                                              href="/buy"
                                            >
                                              Start free trial
                                            </Link> */}
                                            <button
                                              onClick={trialbuy}
                                            >
                                              Start free trial
                                            </button>
                                          </div>
                                        </div>

                                      </div>
                                </div>
                              </div>
                            </section>
                          </div>
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