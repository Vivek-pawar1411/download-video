const youtubedl = require('yt-dlp-exec'); // yt-dlp wrapper
const fs = require('fs');
const path = require('path');
const { VideoEntity } = require('./video.entity');
const { AppDataSource } = require('./db'); // Fixed location

// ✅ Paths
const DOWNLOAD_DIR = 'C:\\Users\\vivek\\OneDrive\\Desktop\\Project\\video-downloader\\download';
const COOKIES_FILE = 'C:\\Users\\vivek\\OneDrive\\Desktop\\Project\\video-downloader\\cookies\\cookies.txt'; // ✅ FIXED: correct full path

// Create download folder if it doesn't exist
if (!fs.existsSync(DOWNLOAD_DIR)) {
    fs.mkdirSync(DOWNLOAD_DIR);
}

async function downloadVideo(url, filename) {
    const sanitizeFilename = (name) => name.replace(/[^a-z0-9_\-]/gi, '_');
    const safeFilename = sanitizeFilename(filename);
    const videoPath = path.join(DOWNLOAD_DIR, safeFilename + '.mkv');

    try {
        await youtubedl(url, {
            output: videoPath,
            format: 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
            ffmpegLocation: 'E:\\Download\\ffmpeg\\bin\\ffmpeg.exe',
            preferFreeFormats: true,
            addMetadata: true,
            noWarnings: true,
            retries: 3,
            cookies: COOKIES_FILE, // ✅ Use correct path to cookies.txt
            noCheckCertificates: true,
            socketTimeout: 300,
            restrictFilenames: true,
        });

        // Save video info to DB
        const videoRepository = AppDataSource.getRepository(VideoEntity);
        const video = videoRepository.create({
            filename: safeFilename + '.mkv',
            url,
            status: 'completed',
        });
        await videoRepository.save(video);

        return { path: videoPath, video };
    } catch (err) {
        console.error('Download failed:', err);
        throw new Error('Download failed');
    }
}

async function getAllVideos() {
    const videoRepository = AppDataSource.getRepository(VideoEntity);
    return await videoRepository.find();
}

module.exports = { downloadVideo, getAllVideos };
