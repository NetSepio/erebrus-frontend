'use client'

import React, { useState, useRef, FormEvent, ChangeEvent } from 'react';
import { FiUploadCloud, FiDownload, FiShare2, FiX, FiCopy, FiCheck,FiFolder } from 'react-icons/fi';
import { v4 as uuidv4 } from 'uuid';
import { motion, AnimatePresence } from 'framer-motion';

const PUBLISHER_URL = 'https://publisher-devnet.walrus.space';
const AGGREGATOR_URL = 'https://aggregator-devnet.walrus.space';
const EPOCHS = '5';

interface FileInfo {
  fileName: string;
  blobId: string;
  mediaType: string;
  blobUrl: string;
  suiUrl: string;
  isImage: boolean;
}

export default function FileStorage() {
  const [files, setFiles] = useState<FileInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
    const [shareLink, setShareLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setLoading(true);
      setError(null);
      Array.from(e.target.files).forEach(uploadFile);
    }
  };

  const uploadFile = async (file: File) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${PUBLISHER_URL}/v1/store?epochs=${EPOCHS}`, {
        method: "PUT",
        body: file,
      });

      if (response.status === 200) {
        const info = await response.json();
        let blobId = '';
        let suiUrl = '';

        if (info.alreadyCertified) {
          blobId = info.alreadyCertified.blobId;
          suiUrl = `https://suiscan.xyz/testnet/tx/${info.alreadyCertified.event.txDigest}`;
        } else if (info.newlyCreated) {
          blobId = info.newlyCreated.blobObject.blobId;
          suiUrl = `https://suiscan.xyz/testnet/object/${info.newlyCreated.blobObject.id}`;
        }

        const blobUrl = `${AGGREGATOR_URL}/v1/${blobId}`;
        const isImage = file.type.startsWith('image/');

        setFiles((prev) => [
          ...prev,
          { fileName: file.name, blobId, mediaType: file.type, blobUrl, suiUrl, isImage },
        ]);
      } else {
        throw new Error("Failed to upload file");
      }
    } catch (err: any) {
      setError(`Failed to upload ${file.name}. Please try again.`);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (fileInfo: FileInfo) => {
    try {
      const response = await fetch(fileInfo.blobUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileInfo.fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (err: any) {
      setError(`Failed to download ${fileInfo.fileName}. Please try again.`);
      console.error(err);
    }
  };

 const handleShare = (fileInfo: FileInfo) => {
    const encodedFileInfo = btoa(JSON.stringify(fileInfo));
    const link = `${window.location.origin}/filedownload?file=${encodedFileInfo}`;
    setShareLink(link);
  };

  const handleCopy = () => {
    if (shareLink) {
      navigator.clipboard.writeText(shareLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const closeShareModal = () => {
    setShareLink(null);
    setCopied(false);
  };
  return (
    <div className="relative">
    <motion.button
      onClick={() => setIsOpen(!isOpen)}
      className="flex items-center space-x-2 bg-gradient-to-r from-[#0162FF] to-[#0051D9] text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300 ease-in-out"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <FiFolder className="text-xl" />
      <span className="font-semibold">File Storage</span>
    </motion.button>

    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
          className="absolute top-0 right-full mr-4 w-[400px] z-10"
        >
          <div className="bg-[#202333] border border-[#0162FF] rounded-3xl p-6 w-full h-[500px] flex flex-col shadow-2xl">
            <h2 className="text-2xl font-semibold text-white mb-4">File Storage</h2>
      
      <div 
        className="flex-shrink-0 flex flex-col items-center justify-center border-2 border-dashed border-[#0162FF] rounded-xl p-6 mb-4 cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
      >
        <FiUploadCloud className="text-[#0162FF] text-6xl mb-4" />
        <p className="text-white text-lg mb-2">Click or drag files to upload</p>
        <p className="text-gray-400 text-sm">Securely store files on the decentralized network</p>
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
            <h3 className="text-white font-semibold mb-2">Files on decentralized Network</h3>
            {files.map((fileInfo, index) => (
              <div key={index} className="flex items-center justify-between text-white py-2 border-b border-gray-700 last:border-b-0">
                <div className="flex items-center flex-grow">
                  {fileInfo.isImage ? (
                    <object 
                      type={fileInfo.mediaType} 
                      data={fileInfo.blobUrl}
                      className="w-10 h-10 object-cover rounded mr-2"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-gray-600 flex items-center justify-center rounded mr-2">
                      <span>{fileInfo.fileName.slice(-3).toUpperCase()}</span>
                    </div>
                  )}
                  <span className="truncate">{fileInfo.fileName}</span>
                </div>
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

        {shareLink && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-[#2A2D3E] rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-white font-semibold">Share Link</h3>
              <button onClick={closeShareModal} className="text-gray-400 hover:text-white">
                <FiX />
              </button>
            </div>
            <div className="bg-[#202333] rounded-lg p-3 flex items-center mb-4">
              <input 
                type="text" 
                value={shareLink} 
                readOnly 
                className="bg-transparent text-white flex-grow mr-2 outline-none"
              />
              <button 
                onClick={handleCopy} 
                className="text-[#0162FF] hover:text-white transition-colors"
              >
                {copied ? <FiCheck /> : <FiCopy />}
              </button>
            </div>
            <p className="text-gray-400 text-sm">
              {copied ? "Copied to clipboard!" : "Click the copy icon to copy the link"}
            </p>
          </div>
        </div>
      )}

      {error && <p className="text-red-500 mt-2">{error}</p>}
    </div>
    </motion.div>
      )}
      </AnimatePresence>
      </div>
  );
}