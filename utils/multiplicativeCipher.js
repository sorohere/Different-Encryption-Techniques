function gcd(a, b) {
    while (b !== 0) {
      let temp = b;
      b = a % b;
      a = temp;
    }
    return a;
  }
  
  export function encrypt(text, key) {
    if (gcd(key, 26) !== 1) {
      throw new Error('Key must be coprime with 26.');
    }
    let result = '';
    for (let char of text) {
      if (char.match(/[a-zA-Z]/)) {
        const code = char.charCodeAt(0);
        const offset = code >= 65 && code <= 90 ? 65 : 97;
        result += String.fromCharCode(((key * (code - offset)) % 26) + offset);
      } else {
        result += char;
      }
    }
    return result;
  }
  
  export function decrypt(text, key) {
    if (gcd(key, 26) !== 1) {
      throw new Error('Key must be coprime with 26.');
    }
    let result = '';
    const inverse = modInverse(key, 26);
    for (let char of text) {
      if (char.match(/[a-zA-Z]/)) {
        const code = char.charCodeAt(0);
        const offset = code >= 65 && code <= 90 ? 65 : 97;
        result += String.fromCharCode(((inverse * (code - offset)) % 26) + offset);
      } else {
        result += char;
      }
    }
    return result;
  }
  
  function modInverse(a, m) {
    a = a % m;
    for (let x = 1; x < m; x++) {
      if ((a * x) % m === 1) {
        return x;
      }
    }
    return -1;
  }