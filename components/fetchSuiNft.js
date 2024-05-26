import { getFullnodeUrl, SuiClient } from '@mysten/sui.js/client';

const FetchSuiNft = (wallet) => {
  return new Promise(async (resolve, reject) => {
    console.log("wallet inside", wallet);

    // Convert wallet to string if it's not already
    const walletString = typeof wallet === 'string' ? wallet : String(wallet);
    console.log("wallet inside", walletString);
    


    try {
      const suiClient = new SuiClient({ url: getFullnodeUrl("testnet") });
      const objects = await suiClient.getOwnedObjects({ owner: "0x69ebfcf95db68e2358b39d218bd718cd0f05b8bd390123292c134f45480f376c" });
      const filteredWidgets = [];

      for (let i = 0; i < objects.data.length; i++) {
        const currentObjectId = objects.data[i].data.objectId;
        const objectInfo = await suiClient.getObject({
          id: currentObjectId,
          options: { showContent: true },
        });
        console.log("objectinfo", objectInfo)

        const packageId = '0x6dd31527aa4fa68f5a6578a7b3c2fb44ed79d019aa1fe8d4c83a262b1bece985';
        if (objectInfo?.data.content.type === `${packageId}::erebrus::mint`) {
          filteredWidgets.push(objectInfo.data);
        }
      }

      resolve(filteredWidgets);
    } catch (error) {
      reject(error);
    }
  });
}

export default FetchSuiNft;
