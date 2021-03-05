let http = require('http');
let https = require('https');
let unzipper = require('unzipper');
let querystring = require('querystring');

// auth 路由：接收 code，访问 https://github.com/login/oauth/access_token 获取 token，再请求用户信息

function auth(req, res) {
  let query = querystring.parse(req.url.match(/^\/auth\?([\s\S]+)$/)[1]);
  console.log(query)
  getToken(query.code, token => {
    console.log(token)
    // res.write(JSON.stringify(info));
    res.write(`<a href="http://localhost:8083?token=${token.access_token}">publish</a>`);
    res.end();
  });
}

function getToken(code, callback) {
  let path = `/login/oauth/access_token?code=${code}&client_id=Iv1.aa18298f6e814efd&client_secret=de00bf8d12f6a819b7f6aa7b90ef98009b21d575`;
  console.log(path)
  let req = https.request({
    hostname: 'github.com',
    path: path,
    port: 443,
    method: 'POST',
  }, (res) => {
    let body = '';
    res.on('data', chunk => {
      body += chunk.toString();
    });
    res.on('end', chunk => {
      console.log(body);
      body = querystring.parse(body);
      callback(body);
    });
    console.log(res);
  });
  req.on('error', (e) => {
    console.error(e);
  });
  req.end();
}

function publish(req, res) {
  let query = querystring.parse(req.url.match(/^\/publish\?([\s\S]+)$/)[1]);
  getUser(query.token, (body) => {
    body = JSON.parse(body);
    if (body.login === 'gmaso') {

      req.pipe(unzipper.Extract({ path: '../server/public/sample' }));
    
      req.on('end', () => {
        res.end('Success');
      });
      } else {
        res.end('授权未通过');
      }
  });
}

function getUser(token, callback) {
  console.log('user')
  let request = https.request({
    hostname: 'api.github.com',
    path: '/user',
    port: 443,
    method: 'GET',
    headers: {
      Authorization: 'token ' + token,
      'User-Agent': 'toy'
      // 'Content-Length': stats.size
    }
  }, response => {
    let body = '';
    response.on('data', chunk => {
      body += chunk.toString();
    });
    response.on('end', () => {
      callback(body);
    })
  });
  request.end();
}

http.createServer(function(req, res) {
  console.log(req.url);
  if (req.url.match(/^\/auth\?/)) {
    return auth(req, res);
  }
  if (req.url.match(/^\/publish\?/)) {
    return publish(req, res);
  }
  
}).listen(8082);