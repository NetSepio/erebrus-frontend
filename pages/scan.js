import React from "react";
import DwifiMap from "../components/DwifiMap";

const Scan = () => {
  return (
    <div className="bg-gradient-to-b from-[#040819] via-[#092187] to-[#20253A] h-screen">
      <DwifiMap showCurrentLocation={ true } />
    </div>
  );
};

export default Scan;
