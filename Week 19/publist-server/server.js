let http = require('http');
let fs = require('fs');

http.createServer(function(req, res) {
  console.log(req.headers);

  let outFile = fs.createWriteStream('../server/public/index.html');

  req.on('data', chunk => {
    console.log(chunk.toString());
    outFile.write(chunk);
  });
  req.on('end', chunk => {
    outFile.end(chunk);
    res.end('Success');
  });
  
}).listen(8082);