# 🎬 ScrapeTube

**ScrapeTube** is a full-stack web application that allows you to **download entire YouTube playlists** in Full HD (up to 1080p), packaged neatly as a ZIP file.

This modern tool combines a sleek user interface with a powerful backend to give you a hassle-free way to archive YouTube playlists locally.

> ⚠️ For personal use only. Please respect YouTube's Terms of Service.

## 🔥 Features

- ✅ Download **entire YouTube playlists** (not just individual videos)
- 🎥 Get **MP4 videos** in **up to 1080p quality**
- 📁 Output videos as a **ZIP file** for easy download
- 🧼 Automatically **sanitizes filenames** to prevent OS conflicts
- ⚡ Responsive, modern UI with real-time download status
- 🧠 Smart playlist URL validation and cleaning
- 🌍 CORS-enabled backend for seamless cross-origin requests

## 🧱 Tech Stack

### 🖥️ Frontend
- **React** (with Next.js)
- **Tailwind CSS** for styling
- **Lucide-react** icons for a clean, modern UI

### 🧪 Backend
- **Flask (Python)** as the web server
- **yt-dlp** for downloading YouTube content
- **zipstream** for streaming ZIP file creation
- **Flask-CORS** for cross-origin support

## 🚀 Getting Started

Follow these steps to run ScrapeTube locally.

### 🛠 Requirements

- **Python 3.10**
- **Node.js** (v15 or higher recommended)
- `yt-dlp` (`pip install yt-dlp`)
- Python packages:
  - `flask`
  - `flask-cors`
  - `zipstream-new` *(not `zipstream` legacy version)*

---

### 🔧 Setup Instructions

#### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/scrapetube.git
cd scrapetube
```
#### 2. Backend Setup (Flask)
```bash
cd backend
pip install -r requirements.txt
python main.py
```
The Flask server will start at `http://localhost:5000`

#### 3. Frontend Setup (React + Next.js)
```bash
cd ../frontend
npm install
npm run dev
```

The frontend will start at `http://localhost:3000`

## 🌐 How It Works

1. **Paste** a valid YouTube playlist URL into the input field.
2. Click the **Download Playlist** button.
3. The app:
   - Validates and sanitizes the URL.
   - Fetches playlist metadata using `yt-dlp`.
   - Downloads all videos in MP4 format (up to 1080p).
   - Bundles everything into a ZIP file.
   - Streams the ZIP back to your browser for download.

## 🧪 API Endpoints

### 📥 POST /api/download

Downloads an entire YouTube playlist and returns a streamed ZIP file.

**Request Body:**

- url: YouTube playlist link  
  Example:
  {
    "url": "https://www.youtube.com/playlist?list=..."
  }

**Response:**

- Content-Type: application/zip  
- Triggers browser download of a file named `playlist.zip`


---

### 🔍 POST /api/playlist_data

Fetches metadata from a YouTube playlist (without downloading videos).

**Request Body:**

- url: YouTube playlist link  
  Example:
  {
    "url": "https://www.youtube.com/playlist?list=..."
  }

**Successful Response:**

- status: "success"
- data:
  - playlist_title
  - video_count
  - videos (array of { title, thumbnail, progress })

**Error Responses:**

- Returns proper HTTP status codes (400, 404, 500) and messages on invalid input or fetch errors.

## ⚖️ Legal Notice

This project is intended for **personal and educational use only**.

- Do **not** use ScrapeTube to download copyrighted material you do not have rights to.
- Respect YouTube’s [Terms of Service](https://www.youtube.com/t/terms).
- The creators of this project are **not responsible for misuse** of the tool.

By using this application, you agree to:
- Use it only for content you own or have permission to download.
- Avoid distributing downloaded content unlawfully.

## 👨‍💻 Author

**Your Name**  
GitHub: [@Nikk434](https://github.com/Nikk434)  

> Feel free to reach out or contribute to the project!


