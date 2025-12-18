import CryptoJS from "crypto-js";

const SECRET_KEY = "cF0aBBcfBfO3eMrRC_XrZbqNJVc0JWFs";  // same as backend
const IV = "n33TnXUdCEgj-J0n";                          // same as backend

export function decryptValue(encryptedText) {
  const decrypted = CryptoJS.AES.decrypt(
    encryptedText,
    CryptoJS.enc.Utf8.parse(SECRET_KEY),
    {
      iv: CryptoJS.enc.Utf8.parse(IV),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    }
  );

  return decrypted.toString(CryptoJS.enc.Utf8);
}
