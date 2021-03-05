let http = require('http');
let fs = require('fs');
let archiver = require('archiver');
let child_process = require('child_process');
let querystring = require('querystring');

// 打开 GitHub oAuth 鉴权 https://github.com/login/oauth/authorize
child_process.exec(`wslview https://github.com/login/oauth/authorize?client_id=Iv1.aa18298f6e814efd`); // WSL 中需要把 open 替换成 wslview

http.createServer(function(req, res) {
  console.log(req.url);
  let query = /\?/.test(req.url) && querystring.parse(req.url.match(/^\/\?([\s\S]+)$/)[1]) || {};
  console.log(query)
  publish(query.token);
  res.end('Success');
}).listen(8083);

function publish(token) {
  const archive = archiver('zip', {
    zlib: { level: 9}
  });

  archive.directory('./sample/', false);
  archive.finalize();
  
  let request = http.request({
    hostname: 'localhost',
    path: '/publish?token=' + token,
    port: 8082,
    method: 'POST',
    headers: {
      'Content-type': 'application/octet-stream',
      // 'Content-Length': stats.size
    }
  }, response => {
    response.on('end', () => {
      request.end();
    })
  });

  archive.pipe(request);

}

