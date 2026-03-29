// test.js
const fetchUrls = [
  "https://api.vkrdownloader.vercel.app/server?v=https://www.youtube.com/watch?v=G5s4-Kak49o"
];

async function testAll() {
  for (const u of fetchUrls) {
    console.log("Testing", u);
    try {
      if (u.includes("vkrdownloader")) {
        const res = await fetch(u);
        const json = await res.json();
        console.log("VKR Status:", res.status, "JSON:", Object.keys(json));
        if (json.data) console.log("Has data for videos:", json.data.downloads?.length);
      }
    } catch (e) {
      console.log("Error:", e.message);
    }
  }
}

testAll();
