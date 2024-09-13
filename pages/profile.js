"use client"
import Cookies from "js-cookie";
import axios from "axios";
import React, { useEffect, useState, ChangeEvent, FormEvent } from "react";
import { NFTStorage } from "nft.storage";
const API_KEY = process.env.NEXT_PUBLIC_STORAGE_API;
const client = new NFTStorage({ token: API_KEY });
const REACT_APP_GATEWAY_URL = process.env.NEXT_PUBLIC_EREBRUS_GATEWAY_URL;

const Profile = () => {
  const [loading, setLoading] = useState(false);
  const [profileset, setprofileset] = useState(true);
  const [profileData, setProfileData] = useState(null);
  const [msg, setMsg] = useState("");
  const [auth, setauth] = useState(true);
  const [loggedin, setloggedin] = useState(false);
  const [change, setchange] = useState(false);
  const [linkpopup, setlinkpopup] = useState(false);
  const [unlinkpopup, setunlinkpopup] = useState(false);
  const [magiclinkpopup, setmagiclinkpopup] = useState(false);
  const [gmail, setgmail] = useState("");
  const [code, setcode] = useState("");
  const [magicmessage, setmagicmessage] = useState("");
  const [magicloginmessage, setmagicloginmessage] = useState(false);
  const [idtoken, setidtoken] = useState("");

  const chainsym = Cookies.get("Chain_symbol");
  const walletaddr = Cookies.get("erebrus_wallet");

  const navigate = (path) => {
    window.location.href = path;
  };

  const border = {
    // backgroundColor: "#30385F",
    border: "1px solid #788AA3",
  };

  const button = {
    backgroundColor: "#0162FF",
  };

  const bgverify = {
    backgroundColor: "#141a31",
  };

  const text = {
    color: "#788AA3",
  };

  const initialFormData = {
    name: "",
    country: "",
    profilePictureUrl: "",
    discord: "",
    twitter: "",
  };

  const [formData, setFormData] = useState(initialFormData);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: value,
    }));
  };

  async function uploadImage(e) {
    e.preventDefault();
    try {
      setLoading(true);
      const blobDataImage = new Blob([e.target.files[0]]);
      const metaHash = await client.storeBlob(blobDataImage);
      setFormData({
        ...formData,
        profilePictureUrl: `ipfs://${metaHash}`,
      });
      console.log("profilePictureUrl", metaHash);
    } catch (error) {
      console.log("Error uploading file: ", error);
    } finally {
      setLoading(false);
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const auth = Cookies.get("erebrus_token");

    try {
      const formDataObj = new FormData();
      formDataObj.append("name", formData.name);
      formDataObj.append("country", formData.country);
      formDataObj.append("discord", formData.discord);
      formDataObj.append("twitter", formData.twitter);
      formDataObj.append("profilePictureUrl", formData.profilePictureUrl);

      // Convert FormData to JavaScript Object
      const formDataObject = {};
      formDataObj.forEach((value, key) => {
        formDataObject[key] = value;
      });

      // Convert JavaScript Object to JSON string
      const jsonData = JSON.stringify(formDataObject);

      const response = await fetch(`${REACT_APP_GATEWAY_URL}api/v1.0/profile`, {
        method: "PATCH",
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth}`,
        },
        body: jsonData,
      });

      if (response.status === 200) {
        setFormData(initialFormData);
        setMsg("success");
        setprofileset(true);
        // localStorage.setItem('submissionProfile', 'true');
      } else {
        setMsg("error");
      }
    } catch (error) {
      console.error("Error:", error);
      setMsg("error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchProfileData = async () => {
      setLoading(true);
      try {
        const auth = Cookies.get("erebrus_token");

        const response = await axios.get(
          `${REACT_APP_GATEWAY_URL}api/v1.0/profile`,
          {
            headers: {
              Accept: "application/json, text/plain, */*",
              "Content-Type": "application/json",
              Authorization: `Bearer ${auth}`,
            },
          }
        );

        if (response.status === 200) {
          setProfileData(response.data.payload);
          if(!response.data.payload.email)
          {
            setauth(false);
          }
          console.log(response.data);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfileData();
  }, [profileset, unlinkpopup, linkpopup, magiclinkpopup]);

  const wallet = Cookies.get("platform_wallet");

  const handleMagicLink = async() =>{
    const auth = Cookies.get("erebrus_token");

    const obj = {"email":gmail};
    const jsonData = JSON.stringify(obj);

    Cookies.set("magic_link", gmail , { expires: 7 });

    try {
      const response = await axios.post(`${REACT_APP_GATEWAY_URL}api/v1.0/account/generate-auth-id`, {
       ...obj
      },{headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        // Authorization: `Bearer ${auth}`,
      }});
  
      const responseData = await response.data;
      console.log('magic link response:', responseData);
      setmagicmessage(responseData.message);
    } catch (error) {
      console.error('magic link error:', error);
    }
  };

  const handleMagicLogin = async() =>{
    const auth = Cookies.get("erebrus_token");

    const obj = {"code":code,"emailId":gmail};
    const jsonData = JSON.stringify(obj);

    try {
      const response = await axios.post(`${REACT_APP_GATEWAY_URL}api/v1.0/account/paseto-from-magic-link`, {
       ...obj
      },{headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth}`,
      }});
  
      const responseData = await response.data;
      console.log('magic login response:', responseData);
      setmagicloginmessage(true);
    } catch (error) {
      console.error('magic login error:', error);
    }
  };

