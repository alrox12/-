// HTML-контент для четвертой лабораторной работы
function getLab4Content() {
    return `
        <div class="lab-section">
            <h2 class="lab-title">Лабораторная работа №4 - Алгоритм DES в режиме ECB</h2>
            <p><strong>Цель работы:</strong> Знакомство с классическим криптографическим алгоритмом DES и его работой в режиме ECB.</p>
            <p><strong>Индивидуальное задание:</strong> Реализация алгоритмов шифрования и дешифрования DES в режиме ECB</p>
            
            <label for="message-lab4">Исходное сообщение:</label>
            <textarea id="message-lab4" placeholder="Введите текст для шифрования"></textarea>
            
            <label for="key-lab4">Ключ (64 бита):</label>
            <input type="text" id="key-lab4" class="key-input" placeholder="Введите 64-битный ключ (16 шестнадцатеричных символов)" value="133457799BBCDFF1">
            
            <div class="key-input-container">
                <button id="generate-key-lab4" class="btn btn-success">Сгенерировать ключ</button>
                <button id="load-key-lab4" class="btn btn-secondary">Загрузить ключ из файла</button>
                <input type="file" id="key-file-input-lab4" accept=".txt" style="display: none;">
            </div>
            
            <label for="encrypted-message-lab4">Зашифрованное сообщение:</label>
            <textarea id="encrypted-message-lab4" placeholder="Результат шифрования (в шестнадцатеричном формате)"></textarea>
            
            <div class="button-group">
                <button id="encrypt-lab4" class="btn btn-primary">Зашифровать</button>
                <button id="decrypt-lab4" class="btn btn-secondary">Расшифровать</button>
            </div>
        </div>
    `;
}

// Инициализация функционала для четвертой лабораторной работы
function initLab4() {
    // Настройка обработчиков событий
    document.getElementById('encrypt-lab4').addEventListener('click', encryptLab4);
    document.getElementById('decrypt-lab4').addEventListener('click', decryptLab4);
    document.getElementById('generate-key-lab4').addEventListener('click', generateKeyLab4);
    document.getElementById('load-key-lab4').addEventListener('click', loadKeyLab4);
    
    // Привязка обработки файла для загрузки ключа
    loadKeyFromFile('key-file-input-lab4', 'key-lab4');
}

// Загрузка ключа из файла
function loadKeyLab4() {
    document.getElementById('key-file-input-lab4').click();
}

// Шифрование DES в режиме ECB
function encryptLab4() {
    // Валидация входных данных
    if (!validateInput('message-lab4', 
        value => value.length > 0,
        'Сообщение не должно быть пустым')) {
        return;
    }
    
    const desKey = document.getElementById('key-lab4').value;
    if (!validateInput('key-lab4',
        value => validateDesKey(value),
        'Ключ должен быть 64-битным (16 шестнадцатеричных символов)')) {
        return;
    }
    
    const message = document.getElementById('message-lab4').value;
    const encrypted = encryptDes(message, desKey);
    
    // Конвертируем результат в шестнадцатеричный формат для отображения
    const encryptedHex = bytesToHex(encrypted);
    
    // Отображаем результат
    document.getElementById('encrypted-message-lab4').value = encryptedHex;
}

// Расшифровка DES в режиме ECB
function decryptLab4() {
    // Валидация входных данных
    const encryptedHex = document.getElementById('encrypted-message-lab4').value;
    if (!validateInput('encrypted-message-lab4', 
        value => validateHexInput(value),
        'Зашифрованное сообщение должно быть в шестнадцатеричном формате')) {
        return;
    }
    
    const desKey = document.getElementById('key-lab4').value;
    if (!validateInput('key-lab4',
        value => validateDesKey(value),
        'Ключ должен быть 64-битным (16 шестнадцатеричных символов)')) {
        return;
    }
    
    // Конвертируем шестнадцатеричную строку обратно в массив байтов
    const encryptedBytes = hexToBytes(encryptedHex);
    
    // Расшифровываем сообщение
    const decryptedBytes = decryptDes(encryptedBytes, desKey);
    
    // Конвертируем байты в текст
    const decrypted = bytesToString(decryptedBytes);
    
    // Отображаем результат
    document.getElementById('message-lab4').value = decrypted;
}

