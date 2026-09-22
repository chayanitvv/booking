const express = require('express');
const { put } = require('@vercel/blob');

const router = express.Router();

router.post('/image', async (req, res, next) => {
  try {
    const { fileName, contentType, base64 } = req.body || {};

    if (!fileName || !base64) {
      return res.status(400).json({ message: 'fileName and base64 are required' });
    }

    const binary = Buffer.from(base64, 'base64');
    const blob = await put(fileName, binary, {
      access: 'public',
      contentType: contentType || 'application/octet-stream',
    });

    res.status(201).json({ url: blob.url, pathname: blob.pathname });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
