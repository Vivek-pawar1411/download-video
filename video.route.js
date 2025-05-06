const express = require('express');
const router = express.Router();
const { handleVideoDownload,handleGetAllVideos } = require('./video.controller');

router.post('/download', handleVideoDownload);
router.get('/videos', handleGetAllVideos);

module.exports = router;
