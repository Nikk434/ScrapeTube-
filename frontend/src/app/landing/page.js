'use client';

import { useState } from 'react';
import DarkModeToggle from '../components/DarkModeToggle';
import { Download, Link, Check, X, PlayCircle, Info, Loader2 } from 'lucide-react';

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
    <main className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <div className="w-full max-w-5xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        
        {/* Header with Dark Mode Toggle */}
        <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-2">
            <PlayCircle size={32} className="text-blue-600 dark:text-blue-400" />
            <h1 className="text-2xl font-bold sm:text-3xl md:text-4xl bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 text-transparent bg-clip-text">
              ScrapeTube
            </h1>
          </div>
          <DarkModeToggle />
        </div>

        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4 text-slate-800 dark:text-slate-100">
            YouTube Playlist Downloader
          </h2>
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            The ultimate tool to download entire YouTube playlists in Full HD quality
          </p>
        </div>

        {/* URL Input Form */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 sm:p-8 mb-10 border border-slate-200 dark:border-slate-700 transition-colors">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="playlist-url" className="block text-lg font-medium text-slate-700 dark:text-slate-200 mb-2">
                Enter YouTube Playlist URL
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Link size={20} className="text-slate-400" />
                </div>
                <input
                  id="playlist-url"
                  type="text"
                  value={playlistUrl}
                  onChange={(e) => setPlaylistUrl(e.target.value)}
                  placeholder="https://www.youtube.com/playlist?list=..."
                  className="block w-full pl-10 pr-3 py-4 border border-slate-300 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-white transition-colors"
                  disabled={isLoading}
                />
              </div>
              {error && <p className="mt-2 text-red-600 dark:text-red-400 flex items-center gap-1"><X size={16} />{error}</p>}
            </div>
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium rounded-xl shadow-md transition-all hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={20} className="animate-spin" />
                  Downloading...
                </>
              ) : (
                <>
                  <Download size={20} />
                  Download Playlist
                </>
              )}
            </button>
          </form>
        </div>

        {/* Download Status */}
        {downloadStatus === 'downloading' && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 sm:p-8 mb-10 border border-slate-200 dark:border-slate-700 transition-colors">
            <div className="flex flex-col items-center justify-center">
              <div className="w-16 h-16 border-4 border-t-blue-600 dark:border-t-blue-400 border-slate-200 dark:border-slate-700 rounded-full animate-spin mb-4"></div>
              <h3 className="text-xl font-medium text-slate-800 dark:text-slate-100">Downloading Playlist</h3>
              <p className="text-slate-600 dark:text-slate-300 mt-2">This may take some time depending on the number of videos.</p>
            </div>
          </div>
        )}

        {downloadStatus === 'completed' && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 sm:p-8 mb-10 border border-slate-200 dark:border-slate-700 transition-colors">
            <div className="flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center text-green-600 dark:text-green-400 mb-4">
                <Check size={36} />
              </div>
              <h3 className="text-xl font-medium text-slate-800 dark:text-slate-100">Download Complete!</h3>
              <p className="text-slate-600 dark:text-slate-300 mt-2">
                All videos have been saved to the downloads folder on the server.
              </p>
              <button
                onClick={() => setDownloadStatus('idle')}
                className="mt-6 py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow transition-colors flex items-center gap-2"
              >
                <Download size={18} />
                Download Another Playlist
              </button>
            </div>
          </div>
        )}

        {downloadStatus === 'error' && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6 sm:p-8 mb-10 border border-slate-200 dark:border-slate-700 transition-colors">
            <div className="flex flex-col items-center justify-center">
              <div className="w-16 h-16 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center text-red-600 dark:text-red-400 mb-4">
                <X size={36} />
              </div>
              <h3 className="text-xl font-medium text-slate-800 dark:text-slate-100">Download Failed</h3>
              <p className="text-red-600 dark:text-red-400 mt-2">{error}</p>
              <button
                onClick={() => setDownloadStatus('idle')}
                className="mt-6 py-3 px-6 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow transition-colors flex items-center gap-2"
              >
                <Download size={18} />
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* How It Works Section */}
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-slate-100 mb-8">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 transition-colors">
              <div className="w-14 h-14 mx-auto bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 text-xl font-bold mb-4">1</div>
              <h3 className="text-lg font-semibold mb-2 text-slate-800 dark:text-slate-100">Paste Playlist URL</h3>
              <p className="text-slate-600 dark:text-slate-300">Enter the URL of any YouTube playlist you want to download</p>
            </div>
            <div className="text-center p-6 bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 transition-colors">
              <div className="w-14 h-14 mx-auto bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 text-xl font-bold mb-4">2</div>
              <h3 className="text-lg font-semibold mb-2 text-slate-800 dark:text-slate-100">Click Download</h3>
              <p className="text-slate-600 dark:text-slate-300">Our system will process the entire playlist for you</p>
            </div>
            <div className="text-center p-6 bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 transition-colors">
              <div className="w-14 h-14 mx-auto bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center text-blue-600 dark:text-blue-400 text-xl font-bold mb-4">3</div>
              <h3 className="text-lg font-semibold mb-2 text-slate-800 dark:text-slate-100">Get Your Videos</h3>
              <p className="text-slate-600 dark:text-slate-300">Videos are saved to the server's downloads folder in high quality</p>
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="mt-16 p-6 bg-white dark:bg-slate-800 rounded-xl shadow-md border border-slate-200 dark:border-slate-700 transition-colors">
          <div className="flex items-center mb-4">
            <Info size={24} className="text-blue-600 dark:text-blue-400 mr-2" />
            <h2 className="text-2xl font-bold text-slate-800 dark:text-slate-100">About This Tool</h2>
          </div>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-slate-700 dark:text-slate-300">This YouTube Playlist Downloader uses yt-dlp to efficiently download entire playlists from YouTube. Videos are saved in high quality MP4 format with both video and audio.</p>
            
            <h3 className="text-lg font-semibold mt-6 text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Check size={20} className="text-green-600 dark:text-green-400" /> Features:
            </h3>
            <ul className="list-none pl-0 mt-2 space-y-2">
              <li className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <Check size={12} className="text-blue-600 dark:text-blue-400" />
                </div>
                Downloads complete YouTube playlists
              </li>
              <li className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <Check size={12} className="text-blue-600 dark:text-blue-400" />
                </div>
                Automatically cleans and sanitizes video filenames
              </li>
              <li className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <Check size={12} className="text-blue-600 dark:text-blue-400" />
                </div>
                Saves videos in MP4 format with quality up to 1080p
              </li>
              <li className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <Check size={12} className="text-blue-600 dark:text-blue-400" />
                </div>
                Handles YouTube playlist URLs automatically
              </li>
            </ul>
            
            <h3 className="text-lg font-semibold mt-6 text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Info size={20} className="text-blue-600 dark:text-blue-400" /> Technical Details:
            </h3>
            <p className="text-slate-700 dark:text-slate-300">The application consists of:</p>
            <ul className="list-none pl-0 mt-2 space-y-2">
              <li className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <Check size={12} className="text-blue-600 dark:text-blue-400" />
                </div>
                Frontend: Next.js React application
              </li>
              <li className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <Check size={12} className="text-blue-600 dark:text-blue-400" />
                </div>
                Backend: Flask API with yt-dlp integration
              </li>
              <li className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
                <div className="w-5 h-5 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                  <Check size={12} className="text-blue-600 dark:text-blue-400" />
                </div>
                Videos are saved to a 'downloads' folder on the server
              </li>
            </ul>
            
            <div className="mt-6 p-4 rounded-lg bg-yellow-50 dark:bg-yellow-900/30 border-l-4 border-yellow-500 dark:border-yellow-600">
              <p className="text-sm text-yellow-800 dark:text-yellow-200 flex items-center gap-2">
                <Info size={16} className="shrink-0" />
                <span><strong>Note:</strong> For personal use only. Respect copyright laws and YouTube's Terms of Service.</span>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="mt-20 text-center text-slate-600 dark:text-slate-400 pb-8">
          <p>© {new Date().getFullYear()} ScrapeTube - YouTube Playlist Downloader. All rights reserved.</p>
          <p className="mt-2 text-sm">
            This tool is for personal use only. By using this service, you agree to comply with YouTube's Terms of Service.
          </p>
        </footer>
      </div>
    </main>
  );
}