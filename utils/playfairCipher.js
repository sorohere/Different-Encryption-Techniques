function generateKeyMatrix(keyword) {
    const key = keyword.toUpperCase().replace(/[^A-Z]/g, '');
    const uniqueKey = [];
    for (let char of key) {
      if (!uniqueKey.includes(char)) {
        uniqueKey.push(char);
      }
    }
    const alphabet = 'ABCDEFGHIKLMNOPQRSTUVWXYZ'; // Exclude J
    for (let char of alphabet) {
      if (!uniqueKey.includes(char)) {
        uniqueKey.push(char);
      }
    }
    const matrix = [];
    for (let i = 0; i < 5; i++) {
      matrix.push(uniqueKey.slice(i * 5, (i + 1) * 5));
    }
    return matrix;
  }
  
  function findPosition(matrix, char) {
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        if (matrix[i][j] === char) {
          return { row: i, col: j };
        }
      }
    }
    return null;
  }
  
  export function encrypt(text, keyword) {
    text = text.toUpperCase().replace(/[^A-Z]/g, '').replace(/J/g, 'I');
    let pairs = [];
    let i = 0;
    while (i < text.length) {
      if (i === text.length - 1 || text[i] === text[i + 1]) {
        pairs.push([text[i], 'X']);
        i++;
      } else {
        pairs.push([text[i], text[i + 1]]);
        i += 2;
      }
    }
    const matrix = generateKeyMatrix(keyword);
    let result = '';
    for (let pair of pairs) {
      const pos1 = findPosition(matrix, pair[0]);
      const pos2 = findPosition(matrix, pair[1]);
      if (pos1.row === pos2.row) {
        result += matrix[pos1.row][(pos1.col + 1) % 5];
        result += matrix[pos2.row][(pos2.col + 1) % 5];
      } else if (pos1.col === pos2.col) {
        result += matrix[(pos1.row + 1) % 5][pos1.col];
        result += matrix[(pos2.row + 1) % 5][pos2.col];
      } else {
        result += matrix[pos1.row][pos2.col];
        result += matrix[pos2.row][pos1.col];
      }
    }
    return result;
  }
  
  export function decrypt(text, keyword) {
    text = text.toUpperCase().replace(/[^A-Z]/g, '');
    const matrix = generateKeyMatrix(keyword);
    let result = '';
    for (let i = 0; i < text.length; i += 2) {
      const pair = [text[i], text[i + 1]];
      const pos1 = findPosition(matrix, pair[0]);
      const pos2 = findPosition(matrix, pair[1]);
      if (pos1.row === pos2.row) {
        result += matrix[pos1.row][(pos1.col - 1 + 5) % 5];
        result += matrix[pos2.row][(pos2.col - 1 + 5) % 5];
      } else if (pos1.col === pos2.col) {
        result += matrix[(pos1.row - 1 + 5) % 5][pos1.col];
        result += matrix[(pos2.row - 1 + 5) % 5][pos2.col];
      } else {
        result += matrix[pos1.row][pos2.col];
        result += matrix[pos2.row][pos1.col];
      }
    }
    return result.replace(/X/g, '');
  }