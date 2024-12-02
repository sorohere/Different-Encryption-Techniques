import { encrypt as additiveEncrypt, decrypt as additiveDecrypt } from './additiveCipher';
import { encrypt as multiplicativeEncrypt, decrypt as multiplicativeDecrypt } from './multiplicativeCipher';

export function encrypt(text, a, b) {
  let multiplicativeEncrypted = multiplicativeEncrypt(text, a);
  let affineEncrypted = additiveEncrypt(multiplicativeEncrypted, b);
  return affineEncrypted;
}

export function decrypt(text, a, b) {
  let additiveDecrypted = additiveDecrypt(text, b);
  let affineDecrypted = multiplicativeDecrypt(additiveDecrypted, a);
  return affineDecrypted;
}