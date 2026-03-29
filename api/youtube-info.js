import play from 'play-dl';

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Missing YouTube URL' });
  }

  try {
    const info = await play.video_info(url);
    const title = info.video_details.title;
    const thumbnail = info.video_details.thumbnails.pop()?.url || '';

    // Muxed videos (Video + Audio)
    const videoFormats = info.format.filter(f => f.qualityLabel && f.audioQuality);
    const videos = videoFormats.map(f => ({
      itag: f.itag,
      quality: f.qualityLabel,
      url: f.url,
      container: f.container || f.mimeType?.split(';')[0]?.split('/')[1] || 'mp4'
    }));

    // Audio only streams
    const audioFormats = info.format.filter(f => !f.qualityLabel && f.audioQuality);
    const audios = audioFormats.map(f => ({
      itag: f.itag,
      audioBitrate: Math.round(f.bitrate ? f.bitrate / 1000 : 128),
      url: f.url,
      container: f.container || f.mimeType?.split(';')[0]?.split('/')[1] || 'm4a'
    }));

    res.status(200).json({ title, thumbnail, videos, audios });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
