from pytube import Playlist

import ffmpeg
import os
import re
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def clean_playlist_url(url):
    print(f"[DEBUG] Cleaning URL: {url}")
    match = re.search(r'(https?://)?(www\.)?(youtube\.com|youtu\.be)/playlist\?list=[\w-]+', url)
    cleaned_url = match.group(0) if match else url
    print(f"[DEBUG] Cleaned URL: {cleaned_url}")
    return cleaned_url

def sanitize_filename(filename):
    sanitized = re.sub(r'[<>:"/\\|?*]', '', filename)
    print(f"[DEBUG] Sanitized filename: {sanitized}")
    return sanitized

def download_youtube_playlist(playlist_url, download_path):
    print(f"[INFO] Attempting to download playlist from: {playlist_url}")
    
    playlist = Playlist(playlist_url)
    print(f"[INFO] Playlist title: {playlist.title}")
    print(f"[INFO] Total videos found: {len(playlist.video_urls)}")

    for video in playlist.videos:
        try:
            print(f"[DEBUG] Processing video: {video.watch_url}")
            sanitized_title = sanitize_filename(video.title)
            final_path = os.path.join(download_path, f'{sanitized_title}.mp4')

            if os.path.exists(final_path):
                print(f"[SKIP] Already downloaded: {sanitized_title}")
                continue

            print(f"[INFO] Downloading: {sanitized_title}")
            
            video_stream = video.streams.filter(res="1080p").first()
            audio_stream = video.streams.filter(only_audio=True, mime_type="audio/mp4").order_by("abr").desc().first()

            video_path = os.path.join(download_path, f'{sanitized_title}_video.mp4')
            audio_path = os.path.join(download_path, f'{sanitized_title}_audio.mp4')

            if video_stream:
                print(f"[DEBUG] Downloading video stream...")
                video_stream.download(output_path=download_path, filename=f'{sanitized_title}_video.mp4')
            else:
                print(f"[WARNING] No 1080p video stream found for: {sanitized_title}")

            if audio_stream:
                print(f"[DEBUG] Downloading audio stream...")
                audio_stream.download(output_path=download_path, filename=f'{sanitized_title}_audio.mp4')
            else:
                print(f"[WARNING] No audio stream found for: {sanitized_title}")

            if video_stream and audio_stream:
                print(f"[DEBUG] Merging video and audio for: {sanitized_title}")
                video_input = ffmpeg.input(video_path)
                audio_input = ffmpeg.input(audio_path)

                ffmpeg.output(video_input, audio_input, final_path, vcodec='copy', acodec='aac', strict='experimental').run(overwrite_output=True)

                print(f"[SUCCESS] Merged: {sanitized_title}")
                os.remove(video_path)
                os.remove(audio_path)

        except Exception as video_err:
            print(f"[ERROR] Failed to process video: {video.watch_url} - {video_err}")
            continue  # skip to next video

        else:
            print(f"[WARNING] Skipping merge due to missing streams: {sanitized_title}")

    print("[INFO] Playlist download completed.")

@app.route('/api/download', methods=['POST'])
def download_playlist():
    data = request.json
    print(f"[REQUEST] Payload: {data}")

    raw_url = data.get('url')
    if not raw_url:
        return jsonify({'status': 'error', 'message': 'URL is required'}), 400

    playlist_url = clean_playlist_url(raw_url)
    download_path = './downloads'

    try:
        if not os.path.exists(download_path):
            os.makedirs(download_path)

        download_youtube_playlist(playlist_url, download_path)
        return jsonify({'status': 'success'})
    except Exception as e:
        print(f"[ERROR] Exception occurred: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
