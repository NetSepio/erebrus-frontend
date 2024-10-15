import { Connection, PublicKey } from '@solana/web3.js';
import { Metaplex } from '@metaplex-foundation/js';
import { AptosClient, TokenClient } from 'aptos';

const ALLOWED_COLLECTIONS = {
  sol: ['SMB Gen2', 'sharx by sharky.fi', 'Superteam Member NFT', 'Deanslist', 'SMB Gen3', "Erebrus Community NFT #001"],
  apt: ["Undying City Equipment Collection"]
};

const fetchUserNFTs = async (userAddress: string, chainSymbol: string) => {
  if (!userAddress) {
    console.log('No user address provided');
    return [];
  }

  console.log('Fetching NFTs for address:', userAddress);
  console.log('Chain symbol:', chainSymbol);

  try {
    if (chainSymbol === 'sol') {
      const connection = new Connection(process.env.NEXT_PUBLIC_SOLANA_RPC_URL);
      console.log('Connected to Solana network');

      let ownerPublicKey;
      try {
        ownerPublicKey = new PublicKey(userAddress);
      } catch (err) {
        console.error('Invalid Solana address:', userAddress);
        return [];
      }

      const metaplex = new Metaplex(connection);

      console.log('Fetching all NFTs for owner...');
      const userNFTs = await metaplex.nfts().findAllByOwner({ owner: ownerPublicKey });
      console.log('All user NFTs:', userNFTs);

      const filteredNFTs = userNFTs.filter(nft => 
        ALLOWED_COLLECTIONS.sol.includes(nft.name)
      ).map(nft => ({
        amount: 1,
        current_token_data: {
          token_name: nft.name,
          token_uri: nft.uri,
          description: nft.json?.description || '',
          token_data_id: nft.address.toString(),
          cdn_asset_uris: {
            cdn_image_uri: nft.json?.image || '',
          },
          collection: nft.collection?.address.toString(),
          symbol: nft.symbol,
        },
      }));

      console.log('Filtered Solana NFTs:', filteredNFTs);

      return filteredNFTs;

    } 
    else {
      console.log('NFT fetching for this chain not implemented yet');
      return [];
    }
  } catch (err) {
    console.error('Error fetching NFTs:', err);
    return [];
  }
};

export default fetchUserNFTs;