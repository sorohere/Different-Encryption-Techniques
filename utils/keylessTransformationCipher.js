export const encrypt = (text, columns) => {
  // Remove spaces and convert to uppercase
  text = text.toUpperCase().replace(/[^A-Z]/g, '');
  
  // Calculate number of rows needed
  const numRows = Math.ceil(text.length / columns);
  
  // Create the grid and fill with characters
  const grid = Array(numRows).fill().map(() => Array(columns).fill(''));
  let charIndex = 0;
  
  // Fill the grid row by row
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < columns; col++) {
      if (charIndex < text.length) {
        grid[row][col] = text[charIndex];
        charIndex++;
      }
    }
  }
  
  // Read column by column to create ciphertext
  let result = '';
  for (let col = 0; col < columns; col++) {
    for (let row = 0; row < numRows; row++) {
      if (grid[row][col]) {
        result += grid[row][col];
      }
    }
  }
  
  return result;
};

export const decrypt = (text, columns) => {
  // Remove spaces and convert to uppercase
  text = text.toUpperCase().replace(/[^A-Z]/g, '');
  
  // Calculate number of rows needed
  const numRows = Math.ceil(text.length / columns);
  
  // Create the grid
  const grid = Array(numRows).fill().map(() => Array(columns).fill(''));
  let charIndex = 0;
  
  // Fill the grid column by column
  for (let col = 0; col < columns; col++) {
    for (let row = 0; row < numRows; row++) {
      if (charIndex < text.length) {
        grid[row][col] = text[charIndex];
        charIndex++;
      }
    }
  }
  
  // Read row by row to get plaintext
  let result = '';
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < columns; col++) {
      if (grid[row][col]) {
        result += grid[row][col];
      }
    }
  }
  
  return result;
};
