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
    response.end(
`<html meta=a >
<head>
    <style>
body div #myid {
    width:100px;
    background-color: #ff5000;
}
body div img{
    width:30px;
    background-color: #ff1111;
}
body div [id*=id] {
    border: 1px solid #ccc;
}
body div img#myid[id*=id][class$=eass] {
    height: 200px;
}
body div img#myid.myclass[id*=id][class$=ass] {
    height: 300px;
}
    </style>
</head>
<body>
    <div>
        <img id="myid" class="myclass"/>
        <img />
    </div>
</body>
</html>`);
  });
}).listen(8088);

console.log('server started');