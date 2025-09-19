import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const walletAddress = searchParams.get('wallet');
  
  if (!walletAddress) {
    return NextResponse.json(
      { error: 'Wallet address is required' },
      { status: 400 }
    );
  }

  console.log(`API route: Fetching NFTs for wallet ${walletAddress}`);

  try {
    // Make the request to Magic Eden API from the server side
    const response = await fetch(
      `https://api-mainnet.magiceden.dev/v2/wallets/${walletAddress}/tokens`,
      {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'Erebrus-Frontend/1.0',
        },
        next: { revalidate: 30 }, // Revalidate cache every 30 seconds
      }
    );

    if (!response.ok) {
      throw new Error(`Magic Eden API error: ${response.status} ${response.statusText}`);
    }

    const nftData = await response.json();
    console.log(`API route: Fetched ${nftData.length} NFTs from Magic Eden`);

    // Process images to ensure URLs are valid
    const processedData = nftData.map((nft: any) => {
      // Fix image URL if needed - ensure it's a valid URL
      if (nft.image) {
        // Handle IPFS URLs
        if (nft.image.startsWith('ipfs://')) {
          nft.image = `https://ipfs.io/ipfs/${nft.image.slice(7)}`;
        }

        // Handle Arweave URLs
        if (nft.image.startsWith('ar://')) {
          nft.image = `https://arweave.net/${nft.image.slice(5)}`;
        }

        // Ensure URL is valid
        try {
          new URL(nft.image);
        } catch (e) {
          console.log(`Invalid image URL for NFT ${nft.name}: ${nft.image}`);
          
          // If just a hash/CID, convert to IPFS URL
          if (/^[a-zA-Z0-9]{46,59}$/.test(nft.image)) {
            nft.image = `https://ipfs.io/ipfs/${nft.image}`;
          }
        }
      }
      
      return nft;
    });
    
    return NextResponse.json(processedData, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Cache-Control': 'public, max-age=30, stale-while-revalidate=60',
      },
    });
  } catch (error) {
    console.error('Error fetching NFTs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch NFTs from Magic Eden' },
      { status: 500 }
    );
  }
}

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}
