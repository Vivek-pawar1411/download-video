const { downloadVideo,getAllVideos } = require('./video.service');
const path = require('path');
const fs = require('fs');

async function handleVideoDownload(req, res) {
    const { url, filename } = req.body;

    if (!url || !filename) {
        return res.status(400).json({ success: false, message: 'URL and filename are required.' });
    }

    try {
        const { path: videoPath, video } = await downloadVideo(url, filename);

        // Ensure the video file exists before proceeding
        if (!fs.existsSync(videoPath)) {
            console.error('File not found at:', videoPath);
            return res.status(500).json({ success: false, message: 'Video download failed. File not found.' });
        }

        const videoSize = fs.statSync(videoPath).size; // Get the video size after confirming the file exists 
        console.log("👍🏻Video Dowloaded Successfully!");
        console.log('Video size in MB:', (videoSize / (1024 * 1024)).toFixed(2),'MB'); // Log the video size in megabytes
        console.log('Video path:', videoPath);
        console.log('Video info:', video); // Log the video info
        console.log('Video filename:', video.filename); // Log the video filename

        res.json({success: true, message: 'Video downloaded and saved to DB!', path: videoPath, video, size: videoSize });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to download video.' });
    }
}

async function handleGetAllVideos(req, res) {
    try {
        const videos = await getAllVideos();
        res.json({ success: true, videos });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Failed to retrieve videos.' });
    }
}

module.exports = { handleVideoDownload ,handleGetAllVideos };
