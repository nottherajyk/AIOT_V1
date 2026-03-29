import { Innertube } from 'youtubei.js';

async function test() {
  try {
    const yt = await Innertube.create();
    const info = await yt.getInfo('jNQXAC9IVRw');
    console.log("Success! Title:", info.basic_info.title);
  } catch(e) {
    console.log("Error:", e.message);
  }
}
test();
