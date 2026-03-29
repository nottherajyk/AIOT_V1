export default async function handler(req, res) {
  const { shortcode } = req.query;

  if (!shortcode) {
    return res.status(400).json({ error: 'Missing shortcode parameter' });
  }

  // Validate shortcode format
  if (!/^[A-Za-z0-9_-]+$/.test(shortcode)) {
    return res.status(400).json({ error: 'Invalid shortcode' });
  }

  try {
    // Use Instagram's /media/ endpoint which redirects to the actual image
    const mediaUrl = `https://www.instagram.com/p/${shortcode}/media/?size=l`;

    const response = await fetch(mediaUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
        'Referer': 'https://www.instagram.com/',
      },
      redirect: 'follow',
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: 'Failed to fetch from Instagram' });
    }

    const contentType = response.headers.get('content-type') || 'image/jpeg';
    const buffer = Buffer.from(await response.arrayBuffer());

    // Validate it's actually an image
    if (buffer.length < 1000) {
      return res.status(404).json({ error: 'No image found. Post may be private.' });
    }

    // Set headers for image response
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Length', buffer.length);
    res.setHeader('Cache-Control', 'public, max-age=3600');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.send(buffer);
  } catch (error) {
    return res.status(500).json({ error: 'Server error: ' + error.message });
  }
}
