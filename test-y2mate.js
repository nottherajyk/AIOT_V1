async function test() {
  const params = new URLSearchParams();
  params.append('k_query', 'https://www.youtube.com/watch?v=jNQXAC9IVRw');
  params.append('k_page', 'home');
  params.append('hl', 'en');
  params.append('q_auto', '1');

  try {
    const res = await fetch('https://www.y2mate.com/mates/analyzeV2/ajax', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        'User-Agent': 'Mozilla/5.0'
      },
      body: params.toString()
    });
    const text = await res.text();
    console.log("Y2Mate resp length:", text.length, "Preview:", text.substring(0, 100));
  } catch (e) {
    console.log("Error:", e.message);
  }
}
test();
