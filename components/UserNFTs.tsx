import { Connection, PublicKey } from '@solana/web3.js';
import { Metaplex } from '@metaplex-foundation/js';

const COLLECTION_IDS = {
  DL_NFT: '5FusHaKEKjfKsmQwXNrhFcFABGGxu7iYCdbvyVSRe3Ri',
  SOLANA_MONKEY_BUSINESS_GEN2: 'SMBtHCCC6RYRutFEPb4gZqeBLUZbMNhRKaMKZZLHi7W',
  SOLANA_MONKEY_BUSINESS_GEN3: '8Rt3Ayqth4DAiPnW9MDFi63TiQJHmohfTWLMQFHi4KZH',
  SHARKX: '5f2PvbmKd9pRLjKdMr8nrK8fNisLi7irjB6X5gopnKpB' 
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
        nft.collection?.address.toString() === COLLECTION_IDS.DL_NFT ||
        nft.collection?.address.toString() === COLLECTION_IDS.SOLANA_MONKEY_BUSINESS_GEN2 ||
        nft.collection?.address.toString() === COLLECTION_IDS.SOLANA_MONKEY_BUSINESS_GEN3 ||
        nft.collection?.address.toString() === COLLECTION_IDS.SHARKX
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
        },
      }));

      console.log('Filtered NFTs from specified collections:', filteredNFTs);

      return filteredNFTs;
    } else {
      console.log('NFT fetching for this chain not implemented yet');
      return [];
    }
  } catch (err) {
    console.error('Error fetching NFTs:', err);
    return [];
  }
};

export default fetchUserNFTs;