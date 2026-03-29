import play from 'play-dl';

async function test() {
  try {
    const info = await play.video_info('https://www.youtube.com/watch?v=jNQXAC9IVRw');
    console.log("Success! Title:", info.video_details.title);
  } catch (e) {
    console.log("Error:", e.message);
  }
}
test();
