import play from 'play-dl';
import fs from 'fs';

async function test() {
  try {
    const info = await play.video_info('https://www.youtube.com/watch?v=jNQXAC9IVRw');
    fs.writeFileSync('formats.json', JSON.stringify(info.format, null, 2));
    console.log("Done");
  } catch (e) {
    console.log("Error:", e.message);
  }
}
test();
