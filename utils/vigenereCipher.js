function getAlphabetIndex(char) {
    return char.toUpperCase().charCodeAt(0) - 65;
  }
  
  export function encrypt(text, key) {
    key = key.toUpperCase().replace(/[^A-Z]/g, '');
    let result = '';
    let keyIndex = 0;
    for (let char of text) {
      if (char.match(/[a-zA-Z]/)) {
        const shift = getAlphabetIndex(key[keyIndex % key.length]);
        const code = char.toUpperCase().charCodeAt(0);
        const shifted = ((code - 65 + shift) % 26) + 65;
        result += String.fromCharCode(shifted);
        keyIndex++;
      } else {
        result += char;
      }
    }
    return result;
  }
  
  export function decrypt(text, key) {
    key = key.toUpperCase().replace(/[^A-Z]/g, '');
    let result = '';
    let keyIndex = 0;
    for (let char of text) {
      if (char.match(/[a-zA-Z]/)) {
        const shift = getAlphabetIndex(key[keyIndex % key.length]);
        const code = char.toUpperCase().charCodeAt(0);
        const shifted = ((code - 65 - shift + 26) % 26) + 65;
        result += String.fromCharCode(shifted);
        keyIndex++;
      } else {
        result += char;
      }
    }
    return result;
  }