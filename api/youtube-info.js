import ytdl from '@distube/ytdl-core';

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: 'Missing YouTube URL' });
  }

  try {
    const info = await ytdl.getInfo(url);
    const title = info.videoDetails.title;
    const thumbnail = info.videoDetails.thumbnails.pop()?.url || '';

    // Muxed videos (Video + Audio)
    const videoFormats = ytdl.filterFormats(info.formats, 'videoandaudio');
    const videos = videoFormats.map(f => ({
      itag: f.itag,
      quality: f.qualityLabel || f.resolution,
      url: f.url,
      container: f.container,
      hasAudio: f.hasAudio
    }));

    // Audio only streams
    const audioFormats = ytdl.filterFormats(info.formats, 'audioonly');
    const audios = audioFormats.map(f => ({
      itag: f.itag,
      audioBitrate: f.audioBitrate,
      url: f.url,
      container: f.container
    }));

    res.status(200).json({ title, thumbnail, videos, audios });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}
