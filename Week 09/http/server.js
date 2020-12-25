const http = require('http');

http.createServer((request, response) => {
  let body = [];
  request.on('error', (err) => {
    console.error(err);
  }).on('data', (chunk) => {
    body.push(chunk);
  }).on('end', () => {
    body = Buffer.concat(body).toString();
    console.log('body', body);
    response.writeHead(200, {'Content-Type': 'text/html'});
    response.end(`<html>
<head>
  <title>Document</title>
  <style>
    div {
      color: red;
    }
  </style>
</head>
<body>
  <div id="id" class="app">
    <span>test</span>
  </div>
</body>
</html>`);
  });
}).listen(8088);

console.log('server started');