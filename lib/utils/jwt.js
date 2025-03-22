import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secure-secret-key';

export const encryptValue = (value) => {
  return jwt.sign({ value }, JWT_SECRET);
};

export const decryptValue = (encryptedValue) => {
  try {
    const decoded = jwt.verify(encryptedValue, JWT_SECRET);
    return decoded.value;
  } catch (error) {
    console.error('Error decrypting value:', error);
    return null;
  }
};
