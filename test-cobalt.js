const instances = [
  "https://co.wuk.sh/api/json",
  "https://cobalt.api.timelessnesses.me/api/json",
  "https://api.cobalt.buss.lol/api/json",
  "https://cobalt-api.pewpew.icu/api/json",
  "https://cobalt.absoluteg.net/api/json",
  "https://dl.to.sij.is/api/json",
  "https://api.cobalt.tools/api/json",
];

async function testAll() {
  for (const url of instances) {
    try {
      const resp = await fetch(url, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          url: "https://www.youtube.com/watch?v=jNQXAC9IVRw",
          vQuality: "720",
          filenamePattern: "classic",
          isAudioOnly: false,
          disableMetadata: true
        })
      });
      const data = await resp.json();
      console.log(url, "=>", data.status ? data.status : data);
    } catch (e) {
      console.log(url, "=> Error", e.message);
    }
  }
}
testAll();