const CLIENT_ID = process.env.NEXT_PUBLIC_CLIENT_ID;
const REDIRECT_URI = process.env.NEXT_PUBLIC_REDIRECT_URI_PROFILE;
const CLIENT_SECRET= process.env.NEXT_PUBLIC_CLIENT_SECRET;


  const handleLoginClick = () => {
    const state = Math.random().toString(36).substring(7);
    const authUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=openid%20profile%20email&state=${state}`;
    window.location.href = authUrl;
  };

  const parseAuthorizationCode = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
  
    if (code) {
      localStorage.setItem("code",code)
      exchangeCodeForToken(code);
      console.log("code", code)
    }
  };
  
  const exchangeCodeForToken = async (code) => {
    const tokenEndpoint = 'https://www.googleapis.com/oauth2/v4/token';
  
    const tokenRequestBody = {
      code,
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      redirect_uri: REDIRECT_URI,
      grant_type: 'authorization_code',
    };
  
    try {
      const response = await fetch(tokenEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(tokenRequestBody).toString(),
      });
  
      const tokenData = await response.json();
  
      // Assuming id_token is present in tokenData
      const idToken = tokenData.id_token;
  
      // setpage("googlewalletboth");

      // Use idToken in another API call
      setidtoken(idToken);
      // await getgoogledata(idToken);
  
      handleTokenData(tokenData);
      console.log("token", tokenData);
    } catch (error) {
      console.error('Token exchange error:', error);
    }
  };
  
  
  const handleTokenData = (tokenData) => {
    window.history.replaceState({}, document.title, window.location.pathname);
  };
  
  
  useEffect(() => {
    parseAuthorizationCode();
  }, []);



  const handleremoveClick = async () => {
    const auth = Cookies.get("erebrus_token");

    try {
      const response = await axios.delete(`${REACT_APP_GATEWAY_URL}api/v1.0/account/remove-mail`,{headers: {
        Accept: "application/json, text/plain, */*",
        "Content-Type": "application/json",
        Authorization: `Bearer ${auth}`,
      }});
  
      const responseData = await response.data;
      console.log('Another API call response:', responseData);
      setunlinkpopup(false);
    } catch (error) {
      console.error('Another API call error:', error);
    }

    }

  useEffect(() => {
      const handleConnectWallet = async () => {
        const loggedin = Cookies.get("erebrus_token");
        // const auth = Cookies.get("google_token");
        if (loggedin) {
          setloggedin(true);
        }
      };
      handleConnectWallet();
    }, [change]);

    useEffect(() => {
      const timeoutId = setTimeout(() => {
        setMsg('');
      }, 3000); // 5 seconds in milliseconds
  
      return () => clearTimeout(timeoutId);
    }, [msg]);

    function removePrefix(url) {
        // Use the slice method to remove the first 7 characters
        return url.slice(7);
      }


      // Define a mapping of chain symbols to names and icons
const chainInfo = {
  apt: {
    name: 'Aptos',
    icon: '/aptosicon.png' // Replace with the actual path or URL
  },
  sui: {
    name: 'Sui',
    icon: '/suiicon.png' // Replace with the actual path or URL
  },
  evm: {
    name: 'Ethereum',
    icon: '/ethicon.png' // Replace with the actual path or URL
  },
  sol: {
    name: 'Solana',
    icon: '/solanaicon.png' // Replace with the actual path or URL
  }
};


const chainDetails = chainInfo[chainsym?.toLowerCase()] || { name: 'Unknown Chain', icon: '' };
  

  return (
    <div
      
    >
      <section className="h-screen">
        <div className="px-10 mx-auto">
          <div className="w-full mx-auto text-left w-full md:text-center">
        
        <div className="flex">

        {msg == "success" && (
                      <div className="text-center mx-auto">
                      <div className="">
                        <div
                          style={button}
                          className="flex gap-1 px-4 py-3 text-xs text-white font-semibold rounded-lg w-full sm:mb-0 hover:bg-green-200 focus:ring focus:ring-green-300 focus:ring-opacity-80"
                        >
                          {/* <Image src={tick} alt="" className="w-4 h-4"/> */}
                          Changes Saved
                        </div>
                      </div>
                    </div>
            )}
        </div>
            

            {!profileset && (
              <section className="pb-10 rounded-xl">
                <div className="px-24 mx-auto rounded-xl">
                  <div className="w-full mx-auto text-left py-10">
                    <h1 className="mt-10 text-4xl font-semibold leading-none tracking-normal text-gray-100 md:tracking-tight">
                      <span className="text-white">Change profile Info</span>
                    </h1>

                    <form
                      id="myForm"
                      className="rounded pt-10"
                      onSubmit={handleSubmit}
                    >
                      <div className="lg:flex md:flex justify-between">
                        <div className="flex items-center lg:justify-start md:justify-start justify-center mb-40 ml-10">
                          <div className="rounded-2xl h-36 w-36 ring-1 ring-black bg-gray-200">
                            {formData.profilePictureUrl ? (
                              <img
                                alt="alt"
                                src={`${"https://nftstorage.link/ipfs"}/${removePrefix(
                                  formData.profilePictureUrl
                                )}`}
                                className="rounded-2xl"
                                width="170"
                                height="170"
                              />
                            ) : (
                              <label
                                htmlFor="upload"
                                className="flex flex-col items-center gap-2 cursor-pointer mt-12"
                              >
                                <input
                                  id="upload"
                                  type="file"
                                  className="hidden"
                                  onChange={uploadImage}
                                  accept="image/*"
                                />
                                <svg
                                  xmlns="http://www.w3.org/2000/svg"
                                  className="h-10 w-10 fill-white stroke-indigo-500"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                  stroke-width="2"
                                >
                                  <path
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                                  />
                                </svg>
                              </label>
                            )}
                          </div>
                        </div>

                        <div className="mb-10 lg:w-3/4 md:w-3/4 mt-10">
                          <div className="lg:flex md:flex justify-between gap-4">
                            <div className="mb-10 w-1/2">
                              <input
                                type="text"
                                id="name"
                                style={border}
                                className="shadow border bg-black appearance-none rounded w-full py-4 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Your Name"
                                value={formData.name}
                                onChange={handleInputChange}
                                // required
                              />
                            </div>

                            <div className="mb-10 w-1/2">
                              <input
                                type="text"
                                id="country"
                                style={border}
                                className="shadow border bg-black appearance-none rounded w-full py-4 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Country"
                                value={formData.country}
                                onChange={handleInputChange}
                                // required
                              />
                            </div>
                          </div>

                          <div className="lg:flex md:flex justify-between gap-4">
                            <div className="mb-0 w-1/2">
                              <input
                                type="text"
                                id="discord"
                                style={border}
                                className="shadow border bg-black appearance-none rounded w-full py-4 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Discord"
                                value={formData.discord}
                                onChange={handleInputChange}
                                // required
                              />
                            </div>

                            <div className="mb-0 w-1/2">
                              <input
                                type="text"
                                id="twitter"
                                style={border}
                                className="shadow border bg-black appearance-none rounded w-full py-4 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline"
                                placeholder="Twitter"
                                value={formData.twitter}
                                onChange={handleInputChange}
                                // required
                              />
                            </div>
                          </div>

                          <div className="text-center pt-10 w-1/2">
                        <div className="pb-10 space-x-0 md:space-x-2 md:mb-8">
                          <button
                            style={button}
                            type="submit"
                            value="submit"
                            className="px-14 py-3 mb-2 text-lg text-white font-semibold rounded-lg w-full sm:mb-0 hover:bg-green-200 focus:ring focus:ring-green-300 focus:ring-opacity-80"
                          >
                            Change details
                          </button>
                        </div>
                      </div>

                        </div>
                      </div>
                      
                    </form>

                    {loading && (
        <div
        style={{ backgroundColor: "#040819D9" }}
        className='flex overflow-y-auto overflow-x-hidden fixed inset-0 z-50 justify-center items-center w-full max-h-full'
        id='popupmodal'
      >
        <div className='relative p-4 lg:w-1/5 w-full max-w-2xl max-h-full'>
          <div className='relative rounded-lg shadow'>
            <div className='flex justify-center gap-4'>
              <img
                className='w-12 animate-spin duration-[3000] h-12'
                src='/Loadingerebrus.png'
                alt='Loading icon'
              />
  
              <span className='text-white mt-2'>Loading...</span>
            </div>
          </div>
        </div>
      </div>
      )}

                    {msg == "error" && (
                      <p className="text-red-500">
                        There is some issue in updating your profile. Try again
                        after sometime.
                      </p>
                    )}
                  </div>
                </div>
              </section>
            )}

            {profileset && (
              <>
               <section className="pb-0 rounded-xl">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="pt-8 sm:pt-16 flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <h1 className="text-3xl sm:text-4xl font-semibold text-gray-100 mb-4 sm:mb-0">
            Profile information
          </h1>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-black text-sm">
            <div 
              className="px-2 py-1 rounded flex items-center space-x-1"
              style={{ backgroundColor: '#8EB9FF' }}
            >
              {chainDetails.icon && (
                <img 
                  src={chainDetails.icon} 
                  alt={`${chainDetails.name} icon`} 
                  className="w-6 h-6" 
                />
              )}
              <span className="pr-2">{chainDetails.name}</span>
            </div>
            <div 
              className="px-4 py-1 rounded" 
              style={{backgroundColor:'#8EB9FF'}}
            >
              {walletaddr?.slice(0, 4)}...{walletaddr?.slice(-4)}
            </div>
          </div>
        </div>

        <div className="w-full mx-auto text-left mt-8">
          <form id="myForm" className="rounded">
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-1/4">
                <div className="flex items-center justify-center mb-6 lg:mb-0">
                  {profileData?.profilePictureUrl ? (
                    <div className="rounded-2xl h-36 w-36">
                      <img
                        alt="Profile"
                        src={`${"https://nftstorage.link/ipfs"}/${removePrefix(profileData?.profilePictureUrl)}`}
                        className="rounded-2xl object-cover w-full h-full"
                      />
                    </div>
                  ) : (
                    <div className="rounded-2xl h-36 w-36 ring-offset-2 ring-1 ring-black bg-gray-200">
                      <img
                        alt="Default Profile"
                        src="https://thumbs.dreamstime.com/b/female-user-profile-avatar-woman-character-screen-saver-emotions-website-mobile-app-design-vector-199001739.jpg"
                        className="rounded-2xl mx-auto object-cover w-full h-full"
                      />
                    </div>
                  )}
                </div>
              </div>

              <div className="lg:w-3/4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div
                    style={border}
                    className="mb-4 shadow border appearance-none rounded w-full py-4 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    {profileData?.name || "Name"}
                  </div>

                  <div
                    style={border}
                    className="mb-4 shadow border appearance-none rounded w-full py-4 px-3 text-gray-200 leading-tight focus:outline-none focus:shadow-outline"
                  >
                    {profileData?.country || "Country"}
                  </div>

                  <div
                    style={border}
                    className="mb-4 rounded w-full py-4 px-3 text-gray-200 leading-tight"
                  >
                    {profileData?.discord || "Discord"}
                  </div>

                  <div
                    style={border}
                    className="mb-4 rounded w-full py-4 px-3 text-gray-200 leading-tight"
                  >
                    {profileData?.twitter || "Twitter"}
                  </div>
                </div>

                <div className="text-center mt-6">
                  <button
                    style={button}
                    onClick={() => setprofileset(false)}
                    className="px-14 py-3 mb-2 text-lg text-white font-semibold rounded-lg w-full sm:w-auto hover:bg-green-200 focus:ring focus:ring-green-300 focus:ring-opacity-80"
                  >
                    Edit Profile
                  </button>
                </div>
              </div>
            </div>
          </form>

          {loading && (
            <div
              style={{ backgroundColor: "#040819D9" }}
              className='flex overflow-y-auto overflow-x-hidden fixed inset-0 z-50 justify-center items-center w-full max-h-full'
              id='popupmodal'
            >
              <div className='relative p-4 w-full max-w-md max-h-full'>
                <div className='relative rounded-lg shadow'>
                  <div className='flex justify-center items-center gap-4'>
                    <img
                      className='w-12 h-12 animate-spin'
                      src='/Loadingerebrus.png'
                      alt='Loading icon'
                    />
                    <span className='text-white'>Loading...</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>                
              </>
            )}

{ linkpopup && (
<div style={{backgroundColor:'#222944E5'}} className="flex overflow-y-auto overflow-x-hidden fixed inset-0 z-50 justify-center items-center w-full max-h-full" id="popupmodal">
    <div className="relative p-4 lg:w-1/2 w-full max-w-2xl max-h-full">
        <div className="relative rounded-lg shadow" style={{backgroundColor:'#37406D'}}>
            <div className="flex items-center justify-end p-4 md:p-5 rounded-t text-white">
                <h3 className="text-2xl font-semibold">
                Link an email account
                </h3>
                <button 
                    onClick={()=>{setlinkpopup(false)}}
                    type="button" 
                    className="text-gray-900 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                >
                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                    <span className="sr-only">Close modal</span>
                </button>
            </div>

            {/* <Image src={googletop} alt="" className="mx-auto"/> */}

            <div className="pb-4 pt-10">
            <button className="text-black bg-white p-2 rounded-lg w-1/2" onClick={handleLoginClick}>
                <div className="flex gap-2 justify-center">
                  <img src="/google.png" className="w-5 h-5 mt-0.5"/>
                <div>Using Google</div>
                </div>
            </button>
          </div>

          <div className="pb-4">
            <button className="text-black bg-white p-2 rounded-lg w-1/2" onClick={()=>{setlinkpopup(false);setmagiclinkpopup(true);}}>
                <div className="flex gap-2 justify-center">
                <div>Using Magic Link</div>
                </div>
            </button>
          </div>

          <div className="pb-10">
            <button className="text-white border p-2 rounded-lg w-1/2" onClick={()=>{setlinkpopup(false)}}>
            <div className="flex gap-2 justify-center">
                <div>Skip</div>
                </div>
            </button>
          </div>

        </div>          
    </div>
</div>
)}


{ unlinkpopup && (
<div style={{backgroundColor:'#222944E5'}} className="flex overflow-y-auto overflow-x-hidden fixed inset-0 z-50 justify-center items-center w-full max-h-full" id="popupmodal">
    <div className="relative p-4 lg:w-1/2 w-full max-w-2xl max-h-full">
        <div className="relative rounded-lg shadow" style={{backgroundColor:'#37406D'}}>
            <div className="flex items-center justify-end p-4 md:p-5 rounded-t text-white">
                <h3 className="text-2xl font-semibold">
                Unlink Email account
                </h3>
                <button 
                    onClick={()=>{setunlinkpopup(false)}}
                    type="button" 
                    className="text-gray-900 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                >
                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                    <span className="sr-only">Close modal</span>
                </button>
            </div>

            {/* <Image src={googletop} alt="" className="mx-auto"/> */}

            <div className="pb-4 pt-10">
            <button className="text-black bg-white p-2 rounded-lg w-1/2" onClick={handleremoveClick}>
                <div className="flex gap-2 justify-center">
                <div>Unlink Now</div>
                </div>
            </button>
          </div>

          <div className="pb-10">
            <button className="text-white border p-2 rounded-lg w-1/2" onClick={()=>{setunlinkpopup(false)}}>
            <div className="flex gap-2 justify-center">
                <div>Skip</div>
                </div>
            </button>
          </div>

        </div>          
    </div>
</div>
)}

{ magiclinkpopup && (
<div style={{backgroundColor:'#222944E5'}} className="flex overflow-y-auto overflow-x-hidden fixed inset-0 z-50 justify-center items-center w-full max-h-full" id="popupmodal">
    <div className="relative p-4 lg:w-1/2 w-full max-w-2xl max-h-full">
        <div className="relative rounded-lg shadow" style={{backgroundColor:'#37406D'}}>
            <div className="flex items-center justify-end p-4 md:p-5 rounded-t text-white">
                <h3 className="text-2xl font-semibold">
                Link an email account
                </h3>
                <button 
                    onClick={()=>{setmagiclinkpopup(false)}}
                    type="button" 
                    className="text-gray-900 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                >
                    <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                    </svg>
                    <span className="sr-only">Close modal</span>
                </button>
            </div>

            {/* <Image src={googletop} alt="" className="mx-auto"/> */}

            {!magicmessage && (

            <form
                    id="myForm"
                    className="rounded pt-10"
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleMagicLink();
                    }}
                  >

          <div className="pb-4">
                <input
                          type="email"
                          id="gmail"
                          style={border}
                          className="shadow border appearance-none rounded-lg w-1/2 py-3 px-4 text-gray-200 leading-tight focus:outline-none focus:shadow-outline"
                          placeholder="Enter your email address"
                          value={gmail}
                          onChange={(e) => setgmail(e.target.value)}
                          required
                        />
          </div>

          <div className="pb-10">
            <button className="text-white border p-2 rounded-lg w-1/2"
            type="submit"
            value="submit">
            <div className="flex gap-2 justify-center">
                <div>Send Magic Link</div>
                </div>
            </button>
          </div>

          </form>
          )}

          {magicmessage && !magicloginmessage && (
            <>
            <div className="text-green-500 py-10 w-2/3 mx-auto">{magicmessage}! Please check your mail and enter code here or click the magic link.</div>
            <form
                    id="magicForm"
                    className="rounded pt-10"
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleMagicLogin();
                    }}
                  >

          <div className="pb-4">
                <input
                          type="text"
                          id="code"
                          style={border}
                          className="shadow border appearance-none rounded-lg w-1/2 py-3 px-4 text-gray-200 leading-tight focus:outline-none focus:shadow-outline"
                          placeholder="Enter the code"
                          value={code}
                          onChange={(e) => setcode(e.target.value)}
                          required
                        />
          </div>

          <div className="pb-10">
            <button className="text-white border p-2 rounded-lg w-1/2"
            type="submit"
            value="submit">
            <div className="flex gap-2 justify-center">
                <div>Link</div>
                </div>
            </button>
          </div>

          </form>
          </>
          )}

          {magicloginmessage && (
            <div className="py-10 text-green-500">Successfully Linked your account!!</div>
          )}

        </div>          
    </div>
</div>
)}

          </div>
        </div>
      </section>
    </div>
  );
};

export default Profile;
