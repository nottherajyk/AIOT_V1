// test-wuk.js
const fetchUrls = [
  "https://co.wuk.sh/api/json", 
  "https://api.cobalt.tools/",
  "https://cobalt-api.kwiatekm.pl/api/json",
  "https://api.vkrdownloader.vercel.app/server?v=https://www.youtube.com/watch?v=G5s4-Kak49o"
];

async function testAll() {
  for (const u of fetchUrls) {
    console.log("Testing", u);
    try {
      if (u.includes("vkrdownloader")) {
        const res = await fetch(u);
        const json = await res.json();
        console.log("VKR:", json);
      } else {
        const res = await fetch(u, {
          method: "POST",
          headers: { "Accept": "application/json", "Content-Type": "application/json" },
          body: JSON.stringify({ url: "https://www.youtube.com/watch?v=G5s4-Kak49o" })
        });
        const json = await res.json();
        console.log("Response:", json.status || json);
      }
    } catch (e) {
      console.log("Error:", e.message);
    }
  }
}

testAll();
