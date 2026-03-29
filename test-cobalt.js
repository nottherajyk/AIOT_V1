// test-cobalt.js
fetch("https://api.cobalt.tools/", {
  method: "POST",
  headers: {
    "Accept": "application/json",
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ url: "https://www.youtube.com/watch?v=jNQXAC9IVRw", vQuality: "1080", isAudioOnly: false })
}).then(r => r.json()).then(console.log).catch(console.error);
