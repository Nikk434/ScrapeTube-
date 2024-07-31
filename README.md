# ScrapeTube

This script downloads videos from a YouTube playlist using the PyTube library. It supports downloading videos in 1080p resolution and merges them with audio using FFmpeg.

## Features
- PyTube: PyTube alone supports downloading videos at 360p with audio. For resolutions above 360p, only video streams are available, and audio must be downloaded separately.
- 1080p Support: This script uses PyTube to download video and audio streams separately for resolutions up to 1080p and merges them using FFmpeg.
- Sanitized Filenames: The script automatically sanitizes filenames to avoid issues with special characters.

## How It Works
1. Scrape YouTube Playlist: The script uses PyTube to fetch videos from a playlist.
2. Download Video and Audio Separately: For each video, the script downloads the video in 1080p (if available) and the audio separately.
3. Merge Video and Audio: FFmpeg merges the video and audio files into a final output file.

### Prerequisites
1. Python: Ensure Python is installed on your system.
2. FFmpeg: FFmpeg must be installed to merge video and audio files.

### Usage
1. Copy the Code: Copy the provided Python script into a new .py file.
2. Install FFmpeg: Install FFmpeg on your system. You can download it from FFmpeg's official website.
3. Replace Playlist URL and Download Path: Update the playlist_url and download_path variables in the script with your desired YouTube playlist URL and download location.
4. Run the Script: Execute the script. The progress will be displayed in the terminal.

### Example 
```python
playlist_url = 'https://www.youtube.com/playlist?list=YOUR_PLAYLIST_ID'
download_path = 'path/to/download/
download_youtube_playlist(playlist_url, download_path)
```
## Note
1. File Merging: The script first downloads the video and audio streams separately as .mp4 files and then merges them using FFmpeg.
2. Error Handling: The script skips already downloaded videos to avoid duplicates.
License

Replace the placeholder values in the example with your actual playlist URL and download path. Be sure to install FFmpeg and ensure it is accessible from your system's PATH.