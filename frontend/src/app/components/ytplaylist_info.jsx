import { useState, useEffect } from 'react';

export default function YouTubePlaylist({ payloadData }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  
  // Process the payload when component mounts or payloadData changes
  useEffect(() => {
    try {
      if (!payloadData) {
        setError("No payload data provided");
        setLoading(false);
        return;
      }
      
      // Parse the data if it's a string, otherwise use it directly
      const parsedData = typeof payloadData === 'string' 
        ? JSON.parse(payloadData) 
        : payloadData;
      
      if (parsedData?.status !== "success" || !parsedData?.data) {
        setError("Invalid data format");
      } else {
        setData(parsedData);
      }
    } catch (err) {
      setError(`Error processing data: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }, [payloadData]);
  
  // Loading state
  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center">
        <div className="text-gray-600">Loading playlist...</div>
      </div>
    );
  }
  
  // Error state
  if (error || !data) {
    return (
      <div className="p-4 bg-red-100 text-red-800 rounded">
        {error || "Error loading playlist data"}
      </div>
    );
  }
  
  const { playlist_title, video_count, videos } = data.data;
  
  return (
    <div className="max-w-4xl mx-auto bg-gray-50 rounded-lg shadow-md overflow-hidden">
      {/* Playlist Header */}
      <div className="bg-gray-800 text-white p-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">{playlist_title}</h2>
          <span className="text-sm bg-gray-700 px-2 py-1 rounded">
            {video_count} videos
          </span>
        </div>
      </div>
      
      {/* Video Grid/List */}
      <div className="p-4">
        {selectedVideo ? (
          <div className="mb-4">
            <div className="relative pb-16 pt-4">
              <div className="bg-gray-900 w-full h-64 flex items-center justify-center text-white">
                {/* This would be where the actual video player goes */}
                <p className="text-center">Video Player Placeholder</p>
                <img 
                  src={selectedVideo.thumbnail} 
                  alt={selectedVideo.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-50"
                />
              </div>
              <h3 className="font-medium text-lg mt-2">{selectedVideo.title}</h3>
              <button 
                onClick={() => setSelectedVideo(null)}
                className="mt-2 px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded text-sm"
              >
                Back to playlist
              </button>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {videos.map((video, index) => (
              <div 
                key={index} 
                className="cursor-pointer bg-white rounded-md overflow-hidden shadow hover:shadow-md transition-shadow"
                onClick={() => setSelectedVideo(video)}
              >
                <div className="relative">
                  <img 
                    src={video.thumbnail} 
                    alt={video.title}
                    className="w-full h-40 object-cover"
                  />
                  {video.progress !== "0%" && (
                    <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
                      <div 
                        className="h-full bg-red-600" 
                        style={{ width: video.progress }}
                      ></div>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-medium text-sm line-clamp-2">{video.title}</h3>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}