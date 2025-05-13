'use client';

import { useState } from 'react';

export default function Home() {
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [downloadStatus, setDownloadStatus] = useState('idle'); // 'idle', 'downloading', 'completed', 'error'
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!playlistUrl.trim()) {
      setError('Please enter a YouTube playlist URL');
      return;
    }
    
    // Simple validation for YouTube playlist URL
    if (!playlistUrl.includes('youtube.com/playlist') && !playlistUrl.includes('youtu.be')) {
      setError('Please enter a valid YouTube playlist URL');
      return;
    }
    
    setError('');
    setIsLoading(true);
    setDownloadStatus('downloading');
    
    try {
      // Call the backend API
      const response = await fetch('http://localhost:5000/api/download', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: playlistUrl }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to download playlist');
      }
      
      setDownloadStatus('completed');
    } catch (error) {
      console.error('Error downloading playlist:', error);
      setError(error.message || 'Failed to download playlist. Please try again.');
      setDownloadStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center p-8 bg-gray-50">
      <div className="w-full max-w-4xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">ScrapeTube - YT Playlist Downloader</h1>
          <p className="text-xl text-gray-600">
            Download entire YouTube playlists with just one click!
          </p>
        </div>

        {/* URL Input Form */}
        <div className="bg-white p-8 rounded-lg shadow-md mb-10">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="playlist-url" className="block text-lg font-medium text-gray-700 mb-2">
                Enter YouTube Playlist URL
              </label>
              <input
                id="playlist-url"
                type="text"
                value={playlistUrl}
                onChange={(e) => setPlaylistUrl(e.target.value)}
                placeholder="https://www.youtube.com/playlist?list=..."
                className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
                disabled={isLoading}
              />
              {error && <p className="mt-2 text-red-600">{error}</p>}
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              {isLoading ? 'Downloading...' : 'Download Playlist'}
            </button>
          </form>
        </div>

        {/* Download Status */}
        {downloadStatus === 'downloading' && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-10 text-center">
            <div className="flex flex-col items-center justify-center">
              <div className="w-16 h-16 border-4 border-t-blue-600 border-gray-200 rounded-full animate-spin mb-4"></div>
              <h3 className="text-xl font-medium text-gray-800">Downloading Playlist</h3>
              <p className="text-gray-600 mt-2">This may take some time depending on the number of videos.</p>
            </div>
          </div>
        )}

        {downloadStatus === 'completed' && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-10 text-center">
            <div className="flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mb-4">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-800">Download Complete!</h3>
              <p className="text-gray-600 mt-2">
                All videos have been saved to the downloads folder on the server.
              </p>
              <button 
                onClick={() => setDownloadStatus('idle')}
                className="mt-4 py-2 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow transition-colors"
              >
                Download Another Playlist
              </button>
            </div>
          </div>
        )}

        {downloadStatus === 'error' && (
          <div className="bg-white p-6 rounded-lg shadow-md mb-10 text-center">
            <div className="flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center text-red-600 mb-4">
                <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
              <h3 className="text-xl font-medium text-gray-800">Download Failed</h3>
              <p className="text-red-600 mt-2">{error}</p>
              <button 
                onClick={() => setDownloadStatus('idle')}
                className="mt-4 py-2 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
        
        {/* How It Works Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xl font-bold mb-4">1</div>
              <h3 className="text-lg font-semibold mb-2">Paste Playlist URL</h3>
              <p className="text-gray-600">Enter the URL of any YouTube playlist you want to download</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xl font-bold mb-4">2</div>
              <h3 className="text-lg font-semibold mb-2">Click Download</h3>
              <p className="text-gray-600">Our system will process the entire playlist for you</p>
            </div>
            <div className="text-center p-6 bg-white rounded-lg shadow-md">
              <div className="w-12 h-12 mx-auto bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xl font-bold mb-4">3</div>
              <h3 className="text-lg font-semibold mb-2">Get Your Videos</h3>
              <p className="text-gray-600">Videos are saved to the server's downloads folder in high quality</p>
            </div>
          </div>
        </div>
        
        {/* Additional Information */}
        <div className="mt-16 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">About This Tool</h2>
          <div className="prose max-w-none">
            <p>This YouTube Playlist Downloader uses yt-dlp to efficiently download entire playlists from YouTube. Videos are saved in high quality MP4 format with both video and audio.</p>
            <h3 className="text-lg font-semibold mt-4">Features:</h3>
            <ul className="list-disc pl-6 mt-2">
              <li>Downloads complete YouTube playlists</li>
              <li>Automatically cleans and sanitizes video filenames</li>
              <li>Saves videos in MP4 format with quality up to 1080p</li>
              <li>Handles YouTube playlist URLs automatically</li>
            </ul>
            <h3 className="text-lg font-semibold mt-4">Technical Details:</h3>
            <p>The application consists of:</p>
            <ul className="list-disc pl-6 mt-2">
              <li>Frontend: Next.js React application</li>
              <li>Backend: Flask API with yt-dlp integration</li>
              <li>Videos are saved to a 'downloads' folder on the server</li>
            </ul>
            <div className="bg-yellow-50 p-4 rounded-md border-l-4 border-yellow-500 mt-4">
              <p className="text-sm text-yellow-700">
                <strong>Note:</strong> For personal use only. Respect copyright laws and YouTube's Terms of Service.
              </p>
            </div>
          </div>
        </div>
        
        {/* Footer */}
        <footer className="mt-20 text-center text-gray-600 pb-8">
          <p>© {new Date().getFullYear()} YouTube Playlist Downloader. All rights reserved.</p>
          <p className="mt-2 text-sm">
            This tool is for personal use only. By using this service, you agree to comply with YouTube's Terms of Service.
          </p>
        </footer>
      </div>
    </main>
  );
}