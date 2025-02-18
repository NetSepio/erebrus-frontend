import React from 'react';
import Cookies from 'js-cookie';

const chains = [
  { name: 'Ethereum', symbol: 'evm', icon: '/ethicon.webp', iconSize: 'w-6 h-6' },
  { name: 'Aptos', symbol: 'apt', icon: '/aptosicon.webp', iconSize: 'w-6 h-6' },
  { name: 'Solana', symbol: 'sol', icon: '/solanaicon.webp', iconSize: 'w-6 h-6' },
  // { name: 'Monad', symbol: 'monad', icon: '/monad.webp', iconSize: 'w-6 h-6' },
];

const ChainListItem = ({ name, symbol, icon, iconSize, onClick }) => (
  <li className="flex items-center justify-between p-2 rounded-full bg-gray-900">
    <button onClick={onClick} className="flex gap-2 items-center">
      <img src={icon} className={iconSize} alt={`${name} icon`} />
      <div>{name}</div>
    </button>
  </li>
);

const ChainList = ({ setHideFilter, setChainSymbol, setShowSignButton }) => {
  const handleChainClick = (symbol) => {
    setHideFilter(false);
    Cookies.set('Chain_symbol', symbol);
    setChainSymbol(symbol);
    setShowSignButton({
      eth: symbol === 'evm',
      sol: symbol === 'sol',
      aptos: symbol === 'apt',
      monad: symbol === 'monad',
    });
  };

  return (
    <ul className="space-y-4 mt-10">
      {chains.map((chain) => (
        <ChainListItem
          key={chain.symbol}
          name={chain.name}
          symbol={chain.symbol}
          icon={chain.icon}
          iconSize={chain.iconSize}
          onClick={() => handleChainClick(chain.symbol)}
        />
      ))}
    </ul>
  );
};

export default ChainList;
