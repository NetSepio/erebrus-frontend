import React, { useState, useEffect, Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import Cookies from 'js-cookie';

interface ChainOption {
  name: string;
  symbol: string;
  icon: string;
}

const chainOptions: ChainOption[] = [
  { name: "Aptos", symbol: "apt", icon: "aptosicon" },
  { name: "Manta", symbol: "evm", icon: "mantaicon" },
  { name: "Peaq", symbol: "peaq", icon: "peaqicon" },
  { name: "Solana", symbol: "sol", icon: "solanaicon" },
  { name: "Sui", symbol: "sui", icon: "suiicon" },
  { name: "Google", symbol: "google", icon: "googleicon" },
];

interface ChainSelectorProps {
  onChainChange: (chainSymbol: string) => void;
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

const ChainSelector: React.FC<ChainSelectorProps> = ({ onChainChange }) => {
  const [selectedChain, setSelectedChain] = useState<ChainOption>(chainOptions[0]);

  useEffect(() => {
    const storedChain = Cookies.get("Chain_symbol");
    if (storedChain) {
      const foundChain = chainOptions.find(option => option.symbol === storedChain);
      if (foundChain) {
        setSelectedChain(foundChain);
        onChainChange(foundChain.symbol);
      }
    }
  }, [onChainChange]);

  const handleOptionSelect = (option: ChainOption) => {
    setSelectedChain(option);
    Cookies.set("Chain_symbol", option.symbol);
    onChainChange(option.symbol);
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-full bg-[#253776] px-10 py-2 text-sm font-semibold text-white shadow-sm hover:bg-[#1e2d5f]">
          <img src={`/${selectedChain.icon}.png`} className="w-6 h-6 mr-2" alt={selectedChain.name} />
          {selectedChain.name}
          <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-gradient-to-b from-[#20253A] to-[#424F7F] shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {chainOptions.map((option) => (
              <Menu.Item key={option.symbol}>
                {({ active }) => (
                  <button
                    className={classNames(
                      active ? 'bg-gray-900 text-white' : 'text-white',
                      'group flex items-center px-4 py-2 text-sm w-full'
                    )}
                    onClick={() => handleOptionSelect(option)}
                  >
                    <img
                      src={`/${option.icon}.png`}
                      className={`mr-3 h-5 w-5 ${option.icon === "suiicon" ? "ml-1" : ""}`}
                      aria-hidden="true"
                    />
                    {option.name}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default ChainSelector;