// Проверка корректности DES ключа
function validateDesKey(key) {
    // Ключ должен состоять из 16 шестнадцатеричных символов (64 бита)
    if (key.length !== 16) {
        return false;
    }
    
    // Проверяем, что ключ содержит только шестнадцатеричные символы
    const hexChars = '0123456789ABCDEFabcdef';
    for (let i = 0; i < key.length; i++) {
        if (!hexChars.includes(key[i])) {
            return false;
        }
    }
    
    return true;
}

// Проверка корректности шестнадцатеричного ввода
function validateHexInput(input) {
    // Проверяем, что строка содержит только шестнадцатеричные символы и имеет четную длину
    if (input.length % 2 !== 0) {
        return false;
    }
    
    const hexChars = '0123456789ABCDEFabcdef';
    for (let i = 0; i < input.length; i++) {
        if (!hexChars.includes(input[i])) {
            return false;
        }
    }
    
    return true;
}

// Таблицы перестановок для DES

// Начальная перестановка IP
const IP = [
    58, 50, 42, 34, 26, 18, 10, 2,
    60, 52, 44, 36, 28, 20, 12, 4,
    62, 54, 46, 38, 30, 22, 14, 6,
    64, 56, 48, 40, 32, 24, 16, 8,
    57, 49, 41, 33, 25, 17, 9, 1,
    59, 51, 43, 35, 27, 19, 11, 3,
    61, 53, 45, 37, 29, 21, 13, 5,
    63, 55, 47, 39, 31, 23, 15, 7
];

// Конечная перестановка IP^-1
const IP_INV = [
    40, 8, 48, 16, 56, 24, 64, 32,
    39, 7, 47, 15, 55, 23, 63, 31,
    38, 6, 46, 14, 54, 22, 62, 30,
    37, 5, 45, 13, 53, 21, 61, 29,
    36, 4, 44, 12, 52, 20, 60, 28,
    35, 3, 43, 11, 51, 19, 59, 27,
    34, 2, 42, 10, 50, 18, 58, 26,
    33, 1, 41, 9, 49, 17, 57, 25
];

// Таблица расширения E
const E = [
    32, 1, 2, 3, 4, 5,
    4, 5, 6, 7, 8, 9,
    8, 9, 10, 11, 12, 13,
    12, 13, 14, 15, 16, 17,
    16, 17, 18, 19, 20, 21,
    20, 21, 22, 23, 24, 25,
    24, 25, 26, 27, 28, 29,
    28, 29, 30, 31, 32, 1
];

// P-перестановка
const P = [
    16, 7, 20, 21,
    29, 12, 28, 17,
    1, 15, 23, 26,
    5, 18, 31, 10,
    2, 8, 24, 14,
    32, 27, 3, 9,
    19, 13, 30, 6,
    22, 11, 4, 25
];

// Первоначальная перестановка ключа PC1
const PC1 = [
    57, 49, 41, 33, 25, 17, 9,
    1, 58, 50, 42, 34, 26, 18,
    10, 2, 59, 51, 43, 35, 27,
    19, 11, 3, 60, 52, 44, 36,
    63, 55, 47, 39, 31, 23, 15,
    7, 62, 54, 46, 38, 30, 22,
    14, 6, 61, 53, 45, 37, 29,
    21, 13, 5, 28, 20, 12, 4
];

// Перестановка ключа PC2
const PC2 = [
    14, 17, 11, 24, 1, 5,
    3, 28, 15, 6, 21, 10,
    23, 19, 12, 4, 26, 8,
    16, 7, 27, 20, 13, 2,
    41, 52, 31, 37, 47, 55,
    30, 40, 51, 45, 33, 48,
    44, 49, 39, 56, 34, 53,
    46, 42, 50, 36, 29, 32
];

