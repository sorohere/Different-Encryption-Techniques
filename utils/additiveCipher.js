export function encrypt(text, key) {
    let result = '';
    for (let char of text) {
      if (char.match(/[a-zA-Z]/)) {
        const code = char.charCodeAt(0);
        const offset = code >= 65 && code <= 90 ? 65 : 97;
        result += String.fromCharCode((code - offset + key) % 26 + offset);
      } else {
        result += char;
      }
    }
    return result;
  }
  
  export function decrypt(text, key) {
    let result = '';
    for (let char of text) {
      if (char.match(/[a-zA-Z]/)) {
        const code = char.charCodeAt(0);
        const offset = code >= 65 && code <= 90 ? 65 : 97;
        result += String.fromCharCode((code - offset - key + 26) % 26 + offset);
      } else {
        result += char;
      }
    }
    return result;
  }