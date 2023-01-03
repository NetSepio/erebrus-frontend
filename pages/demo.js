import { useState, useEffect } from "react";
import { AnimatePresence, AnimateSharedLayout } from "framer-motion";
import axios from "axios";
import QRCode from "qrcode.react";

export default function FormResultPage() {
  const [formData, setFormData] = useState({
    name: "",
    tags: ["mobile"],
    email: "",
    enable: true,
    allowedIPs: ["0.0.0.0/0", "::/0"],
    address: ["10.0.0.1/24"],
    createdBy: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [qrCodeData, setQrCodeData] = useState(null);
  const [configData, setConfigData] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const handleEmail = (e) => {
    setFormData({
      ...formData,
      email: e.target.value,
      createdBy: e.target.value,
    });
  };

  const handleName = (e) => {
    setFormData({
      ...formData,
      name: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    let UUID;
    e.preventDefault();
    setLoading(true);
    try {
      // Make a POST request to your server
      await fetch("/api/createClient", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })
        .then((response) => response.json())
        .then((data) => {
          UUID = data.client.UUID;
        });

      // QR code data
      await fetch(`/api/getClientConfig?UUID=${UUID}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/config",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setQrCodeData(data);
        });

      // // Make another GET request to your server to get the data for the config file
      // const configResponse = await axios.get("/api/get-config-data");
      setConfigData(qrCodeData);

      // Show the result page
      setShowResult(true);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex mx-auto items-center justify-center">
      <AnimatePresence>
        <AnimateSharedLayout>
          {!showResult && (
            <div className="flex lg:flex-row flex-col justify-center items-center ">
              <h2 className="font-bold text-4xl lg:text-6xl mb-8 text-gray-200 lg:w-[50%] w-[75%] lg:mb-2 lg:text-left text-center">
                Create a VPN Subscription
              </h2>
              <div>
                <form onSubmit={handleSubmit}>
                  <div className="flex flex-col items-center">
                    <input
                      type="text"
                      name="name"
                      placeholder="Name"
                      onChange={handleName}
                      required
                      className="mb-8"
                    />
                    <input
                      type="text"
                      name="email"
                      placeholder="Email"
                      onChange={handleEmail}
                      required
                      className="mb-4"
                    />
                    <div className="mt-4">
                      <button
                        type="submit"
                        disabled={loading}
                        className="text-white bg-blue-500 font-bold py-2 px-4 rounded-lg"
                      >
                        Submit
                      </button>
                    </div>
                    {error && <p className="text-red-500">{error}</p>}
                  </div>
                </form>
              </div>
            </div>
          )}
          {showResult && (
            <div>
              <div className="flex justify-center"></div>
              <svg
                className="absolute top-0 left-0 text-white"
                width="48"
                height="48"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                onClick={() => setShowResult(false)}
              >
                <path
                  d="M20 11H7.8L13.6 5.2L12 4L4 12L12 20L13.6 18.8L7.8 13H20V11Z"
                  fill="currentColor"
                />
              </svg>
              {error && <p className="text-red-500">{error}</p>}
              {qrCodeData && (
                <div className="flex lg:flex-row flex-col justify-center items-center">
                  <h2 className="font-bold text-2xl lg:text-5xl lg:mb-2 text-gray-200 lg:w-[30%] w-[75%] text-center lg:text-left mb-6">
                    Scan QR using the WireGuard® app and activate tunnel or
                    download .conf file to start using VPN 🎉
                  </h2>
                  <div className="text-white ml-16 mr-2 lg:ml-0 lg:mr-0">
                    <QRCode value={qrCodeData} />
                    <div className="mt-8 -ml-8">
                      <a
                        href={`data:application/octet-stream,${encodeURIComponent(
                          qrCodeData
                        )}`}
                        download="vpn.conf"
                        className="bg-blue-500 text-white font-bold py-2 px-4 rounded-lg"
                      >
                        Download config file
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </AnimateSharedLayout>
      </AnimatePresence>
    </div>
  );
}
