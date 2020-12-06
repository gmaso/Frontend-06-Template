function UTF8_encoding(str) {
  const bytes = Buffer.from(str, 'utf8');
  const array = [];
  for (var i = 0; i < bytes.length; i++) {
    const binary = bytes[i];
    array.push(binary.toString(2).padStart(8, '0'));
  }

  console.log(array);
  return bytes;
}

// UTF8_encoding('极客');

UTF8_encoding('1');