// Таблица сдвигов для ключей
const SHIFTS = [1, 1, 2, 2, 2, 2, 2, 2, 1, 2, 2, 2, 2, 2, 2, 1];

// S-блоки
const S_BOXES = [
    [
        [14, 4, 13, 1, 2, 15, 11, 8, 3, 10, 6, 12, 5, 9, 0, 7],
        [0, 15, 7, 4, 14, 2, 13, 1, 10, 6, 12, 11, 9, 5, 3, 8],
        [4, 1, 14, 8, 13, 6, 2, 11, 15, 12, 9, 7, 3, 10, 5, 0],
        [15, 12, 8, 2, 4, 9, 1, 7, 5, 11, 3, 14, 10, 0, 6, 13]
    ],
    [
        [15, 1, 8, 14, 6, 11, 3, 4, 9, 7, 2, 13, 12, 0, 5, 10],
        [3, 13, 4, 7, 15, 2, 8, 14, 12, 0, 1, 10, 6, 9, 11, 5],
        [0, 14, 7, 11, 10, 4, 13, 1, 5, 8, 12, 6, 9, 3, 2, 15],
        [13, 8, 10, 1, 3, 15, 4, 2, 11, 6, 7, 12, 0, 5, 14, 9]
    ],
    [
        [10, 0, 9, 14, 6, 3, 15, 5, 1, 13, 12, 7, 11, 4, 2, 8],
        [13, 7, 0, 9, 3, 4, 6, 10, 2, 8, 5, 14, 12, 11, 15, 1],
        [13, 6, 4, 9, 8, 15, 3, 0, 11, 1, 2, 12, 5, 10, 14, 7],
        [1, 10, 13, 0, 6, 9, 8, 7, 4, 15, 14, 3, 11, 5, 2, 12]
    ],
    [
        [7, 13, 14, 3, 0, 6, 9, 10, 1, 2, 8, 5, 11, 12, 4, 15],
        [13, 8, 11, 5, 6, 15, 0, 3, 4, 7, 2, 12, 1, 10, 14, 9],
        [10, 6, 9, 0, 12, 11, 7, 13, 15, 1, 3, 14, 5, 2, 8, 4],
        [3, 15, 0, 6, 10, 1, 13, 8, 9, 4, 5, 11, 12, 7, 2, 14]
    ],
    [
        [2, 12, 4, 1, 7, 10, 11, 6, 8, 5, 3, 15, 13, 0, 14, 9],
        [14, 11, 2, 12, 4, 7, 13, 1, 5, 0, 15, 10, 3, 9, 8, 6],
        [4, 2, 1, 11, 10, 13, 7, 8, 15, 9, 12, 5, 6, 3, 0, 14],
        [11, 8, 12, 7, 1, 14, 2, 13, 6, 15, 0, 9, 10, 4, 5, 3]
    ],
    [
        [12, 1, 10, 15, 9, 2, 6, 8, 0, 13, 3, 4, 14, 7, 5, 11],
        [10, 15, 4, 2, 7, 12, 9, 5, 6, 1, 13, 14, 0, 11, 3, 8],
        [9, 14, 15, 5, 2, 8, 12, 3, 7, 0, 4, 10, 1, 13, 11, 6],
        [4, 3, 2, 12, 9, 5, 15, 10, 11, 14, 1, 7, 6, 0, 8, 13]
    ],
    [
        [4, 11, 2, 14, 15, 0, 8, 13, 3, 12, 9, 7, 5, 10, 6, 1],
        [13, 0, 11, 7, 4, 9, 1, 10, 14, 3, 5, 12, 2, 15, 8, 6],
        [1, 4, 11, 13, 12, 3, 7, 14, 10, 15, 6, 8, 0, 5, 9, 2],
        [6, 11, 13, 8, 1, 4, 10, 7, 9, 5, 0, 15, 14, 2, 3, 12]
    ],
    [
        [13, 2, 8, 4, 6, 15, 11, 1, 10, 9, 3, 14, 5, 0, 12, 7],
        [1, 15, 13, 8, 10, 3, 7, 4, 12, 5, 6, 11, 0, 14, 9, 2],
        [7, 11, 4, 1, 9, 12, 14, 2, 0, 6, 10, 13, 15, 3, 5, 8],
        [2, 1, 14, 7, 4, 10, 8, 13, 15, 12, 9, 0, 3, 5, 6, 11]
    ]
];

