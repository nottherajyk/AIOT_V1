const http = require('https');

function test(host, path, body) {
  const req = http.request({
    hostname: host,
    path: path,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  }, (res) => {
    let data = '';
    res.on('data', d => data += d);
    res.on('end', () => console.log(host, res.statusCode, data));
  });
  req.on('error', e => console.error(host, e.message));
  if (body) req.write(body);
  req.end();
}

test('co.wuk.sh', '/api/json', JSON.stringify({url: 'https://www.youtube.com/watch?v=jNQXAC9IVRw', "isAudioOnly": false }));
test('api.cobalt.tools', '/', JSON.stringify({url: 'https://www.youtube.com/watch?v=jNQXAC9IVRw' }));
