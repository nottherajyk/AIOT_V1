import play from 'play-dl';

export default async function handler(req, res) {
  const { url, itag, title } = req.query;

  if (!url || !itag) {
    return res.status(400).json({ error: 'Missing parameters' });
  }

  const cleanTitle = (title || 'video').replace(/[^a-zA-Z0-9 -]/g, '');
  const ext = parseInt(itag) > 130 ? 'm4a' : 'mp4'; 
  const filename = `${cleanTitle}.${ext}`;

  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.setHeader('Content-Type', ext === 'm4a' ? 'audio/mp4' : 'video/mp4');

  try {
    const streamInfo = await play.stream(url, { quality: parseInt(itag) });
    res.setHeader('Content-Length', streamInfo.content_length);
    
    streamInfo.stream
      .on('error', (err) => {
        console.error('Play-dl Error:', err);
        if (!res.headersSent) {
          res.status(500).json({ error: 'Stream error.' });
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