// Вспомогательные функции для работы с битами

// Преобразование байта в битовый массив (8 бит)
function byteToBits(byte) {
    const bits = [];
    for (let i = 7; i >= 0; i--) {
        bits.push((byte >> i) & 1);
    }
    return bits;
}

// Преобразование битового массива в байт
function bitsToByte(bits) {
    let byte = 0;
    for (let i = 0; i < 8; i++) {
        byte = (byte << 1) | bits[i];
    }
    return byte;
}

// Преобразование массива байтов в битовый массив
function bytesToBits(bytes) {
    const bits = [];
    for (const byte of bytes) {
        bits.push(...byteToBits(byte));
    }
    return bits;
}

// Преобразование битового массива в массив байтов
function bitsToBytes(bits) {
    const bytes = [];
    for (let i = 0; i < bits.length; i += 8) {
        const byteBits = bits.slice(i, i + 8);
        bytes.push(bitsToByte(byteBits));
    }
    return bytes;
}

// Применение перестановки к битовому массиву
function permute(bits, permutation) {
    const result = [];
    for (const pos of permutation) {
        result.push(bits[pos - 1]); // Таблицы используют 1-индексацию
    }
    return result;
}

// Циклический сдвиг влево
function leftShift(bits, n) {
    return [...bits.slice(n), ...bits.slice(0, n)];
}

// Разделение массива на две части
function split(bits) {
    const half = bits.length / 2;
    return [bits.slice(0, half), bits.slice(half)];
}

// Объединение двух массивов
function join(left, right) {
    return [...left, ...right];
}

// Генерация раундовых ключей
function generateRoundKeys(keyBits) {
    // Применяем первоначальную перестановку PC1
    const pc1Key = permute(keyBits, PC1);
    
    // Разделяем на две части
    let [c, d] = split(pc1Key);
    
    const roundKeys = [];
    
    // Генерируем 16 раундовых ключей
    for (let i = 0; i < 16; i++) {
        // Сдвигаем обе части
        c = leftShift(c, SHIFTS[i]);
        d = leftShift(d, SHIFTS[i]);
        
        // Объединяем и применяем PC2
        const combined = join(c, d);
        const roundKey = permute(combined, PC2);
        
        roundKeys.push(roundKey);
    }
    
    return roundKeys;
}

// Функция F для DES
function fFunction(right, roundKey) {
    // Расширяем правую часть с помощью E
    const expanded = permute(right, E);
    
    // XOR с раундовым ключом
    const xored = expanded.map((bit, i) => bit ^ roundKey[i]);
    
    // Применяем S-блоки
    const sboxResult = [];
    for (let i = 0; i < 8; i++) {
        const block = xored.slice(i * 6, (i + 1) * 6);
        const row = (block[0] << 1) | block[5];
        const col = (block[1] << 3) | (block[2] << 2) | (block[3] << 1) | block[4];
        const value = S_BOXES[i][row][col];
        
        // Преобразуем значение в 4 бита
        sboxResult.push((value >> 3) & 1);
        sboxResult.push((value >> 2) & 1);
        sboxResult.push((value >> 1) & 1);
        sboxResult.push(value & 1);
    }
    
    // Применяем P-перестановку
    return permute(sboxResult, P);
}

