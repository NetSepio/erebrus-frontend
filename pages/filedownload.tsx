'use client'

import React, { useState } from 'react';
import { FiDownload, FiFile, FiLink, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

interface FileInfo {
  fileName: string;
  blobId: string;
  mediaType: string;
  blobUrl: string;
  suiUrl: string;
  isImage: boolean;
}

export default function FileDownloader() {
  const [link, setLink] = useState('');
  const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLinkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setLink(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const url = new URL(link);
      const encodedFileInfo = url.searchParams.get('file');

      if (!encodedFileInfo) {
        throw new Error('Invalid share link');
      }

      // Simulate a delay to show loading state
      await new Promise(resolve => setTimeout(resolve, 1000));

      const decodedFileInfo = JSON.parse(atob(encodedFileInfo));
      setFileInfo(decodedFileInfo);
    } catch (err: any) {
      setError(err.message || 'An error occurred while processing the link');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = async () => {
    if (!fileInfo) return;

    try {
      setIsLoading(true);
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
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-gray-900 min-h-screen flex items-center justify-center p-4">
      <div className="bg-gray-800 rounded-lg shadow-2xl w-full max-w-md p-8">
        <h2 className="text-3xl font-bold text-gray-100 mb-6 flex items-center justify-center">
          <FiDownload className="mr-3 text-blue-400" />
          Walrus File Downloader
        </h2>
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="relative">
            <FiLink className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={link}
              onChange={handleLinkChange}
              placeholder="Paste your share link here"
              className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-gray-100 placeholder-gray-400 focus:outline-none focus:border-blue-500 transition duration-200"
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full mt-4 bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {isLoading ? 'Processing...' : 'Get File'}
          </button>
        </form>

        {error && (
          <div className="bg-red-900 bg-opacity-50 border-l-4 border-red-500 text-red-100 p-4 mb-6 rounded-r-lg flex items-center">
            <FiAlertCircle className="mr-3 flex-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {fileInfo && (
          <div className="bg-gray-700 rounded-lg p-6 animate-fade-in">
            <div className="flex items-center mb-4">
              <div className="bg-blue-500 p-3 rounded-full mr-4">
                <FiFile className="text-white w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-100">{fileInfo.fileName}</h3>
                <p className="text-gray-400 text-sm">{fileInfo.mediaType}</p>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-600">
              <button 
                onClick={handleDownload}
                disabled={isLoading}
                className={`w-full bg-green-500 text-white p-3 rounded-lg hover:bg-green-600 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 flex items-center justify-center ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <FiDownload className="mr-2" />
                {isLoading ? 'Downloading...' : 'Download File'}
              </button>
            </div>
          </div>
        )}

        {fileInfo && (
          <div className="mt-6 text-center">
            <a href={fileInfo.suiUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">
              View on Sui Explorer
            </a>
          </div>
        )}
      </div>
    </div>
  );
}