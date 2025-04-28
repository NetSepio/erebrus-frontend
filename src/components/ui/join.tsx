import React from 'react';
import { Vortex } from './vortex';

const ErebrusSection = () => {
  return (
    <Vortex 
    particleCount={700}
    baseHue={220}
    backgroundColor="#000000"
    baseRadius={1}
    rangeRadius={2}
    baseSpeed={0.1}
    rangeSpeed={1.5}
    containerClassName="relatuve inset-0"
    > 
    <div className="flex items-center justify-center min-h-screen w-full bg-gblack text-white p-6">
      <div className="flex flex-col items-center justify-center max-w-3xl text-center relative p-8">
        {/* Glow effect */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-48 h-48 bg-blue-400 opacity-10 rounded-full blur-3xl"></div>
        
        {/* Logo section */}
        <div className="relative mb-10 flex flex-col items-center">
          {/* Hexagon logo */}
          <div className="w-20 h-20 mb-3 flex items-center justify-center bg-gradient-to-br from-blue-400 to-blue-700 shadow-lg shadow-blue-500/20" 
               style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}>
            <span className="text-3xl font-bold text-white">E</span>
          </div>
          
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
            Erebrus
          </h2>
          
          <p className="text-sm text-gray-400 mt-1">
            powered by NetSepio
          </p>
        </div>
        
        {/* Main heading */}
        <h1 className="text-4xl md:text-5xl font-bold mb-8 bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
          Join the Movement. Get Started Now.
        </h1>
        
        {/* Buttons */}
        <div className="flex flex-wrap gap-6 justify-center mt-4">
          <button className="flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-500/10 border border-blue-500/30 text-white font-semibold transition-all duration-300 hover:bg-blue-500/20 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/10">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <path d="M14.31 8l5.74 9.94M9.69 8h11.48M7.38 12l5.74-9.94M9.69 16L3.95 6.06M14.31 16H2.83M16.62 12l-5.74 9.94"></path>
            </svg>
            Discord
          </button>
          
          <button className="flex items-center gap-2 px-6 py-3 rounded-lg bg-blue-500/10 border border-blue-500/30 text-white font-semibold transition-all duration-300 hover:bg-blue-500/20 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/10">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M21.198 2.433a2.242 2.242 0 0 0-1.022.215l-8.609 3.33c-2.068.8-4.133 1.598-5.724 2.21a405.15 405.15 0 0 1-2.849 1.09c-.42.147-.99.332-1.473.901-.728.968.193 1.798.919 2.286 1.61.516 3.275 1.009 4.654 1.472.509 1.793.997 3.592 1.48 5.388.16.36.506.494.864.498l-.002.018s.281.028.555-.038a2.1 2.1 0 0 0 .933-.517c.345-.324 1.28-1.244 1.811-1.764l3.999 2.952.032.018s.442.311 1.09.317c.384.003.804-.158 1.016-.43.463-.545.49-1.24.42-1.887-.09-.95-1.16-4.176-1.587-5.65l6.182-3.846a2.25 2.25 0 0 0 1.023-1.93c-.01-1.036-.947-1.875-1.985-1.9z"/>
            </svg>
            Telegram
          </button>
        </div>
      </div>
    </div>
    </Vortex>
  );
};

export default ErebrusSection;