// Шифрование одного блока DES
function encryptDesBlock(blockBits, roundKeys) {
    // Начальная перестановка
    let permuted = permute(blockBits, IP);
    
    // Разделяем на левую и правую части
    let [left, right] = split(permuted);
    
    // 16 раундов Feistel сети
    for (let i = 0; i < 16; i++) {
        const temp = right;
        right = left.map((bit, j) => bit ^ fFunction(right, roundKeys[i])[j]);
        left = temp;
    }
    
    // Объединяем (обратный порядок на последнем раунде)
    const combined = join(right, left);
    
    // Конечная перестановка
    return permute(combined, IP_INV);
}

// Дешифрование одного блока DES
function decryptDesBlock(blockBits, roundKeys) {
    // Начальная перестановка
    let permuted = permute(blockBits, IP);
    
    // Разделяем на левую и правую части
    let [left, right] = split(permuted);
    
    // 16 раундов Feistel сети в обратном порядке
    for (let i = 15; i >= 0; i--) {
        const temp = right;
        right = left.map((bit, j) => bit ^ fFunction(right, roundKeys[i])[j]);
        left = temp;
    }
    
    // Объединяем (обратный порядок на последнем раунде)
    const combined = join(right, left);
    
    // Конечная перестановка
    return permute(combined, IP_INV);
}

// Основная функция шифрования DES в режиме ECB
function encryptDes(message, key) {
    // Преобразуем сообщение в массив байтов (UTF-8)
    const messageBytes = textToBytes(message);
    
    // Дополняем сообщение по PKCS#7
    const blockSize = 8;
    const paddedBytes = padMessagePKCS7(messageBytes, blockSize);
    
    // Преобразуем ключ в битовый массив
    const keyBytes = hexStringToBytes(key);
    const keyBits = bytesToBits(keyBytes);
    
    // Генерируем раундовые ключи
    const roundKeys = generateRoundKeys(keyBits);
    
    // Шифруем каждый блок
    const encryptedBytes = [];
    for (let i = 0; i < paddedBytes.length; i += blockSize) {
        const block = paddedBytes.slice(i, i + blockSize);
        const blockBits = bytesToBits(block);
        const encryptedBlockBits = encryptDesBlock(blockBits, roundKeys);
        const encryptedBlock = bitsToBytes(encryptedBlockBits);
        encryptedBytes.push(...encryptedBlock);
    }
    
    return encryptedBytes;
}

// Основная функция дешифрования DES в режиме ECB
function decryptDes(encryptedBytes, key) {
    // Преобразуем ключ в битовый массив
    const keyBytes = hexStringToBytes(key);
    const keyBits = bytesToBits(keyBytes);
    
    // Генерируем раундовые ключи
    const roundKeys = generateRoundKeys(keyBits);
    
    // Дешифруем каждый блок
    const decryptedBytes = [];
    for (let i = 0; i < encryptedBytes.length; i += 8) {
        const block = encryptedBytes.slice(i, i + 8);
        const blockBits = bytesToBits(block);
        const decryptedBlockBits = decryptDesBlock(blockBits, roundKeys);
        const decryptedBlock = bitsToBytes(decryptedBlockBits);
        decryptedBytes.push(...decryptedBlock);
    }
    
    // Удаляем дополнение PKCS#7
    return unpadMessagePKCS7(decryptedBytes);
}

// Дополнение сообщения по стандарту PKCS#7
function padMessagePKCS7(bytes, blockSize) {
    const paddingLength = blockSize - (bytes.length % blockSize);
    const paddedBytes = [...bytes];
    for (let i = 0; i < paddingLength; i++) {
        paddedBytes.push(paddingLength);
    }
    return paddedBytes;
}

// Удаление дополнения PKCS#7
function unpadMessagePKCS7(bytes) {
    const paddingLength = bytes[bytes.length - 1];
    return bytes.slice(0, bytes.length - paddingLength);
}

// Преобразование текста в массив байтов (UTF-8)
function textToBytes(text) {
    const encoder = new TextEncoder();
    return Array.from(encoder.encode(text));
}

// Преобразование массива байтов в строку
function bytesToString(bytes) {
    const decoder = new TextDecoder();
    return decoder.decode(new Uint8Array(bytes));
}

