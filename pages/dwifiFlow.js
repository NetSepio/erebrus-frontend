"use client";
import React from "react";
import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Page = () => {
  const [name, setname] = useState("");
  const [ssid, setssid] = useState("");
  const [location, setlocation] = useState("");
  const [password, setpassword] = useState("");
  const [wallet, setwallet] = useState("");
  const [type, settype] = useState("");

  const [showPassword, setShowPassword] = useState(true);
  const [showPopup, setShowPopup] = useState(false);

  // Handler function for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Gather form data
    const formData = {
      node_name: name,
      location: location,
      wifi_password: password,
      wallet_address: wallet,
      node_type: type,
      ssid: ssid
    };

    try {
      // Send POST request to API
      const response = await fetch(
        "https://dev.gateway.erebrus.io/api/v1.0/registernode",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      // Handle successful response
      const result = await response.json();
      console.log("Form submitted successfully:", result);
      // You can add any success message or redirection here

      // Reset form fields
      setname("");
      setlocation("");
      setpassword("")
      setwallet("");
      settype("");
      setssid("");

      // Show success popup
      setShowPopup(true);

      // Hide success popup after 3 seconds
      setTimeout(() => {
        setShowPopup(false);
      }, 3000);
    } catch (error) {
      console.error("Error submitting form:", error);
      // You can add error handling here
    }
  };

  return (
    <div>
      <section
        class="pt-20 pb-10"
        style={{
          backgroundImage: `url(/dwifi.png)`,
          backgroundSize: "cover",
        }}
      >
        <div className="text-white text-4xl text-center mb-10">
          Register your ÐWi-Fi node
        </div>
        <div
          style={{ backgroundColor: "white" }}
          className="w-1/2 mx-auto p-10 rounded-3xl text-black mb-20"
        >
          <form onSubmit={handleSubmit}>
            <div className="mt-10 text-xl">Node Name</div>
            <input
              type="text"
              // placeholder="Game name"
              required
              value={name}
              onChange={(e) => setname(e.target.value)}
              className="mt-2 shadow border appearance-none rounded-xl w-full py-4 px-6 text-gray-200 leading-tight focus:outline-none focus:shadow-outline"
              style={{ color: "black", borderColor: "#0162FF" }}
            />

<div className="mt-10 text-xl">SSID</div>
            <input
              type="text"
              required
              value={ssid}
              onChange={(e) => setssid(e.target.value)}
              className="mt-2 shadow border appearance-none rounded-xl w-full py-4 px-6 text-gray-200 leading-tight focus:outline-none focus:shadow-outline"
              style={{ color: "black", borderColor: "#0162FF" }}
            />

            <div className="w-full">
              <div className="mt-10 text-xl">Location</div>
              <input
                type="text"
                // placeholder="Game name"
                value={location}
                onChange={(e) => setlocation(e.target.value)}
                className="mt-2 shadow border appearance-none rounded-xl w-full py-4 px-6 text-gray-200 leading-tight focus:outline-none focus:shadow-outline"
                style={{ color: "black", borderColor: "#0162FF" }}
              />

              <div className="mt-10 text-xl">Wi-Fi Password</div>
              <div className="flex justify-between gap-4 rounded-xl mt-2" style={{ border: "1px solid #0162FF" }}>
              <input
                type={showPassword ? "text" : "password"}
                // placeholder="Game name"
                value={password}
                onChange={(e) => setpassword(e.target.value)}
                className="appearance-none rounded-xl w-full px-6 text-gray-200 leading-tight focus:outline-none focus:shadow-outline"
                style={{ color: "black"}}
              />
              <button
                  type="button"
                  className="px-3 py-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <img src="/nopass.png" className="w-8"/> : <img src="/pass.png" className="w-8"/> }
                </button>
                </div>
            </div>

              <div className="w-full">
                <div className="mt-10 text-xl">Wallet Address</div>
                <input
                  type="text"
                  // placeholder="Game name"
                  required
                  value={wallet}
                  onChange={(e) => setwallet(e.target.value)}
                  className="mt-2 shadow border appearance-none rounded-xl w-full py-4 px-6 text-gray-200 leading-tight focus:outline-none focus:shadow-outline"
                  style={{ color: "black", borderColor: "#0162FF" }}
                />
              </div>
            <div className="w-full">
              <div className="mt-10 text-xl">Node Type</div>
              <select
                value={type}
                onChange={(e) => settype(e.target.value)}
                className="mt-2 shadow border appearance-none rounded-xl w-full py-4 px-6 text-black leading-tight focus:outline-none focus:shadow-outline"
                style={{ color: "black", borderColor: "#0162FF" }}
              >
                <option value="" disabled>
                  Select Type
                </option>
                <option value="Public">Public</option>
                <option value="Private">Private</option>
                <option value="Business">Business</option>
              </select>
            </div>

            <button
              style={{ backgroundColor: "#0162FF" }}
              className="mt-14 mb-10 py-3 rounded-xl w-full text-white text-lg"
            >
              Register Now
            </button>
          </form>
        </div>
      </section>

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 text-black">
          <div className="bg-white p-8 rounded-xl shadow-lg text-center">
            <h2 className="text-2xl font-bold mb-4">Success!</h2>
            <p>Your Node has been registered successfully.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Page;
