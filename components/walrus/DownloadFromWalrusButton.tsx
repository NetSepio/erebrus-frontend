import React, { useState } from 'react';
import axios from 'axios';

interface DownloadFromWalrusButtonProps {
  blobId: string;
  clientName: string;
}

const DownloadFromWalrusButton: React.FC<DownloadFromWalrusButtonProps> = ({ blobId, clientName }) => {
  const [isDownloading, setIsDownloading] = useState(false);

  const downloadFromWalrus = async () => {
    setIsDownloading(true);
    try {
      const response = await axios.get(`https://aggregator-devnet.walrus.space/v1/${blobId}`, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${clientName}.conf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading from Walrus:', error);
      alert('Failed to download the configuration file.');
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <button
      onClick={downloadFromWalrus}
      disabled={isDownloading}
      className="text-sm px-2 py-1 rounded bg-blue-500 text-white hover:bg-blue-600 transition-colors duration-200 ease-in-out"
    >
      {isDownloading ? 'Downloading...' : 'Download'}
    </button>
  );
};

export default DownloadFromWalrusButton;