// Преобразование шестнадцатеричной строки в массив байтов 
function hexToBytes(hex) {
    const bytes = [];
    const hexChars = '0123456789ABCDEFabcdef';
    let cleanHex = '';

    // Фильтруем только допустимые шестнадцатеричные символы
    for (const char of hex) {
        if (hexChars.includes(char)) {
            cleanHex += char;
        }
    }

    // Проверяем, что длина чётная
    if (cleanHex.length % 2 !== 0) {
        // Необязательно: можно выбросить ошибку или дополнить нулём, но в вашем случае валидация уже есть выше
        // Для безопасности просто отбрасываем последний символ (или можно выбросить исключение)
        cleanHex = cleanHex.slice(0, -1);
    }

    for (let i = 0; i < cleanHex.length; i += 2) {
        bytes.push(parseInt(cleanHex.substring(i, i + 2), 16));
    }
    return bytes;
}

// Преобразование массива байтов в шестнадцатеричную строку
function bytesToHex(bytes) {
    return bytes.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
}

// Преобразование шестнадцатеричной строки в массив байтов
function hexStringToBytes(hex) {
    const bytes = [];
    for (let i = 0; i < hex.length; i += 2) {
        bytes.push(parseInt(hex.substring(i, i + 2), 16));
    }
    return bytes;
}

// Генерация случайного 64-битного ключа для DES
function generateKeyLab4() {
    let key = '';
    const hexChars = '0123456789ABCDEF';
    for (let i = 0; i < 16; i++) {
        key += hexChars.charAt(Math.floor(Math.random() * hexChars.length));
    }
    document.getElementById('key-lab4').value = key;
}
// Функция для искажения бита
function corruptBitAndDecrypt() {
    const encryptedHex = document.getElementById('encrypted-message-lab4').value;
    const key = document.getElementById('key-lab4').value;
    
    if (!encryptedHex || !validateDesKey(key)) {
        alert('Сначала зашифруйте сообщение!');
        return;
    }
    
    // Конвертируем hex в байты
    const bytes = hexToBytes(encryptedHex);
    
    // Искажаем один бит (первый бит первого байта)
    if (bytes.length > 0) {
        bytes[0] ^= 0x01; // Инвертируем младший бит
    }
    
    // Конвертируем обратно в hex
    const corruptedHex = bytesToHex(bytes);
    
    // Расшифровываем искаженные данные
    const decryptedBytes = decryptDes(bytes, key);
    const decryptedText = bytesToString(decryptedBytes);
    
    // Показываем результаты
    const result = [
        '=== Искажение бита в DES ===',
        `Исходная шифрограмма: ${encryptedHex.substring(0, 32)}...`,
        `Искаженная шифрограмма: ${corruptedHex.substring(0, 32)}...`,
        `Результат расшифровки: ${decryptedText}`,
        `Изменено битов: 1 из ${bytes.length * 8}`
    ].join('\n');
    
    alert(result);
    document.getElementById('encrypted-message-lab4').value = corruptedHex;
    document.getElementById('message-lab4').value = decryptedText;
}

// Функция для работы со слабыми ключами
function testWeakKeys() {
    const weakKeys = [
        '0101010101010101',
        'FEFEFEFEFEFEFEFE',
        'E0E0E0E0F1F1F1F1',
        '1F1F1F1F0E0E0E0E'
    ];
    
    const message = 'Test message for weak keys';
    const results = [];
    
    weakKeys.forEach(key => {
        const encrypted = encryptDes(message, key);
        const decrypted = bytesToString(decryptDes(encrypted, key));
        const hexResult = bytesToHex(encrypted);
        
        results.push(
            `Ключ: ${key}\n` +
            `Шифрограмма: ${hexResult.substring(0, 32)}...\n` +
            `Расшифровка: ${decrypted}\n` +
            `Соответствие: ${message === decrypted ? 'OK' : 'ERROR'}\n`
        );
    });
    
    alert('=== Тестирование слабых ключей DES ===\n\n' + results.join('\n'));
}