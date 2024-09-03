import React from "react";
import dynamic from 'next/dynamic';

const DwifiMap = dynamic(() => import('../components/DwifiMap'), { ssr: false });

const Scan = () => {
  return (
    <div className="bg-gradient-to-b from-[#040819] via-[#092187] to-[#20253A] h-screen">
      <DwifiMap showCurrentLocation={ true } />
    </div>
  );
};

export default Scan;
