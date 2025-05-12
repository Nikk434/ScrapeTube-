from pytube import Playlist
import ffmpeg
import os
import re
from flask import (
    Flask,
    request,
    jsonify,
)
from flask_cors import CORS
app = Flask(__name__)
CORS(app)
def sanitize_filename(filename):
    return re.sub(r'[<>:"/\\|?*]', '', filename)

def download_youtube_playlist(playlist_url, download_path):
    playlist = Playlist(playlist_url)
    
    print(f'Downloading playlist: {playlist.title}')
    
    for video in playlist.videos:
        sanitized_title = sanitize_filename(video.title)
        
        final_path = os.path.join(download_path, f'{sanitized_title}.mp4')
        
        if os.path.exists(final_path):
            print(f'Skipping already downloaded video: {sanitized_title}')
            continue
        
        print(f'Downloading video: {sanitized_title}')
        
        video_stream = video.streams.filter(res="1080p").first()
        
        audio_stream = video.streams.filter(only_audio=True, mime_type="audio/mp4").order_by("abr").desc().first()
        
        video_path = os.path.join(download_path, f'{sanitized_title}_video.mp4')
        audio_path = os.path.join(download_path, f'{sanitized_title}_audio.mp4')
        
        if video_stream:
            video_stream.download(output_path=download_path, filename=f'{sanitized_title}_video.mp4')
        if audio_stream:
            audio_stream.download(output_path=download_path, filename=f'{sanitized_title}_audio.mp4')
        
        if video_stream and audio_stream:
            video_input = ffmpeg.input(video_path)
            audio_input = ffmpeg.input(audio_path)
            
            ffmpeg.output(video_input, audio_input, final_path, vcodec='copy', acodec='aac', strict='experimental').run(overwrite_output=True)
        
            os.remove(video_path)
            os.remove(audio_path)
        
        print(f'Video downloaded and merged: {sanitized_title}')

    print("Download completed.")

playlist_url = '' #paste your Playlist url

download_path = '' #your download path

download_youtube_playlist(playlist_url, download_path)

@app.route('/api/download', methods=['POST'])
def download_playlist():
    data = request.json
    playlist_url = data.get('url')
    download_path = './downloads'  # a safe temp folder
    
    try:
        download_youtube_playlist(playlist_url, download_path)
        return jsonify({'status': 'success'})
    except Exception as e:
        return jsonify({'status': 'error', 'message': str(e)}), 500

if __name__ =="__main__":
    app.run(host="0.0.0.0",port=5000,debug=True)