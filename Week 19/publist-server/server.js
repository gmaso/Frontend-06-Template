let http = require('http');
let unzipper = require('unzipper');

http.createServer(function(req, res) {
  console.log('publish');
  
  req.pipe(unzipper.Extract({ path: '../server/public/sample' }));

  req.on('end', () => {
    res.end('Success');
  });
  
}).listen(8082);