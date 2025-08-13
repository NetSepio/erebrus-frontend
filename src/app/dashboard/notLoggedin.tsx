import React from "react";
import { AuthButton } from "@/components/AuthButton";

const NotLoggedIn = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4">
      <h3 className="text-center text-2xl md:text-3xl lg:text-4xl font-extrabold text-white mb-6 tracking-tight leading-snug drop-shadow-lg">
        Subscribe and Unlock Full Access
        <br />
        <span className="text-blue-400">Connect and Verify to Get Started</span>
      </h3>
      <div className="flex items-center gap-4">
        <appkit-button />
        <AuthButton />
      </div>
    </div>
  );
};

export default NotLoggedIn;
