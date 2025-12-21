const crypto = require('crypto');

// Ключ из твоей базы данных (первые 32 байта)
const ENCRYPTION_KEY = 'd6f8c92a4e7b01f3a5e8c2d9b4f6a1c7';

// Функция шифрования
function encryptData(text) {
    try {
        if (!text || text === '') return '';
        
        const iv = crypto.randomBytes(16); // случайный вектор
        const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
        
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final('hex');
        
        // Сохраняем IV вместе с зашифрованным текстом
        return iv.toString('hex') + ':' + encrypted;
    } catch (error) {
        console.error('Ошибка шифрования:', error);
        return '';
    }
}

// Функция дешифрования
function decryptData(encryptedText) {
    try {
        if (!encryptedText || encryptedText === '') return '';
        
        const parts = encryptedText.split(':');
        if (parts.length !== 2) return '';
        
        const iv = Buffer.from(parts[0], 'hex');
        const encrypted = parts[1];
        
        const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY), iv);
        
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final('utf8');
        
        return decrypted;
    } catch (error) {
        console.error('Ошибка дешифрования:', error);
        return '';
    }
}

// Функция создания хеша
function createPhoneHash(phone) {
    try {
        if (!phone || phone === '') return '';
        return crypto.createHash('sha256').update(phone).digest('hex');
    } catch (error) {
        console.error('Ошибка создания хеша:', error);
        return '';
    }
}

module.exports = {
    encryptData,
    decryptData,
    createPhoneHash
};