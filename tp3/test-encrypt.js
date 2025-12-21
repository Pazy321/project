// Простейшее "шифрование"
function encryptData(text) {
    console.log('Шифруем:', text);
    // Просто кодируем в base64
    return Buffer.from(text || '').toString('base64');
}

function createPhoneHash(phone) {
    console.log('Хешируем телефон:', phone);
    // Простой хеш
    const crypto = require('crypto');
    return crypto.createHash('md5').update(phone || '').digest('hex');
}

// Тест
const testName = "Иван Иванов";
const testPhone = "89081232323";

console.log('🔐 ТЕСТ ШИФРОВАНИЯ');
console.log('Оригинал имя:', testName);
console.log('Зашифровано:', encryptData(testName));
console.log('Оригинал телефон:', testPhone);
console.log('Зашифровано:', encryptData(testPhone));
console.log('Хеш телефона:', createPhoneHash(testPhone));
