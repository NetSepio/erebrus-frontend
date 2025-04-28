import React from "react";

const NotLoggedIn = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
            <h3 className="text-center text-2xl md:text-3xl lg:text-4xl font-extrabold text-white mb-6 tracking-tight leading-snug drop-shadow-lg">
                Subscribe and Unlock Full Access<br />
                <span className="text-blue-400">Log in to Get Started</span>
            </h3>
            <appkit-button />
        </div>
    );
};

export default NotLoggedIn;
