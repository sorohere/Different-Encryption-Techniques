export const encrypt = (text) => {
  // Convert text to uppercase and remove non-alphabetic characters
  text = text.toUpperCase().replace(/[^A-Z]/g, '');
  
  let firstHalf = '';
  let secondHalf = '';
  
  // Split into two parts - even and odd positions
  for (let i = 0; i < text.length; i++) {
    if (i % 2 === 0) {
      firstHalf += text[i];
    } else {
      secondHalf += text[i];
    }
  }
  
  // Combine the two parts
  return firstHalf + secondHalf;
};

export const decrypt = (text) => {
  // Convert text to uppercase and remove non-alphabetic characters
  text = text.toUpperCase().replace(/[^A-Z]/g, '');
  
  let result = '';
  const mid = Math.ceil(text.length / 2);
  const firstHalf = text.substring(0, mid);
  const secondHalf = text.substring(mid);
  
  // Interleave the characters from both halves
  for (let i = 0; i < firstHalf.length; i++) {
    result += firstHalf[i];
    if (i < secondHalf.length) {
      result += secondHalf[i];
    }
  }
  
  return result;
};
