function isValidMatrix(matrix, size) {
    if (!matrix || matrix.length !== size) {
        throw new Error(`Invalid matrix: must be ${size}x${size}`);
    }
    for (let row of matrix) {
        if (!row || row.length !== size) {
            throw new Error(`Invalid matrix row: must have ${size} elements`);
        }
        for (let element of row) {
            if (!Number.isInteger(element)) {
                throw new Error(`Invalid matrix element: must be an integer`);
            }
        }
    }
    return true;
}

function mod(x, m) {
    return ((x % m) + m) % m;
}

function determinant(matrix) {
    const n = matrix.length;
    if (n === 1) return matrix[0][0];
    if (n === 2) {
        return matrix[0][0] * matrix[1][1] - matrix[0][1] * matrix[1][0];
    }
    let det = 0;
    for (let i = 0; i < n; i++) {
        det += Math.pow(-1, i) * matrix[0][i] * determinant(getCofactor(matrix, 0, i));
    }
    return det;
}

function getCofactor(matrix, row, col) {
    return matrix
        .filter((_, rowIndex) => rowIndex !== row)
        .map(matrixRow => 
            matrixRow.filter((_, colIndex) => colIndex !== col)
        );
}

function modInverse(a, m) {
    for (let x = 1; x < m; x++) {
        if (mod(a * x, m) === 1) return x;
    }
    return -1;
}

function validateKeyMatrix(keyMatrix) {
    const size = keyMatrix.length;
    
    isValidMatrix(keyMatrix, size);

    const det = mod(determinant(keyMatrix), 26);
    if (det === 0 || modInverse(det, 26) === -1) {
        throw new Error("Invalid key matrix: determinant must be coprime with 26");
    }
}

function prepareMessage(message, size) {
    let prepared = message.toUpperCase().replace(/[^A-Z]/g, "");
    
    while (prepared.length % size !== 0) {
        prepared += 'X';
    }
    
    return prepared;
}

function hillCipherEncrypt(message, keyMatrix) {
    validateKeyMatrix(keyMatrix);
    
    const size = keyMatrix.length;
    
    const prepared = prepareMessage(message, size);
    
    let result = "";
    
    for (let i = 0; i < prepared.length; i += size) {
        let block = prepared.slice(i, i + size)
            .split('')
            .map(char => char.charCodeAt(0) - 65);
        
        let encryptedBlock = new Array(size).fill(0);
        for (let j = 0; j < size; j++) {
            for (let k = 0; k < size; k++) {
                encryptedBlock[j] += keyMatrix[j][k] * block[k];
            }
            encryptedBlock[j] = String.fromCharCode(mod(encryptedBlock[j], 26) + 65);
        }
        
        result += encryptedBlock.join('');
    }
    
    return result;
}

export { hillCipherEncrypt };