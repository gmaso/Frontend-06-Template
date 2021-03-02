let http = require('http');
let fs = require('fs');
let archiver = require('archiver');

const archive = archiver('zip', {
  zlib: { level: 9}
});

archive.directory('./sample/', false);
archive.finalize();

// archive.pipe(fs.createWriteStream('sam.zip'));

// fs.stat('./sample.html', (err, stats) => {

  let request = http.request({
    hostname: '127.0.0.1',
    port: 8082,
    method: 'POST',
    headers: {
      'Content-type': 'application/octet-stream',
      // 'Content-Length': stats.size
    }
  }, response => {
    console.log(response);
  });


  archive.pipe(request);
  
  // let file = fs.createReadStream('./sample.html');
  
  // file.pipe(request);
  
  // file.on('end', () => {
  //   request.end();
  // });
// });


