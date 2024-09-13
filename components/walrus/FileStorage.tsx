import React, { useState, useRef } from 'react';
import axios from 'axios';
import { FiUploadCloud, FiDownload, FiShare2 } from 'react-icons/fi';

const PUBLISHER = 'https://publisher-devnet.walrus.space';
const AGGREGATOR = 'https://aggregator-devnet.walrus.space';

interface FileInfo {
  name: string;
  blobId: string;
}

const FileStorage: React.FC = () => {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setLoading(true);
      setError(null);
      Array.from(e.target.files).forEach(uploadFile);
    }
  };

  const uploadFile = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.put(`${PUBLISHER}/v1/store`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      let blobId = '';
      if (response.data.newlyCreated) {
        blobId = response.data.newlyCreated.blobObject.blobId;
      } else if (response.data.alreadyCertified) {
        blobId = response.data.alreadyCertified.blobId;
      }

      setFiles(prev => [...prev, { name: file.name, blobId }]);
    } catch (err) {
      setError(`Failed to upload ${file.name}. Please try again.`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (fileInfo: FileInfo) => {
    try {
      const response = await axios.get(`${AGGREGATOR}/v1/${fileInfo.blobId}`, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileInfo.name);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err) {
      setError(`Failed to download ${fileInfo.name}. Please try again.`);
      console.error(err);
    }
  };

  const handleShare = (fileInfo: FileInfo) => {
    const shareUrl = `${AGGREGATOR}/v1/${fileInfo.blobId}`;
    navigator.clipboard.writeText(shareUrl);
    alert(`Share link copied to clipboard: ${shareUrl}`);
  };

  return (
    <div className="bg-[#202333] border border-[#0162FF] rounded-3xl p-6 w-full h-[400px] flex flex-col">
      <h2 className="text-2xl font-semibold text-white mb-4">File Storage</h2>
      
      <div 
        className="flex-shrink-0 flex flex-col items-center justify-center border-2 border-dashed border-[#0162FF] rounded-xl p-6 mb-4 cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <FiUploadCloud className="text-[#0162FF] text-6xl mb-4" />
        <p className="text-white text-lg mb-2">Click or drag files to upload</p>
        <p className="text-gray-400 text-sm">Supports any file type</p>
        <input 
          type="file" 
          ref={fileInputRef}
          onChange={handleFileChange} 
          className="hidden" 
          multiple
        />
      </div>

      {loading && <p className="text-white mb-4">Uploading...</p>}

      <div className="flex-grow overflow-hidden">
        {files.length > 0 && (
          <div className="bg-[#2A2D3E] rounded-xl p-4 h-full overflow-y-auto">
            <h3 className="text-white font-semibold mb-2">Uploaded Files</h3>
            {files.map((fileInfo, index) => (
              <div key={index} className="flex items-center justify-between text-white py-2 border-b border-gray-700 last:border-b-0">
                <span className="truncate flex-grow">{fileInfo.name}</span>
                <div className="flex space-x-2">
                  <button onClick={() => handleDownload(fileInfo)} className="p-1 hover:bg-[#0162FF] rounded">
                    <FiDownload />
                  </button>
                  <button onClick={() => handleShare(fileInfo)} className="p-1 hover:bg-[#0162FF] rounded">
                    <FiShare2 />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
  );
};

export default FileStorage;