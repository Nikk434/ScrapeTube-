import yt_dlp
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

    # yt-dlp handles playlist processing itself
    ydl_opts = {
        'format': 'bestvideo[height<=1080]+bestaudio/best',
        'outtmpl': os.path.join(download_path, '%(title).200s.%(ext)s'),
        'merge_output_format': 'mp4',
        'noplaylist': False,
        'quiet': False,
        'progress_hooks': [lambda d: print(f"[YT-DLP] {d['status'].upper()}: {d.get('filename', '')}")],
    }

    with yt_dlp.YoutubeDL(ydl_opts) as ydl:
        ydl.download([playlist_url])

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
