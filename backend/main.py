import yt_dlp
import os
import re
import zipstream
from flask import Flask, request, jsonify, Response
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

DOWNLOAD_DIR = './downloads'

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

def generate_and_cleanup_zip(file_paths):
    z = zipstream.ZipFile(mode='w', compression=zipstream.ZIP_DEFLATED)
    for file_path in file_paths:
        arcname = os.path.basename(file_path)
        z.write(file_path, arcname=arcname)
    
    # Generator to stream the zip content and delete files afterward
    def stream_with_cleanup():
        try:
            for chunk in z:
                yield chunk
        finally:
            print("[CLEANUP] Deleting downloaded files...")
            for path in file_paths:
                try:
                    os.remove(path)
                    print(f"[CLEANUP] Deleted: {path}")
                except Exception as e:
                    print(f"[CLEANUP] Failed to delete {path}: {e}")
    return stream_with_cleanup()

@app.route('/api/download', methods=['POST'])
def download_playlist():
    data = request.json
    print(f"[REQUEST] Payload: {data}")

    raw_url = data.get('url')
    if not raw_url:
        return jsonify({'status': 'error', 'message': 'URL is required'}), 400

    playlist_url = clean_playlist_url(raw_url)

    try:
        # Clean download folder
        os.makedirs(DOWNLOAD_DIR, exist_ok=True)
        for f in os.listdir(DOWNLOAD_DIR):
            os.remove(os.path.join(DOWNLOAD_DIR, f))

        # Download
        download_youtube_playlist(playlist_url, DOWNLOAD_DIR)

        downloaded_files = [
            os.path.join(DOWNLOAD_DIR, f) for f in os.listdir(DOWNLOAD_DIR)
        ]
        if not downloaded_files:
            return jsonify({'status': 'error', 'message': 'No files downloaded'}), 500

        zip_stream = generate_and_cleanup_zip(downloaded_files)

        return Response(
            zip_stream,
            mimetype='application/zip',
            headers={'Content-Disposition': 'attachment; filename=playlist.zip'}
        )

    except Exception as e:
        print(f"[ERROR] Exception occurred: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500

@app.route('/api/playlist_data', methods=['POST'])
def playlist_data():
    data = request.json
    print(f"[REQUEST] Payload: {data}")

    raw_url = data.get('url')
    if not raw_url:
        return jsonify({'status': 'error', 'message': 'URL is required'}), 400

    playlist_url = clean_playlist_url(raw_url)

    try:
        with yt_dlp.YoutubeDL({'quiet': True, 'extract_flat': True}) as ydl:
            info = ydl.extract_info(playlist_url, download=False)

        if 'entries' not in info:
            return jsonify({'status': 'error', 'message': 'No entries found in playlist'}), 404

        playlist_info = {
            'playlist_title': info.get('title', 'Untitled Playlist'),
            'video_count': len(info['entries']),
            'videos': []
        }

        for entry in info['entries']:
            playlist_info['videos'].append({
                'title': entry.get('title', 'Untitled'),
                'thumbnail': entry['thumbnails'][-1]['url'] if 'thumbnails' in entry and entry['thumbnails'] else '',
                'progress': '0%'
            })

        return jsonify({'status': 'success', 'data': playlist_info})

    except Exception as e:
        print(f"[ERROR] Exception occurred in playlist_data: {e}")
        return jsonify({'status': 'error', 'message': str(e)}), 500

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
