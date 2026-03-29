import ytdl from '@distube/ytdl-core';

export default function handler(req, res) {
  const { url, itag, title } = req.query;

  if (!url || !itag) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  const cleanTitle = (title || 'video').replace(/[^a-zA-Z0-9 -]/g, '');
  const ext = parseInt(itag) > 130 ? 'm4a' : 'mp4'; // roughly, audio-only itags are often m4a
  const filename = `${cleanTitle}.${ext}`;

  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.setHeader('Content-Type', ext === 'm4a' ? 'audio/mp4' : 'video/mp4');

  try {
    ytdl(url, { filter: format => format.itag == itag })
      .on('error', (err) => {
        console.error('YTDL Error:', err);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Failed to download video.' });
        } else {
          res.end();
        }
      })
      .pipe(res);
  } catch (error) {
    if (!res.headersSent) {
      res.status(500).json({ error: error.message });
    }
  }
}
