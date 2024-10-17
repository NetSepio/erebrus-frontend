import { Connection, PublicKey } from '@solana/web3.js';
import { Metaplex } from '@metaplex-foundation/js';
import { AptosClient, TokenClient } from 'aptos';
import axios from 'axios';
import Cookies from 'js-cookie';

const ALLOWED_COLLECTIONS = {
  sol: ['SMB', 'sharx', '$TEAM', 'DEAN', "Erebrus Community NFT #001"],
  apt: ["Undying City Equipment Collection"]
};

const fetchUserNFTs = async (chainSymbol: string) => {
  const userAddress = Cookies.get('erebrus_wallet');

  if (!userAddress) {
    console.log('No user address found in cookies');
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
        ALLOWED_COLLECTIONS.sol.includes(nft.symbol)
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

    } else if (chainSymbol === 'apt') {
      const APTOS_GRAPHQL_ENDPOINT = process.env.NEXT_PUBLIC_GRAPHQL_APTOS;
      
      const query = `
       query GetAccountNfts($address: String) {
current_token_ownerships_v2(
  where: {owner_address: {_eq: $address}, amount: {_gt: "0"}}
) {
  current_token_data {
    collection_id
    largest_property_version_v1
    current_collection {
      collection_id
      collection_name
      description
      creator_address
      uri
      __typename
    }
    description
    token_name
    token_data_id
    token_standard
    token_uri
    __typename
  }
  owner_address
  amount
  __typename
}
}
      `;

      const variables = { address: userAddress };

      const response = await axios.post(APTOS_GRAPHQL_ENDPOINT, {
        query,
        variables
      });

      const nfts = response.data.data.current_token_ownerships_v2;

      const filteredNFTs = nfts
        .filter(nft => nft.current_token_data.current_collection.collection_name === "Undying City Equipment Collection")
        .map(nft => ({
          amount: nft.amount,
          current_token_data: {
            token_name: nft.current_token_data.token_name,
            token_uri: nft.current_token_data.token_uri,
            description: nft.current_token_data.description,
            token_data_id: nft.current_token_data.token_data_id,
            cdn_asset_uris: {
              cdn_image_uri: nft.current_token_data.token_uri,
            },
            current_collection: nft.current_token_data.current_collection,
            symbol: '',
          },
        }));

      console.log('Filtered Aptos NFTs:', filteredNFTs);
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