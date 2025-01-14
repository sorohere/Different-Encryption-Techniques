# 🛡️✨ Encryption Wizard 🔐

A **modern web application** that allows users to **encrypt messages** using various classical cryptographic algorithms with **real-time visualization** of the encryption process. 🕵️‍♂️📜

---

## ✨ **Features** 🚀

- **🔢 Multiple Encryption Methods**: Support for **9 different classical encryption techniques**:
  - ➕ **Additive Cipher**
  - ✖️ **Multiplicative Cipher**
  - 🧮 **Affine Cipher**
  - 🗝️ **Autokey Cipher**
  - 🧩 **Playfair Cipher**
  - 🔐 **Vigenère Cipher**
  - 🟰 **Hill Cipher**
  - 🛤️ **Rail Fence Cipher**
  - 🔄 **Keyless Transformation Cipher**

- **📊 Real-time Visualization**: Watch your **plaintext** transform into **ciphertext** with **step-by-step visual explanations**! ✨👀

---

## 💻 **Installation** ⚙️

1. **Clone the repository** 🖥️:
   ```bash
   git clone https://github.com/NitinParamkar/Encryption-Wizard.git
   ```

2. **Navigate to the project directory** 📂:
   ```bash
   cd Encryption-Wizard
   ```

3. **Build the Docker image** 🐳:
   ```bash
   docker build -t encryption-techniques .
   ```

4. **Run the Docker container** 🏃‍♂️:
   ```bash
   docker run -p 3000:3000 encryption-techniques
   ```

5. Open your browser 🌐 and visit `http://localhost:3000` 🖱️

---

## 🎯 Usage 🛠️

1. **Select Encryption Method**: Choose from 9 different encryption algorithms
2. **Enter Message**: Type or paste your plaintext message
3. **Provide Key** (if required): Enter the encryption key based on the selected method
4. **Encrypt**: Click the "Encrypt Message" button to generate the ciphertext
5. **Visualize**: Click the "Visualize" button to see how the encryption works
6. **Copy**: Use the copy button to copy the encrypted message to your clipboard

