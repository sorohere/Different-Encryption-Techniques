export function encrypt(text, key) {
  let result = '';
  let keyStream = '';
  const numKey = parseInt(key);
  
  // Convert initial numeric key to character
  const firstKeyChar = String.fromCharCode((numKey % 26) + 65);
  keyStream = firstKeyChar;

  let keyIndex = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char.match(/[a-zA-Z]/)) {
      const code = char.charCodeAt(0);
      const isUpperCase = code >= 65 && code <= 90;
      const offset = isUpperCase ? 65 : 97;
      const position = code - offset;
      
      // Get key character (first one from numeric key, then from plaintext)
      const keyChar = keyStream[keyIndex].toUpperCase();
      const keyCode = keyChar.charCodeAt(0) - 65;
      
      // Calculate encrypted character
      const shifted = (position + keyCode) % 26;
      result += String.fromCharCode(shifted + offset);
      
      // Add next key character from plaintext
      if (keyIndex === keyStream.length - 1) {
        keyStream += char.toUpperCase();
      }
      keyIndex++;
    } else {
      // Preserve spaces and other non-alphabetic characters
      result += char;
    }
  }
  return result;
}

export function decrypt(text, key) {
  let result = '';
  let keyStream = '';
  const numKey = parseInt(key);
  
  // Convert initial numeric key to character
  const firstKeyChar = String.fromCharCode((numKey % 26) + 65);
  keyStream = firstKeyChar;

  let keyIndex = 0;
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    if (char.match(/[a-zA-Z]/)) {
      const code = char.charCodeAt(0);
      const isUpperCase = code >= 65 && code <= 90;
      const offset = isUpperCase ? 65 : 97;
      const position = code - offset;
      
      // Get key character
      const keyChar = keyStream[keyIndex].toUpperCase();
      const keyCode = keyChar.charCodeAt(0) - 65;
      
      // Calculate decrypted character
      const shifted = (position - keyCode + 26) % 26;
      const decryptedChar = String.fromCharCode(shifted + offset);
      result += decryptedChar;
      
      // Add decrypted character to keystream
      if (keyIndex === keyStream.length - 1) {
        keyStream += decryptedChar.toUpperCase();
      }
      keyIndex++;
    } else {
      // Preserve spaces and other non-alphabetic characters
      result += char;
    }
  }
  return result;
}