export function encrypt(text, key) {
    let result = '';
    key = key.toUpperCase().replace(/[^A-Z]/g, '');
    for (let i = 0; i < text.length; i++) {
      const char = text[i].toUpperCase();
      if (char.match(/[A-Z]/)) {
        const keyChar = i < key.length ? key[i] : char;
        const keyOffset = keyChar.charCodeAt(0) - 65;
        const charOffset = char.charCodeAt(0) - 65;
        result += String.fromCharCode((charOffset + keyOffset) % 26 + 65);
      } else {
        result += char;
      }
    }
    return result;
  }
  
  export function decrypt(text, key) {
    let result = '';
    key = key.toUpperCase().replace(/[^A-Z]/g, '');
    for (let i = 0; i < text.length; i++) {
      const char = text[i].toUpperCase();
      if (char.match(/[A-Z]/)) {
        const keyChar = i < key.length ? key[i] : result[i - key.length];
        const keyOffset = keyChar.charCodeAt(0) - 65;
        const charOffset = char.charCodeAt(0) - 65;
        result += String.fromCharCode((charOffset - keyOffset + 26) % 26 + 65);
      } else {
        result += char;
      }
    }
    return result;
  }