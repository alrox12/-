// Лабораторная работа №3 - Линейное шифрование (гаммирование)

// Параметры для лабораторной работы №3
const A_LAB3 = 17;    // Параметр A для генератора ПСЧ
const C_LAB3 = 39;    // Параметр C для генератора ПСЧ
const T0_LAB3 = 41;   // Начальное значение для генератора ПСЧ
const B_LAB3 = 256;   // Модуль для генератора ПСЧ

// HTML-контент для третьей лабораторной работы
function getLab3Content() {
    return `
        <div class="lab-section">
            <h2 class="lab-title">Лабораторная работа №3 - Линейное шифрование (гаммирование)</h2>
            <p><strong>Цель работы:</strong> Знакомство с классическим криптографическим алгоритмом - алгоритмом линейного шифрования данных (шифрования гаммированием).</p>
            <p><strong>Индивидуальное задание:</strong> Алфавит - расширенная таблица ASCII (256 элементов), B = 256, A = 17, C = 39, T(0) = 41</p>
            
            <label for="message-lab3">Исходное сообщение:</label>
            <textarea id="message-lab3" placeholder="Введите текст для шифрования"></textarea>
            
            <label for="key-lab3">Ключ (параметры генератора ПСЧ):</label>
            <input type="text" id="key-lab3" class="key-input" placeholder="Введите параметры A, C, T(0)" value="${A_LAB3},${C_LAB3},${T0_LAB3}">
            
            <div class="key-input-container">
                <button id="generate-key-lab3" class="btn btn-success">Сгенерировать ключ</button>
                <button id="load-key-lab3" class="btn btn-secondary">Загрузить ключ из файла</button>
                <input type="file" id="key-file-input-lab3" accept=".txt" style="display: none;">
            </div>
            
            <label for="encrypted-message-lab3">Зашифрованное сообщение:</label>
            <textarea id="encrypted-message-lab3" placeholder="Результат шифрования (в шестнадцатеричном формате)"></textarea>
            
            <div class="button-group">
                <button id="encrypt-lab3" class="btn btn-primary">Зашифровать</button>
                <button id="decrypt-lab3" class="btn btn-secondary">Расшифровать</button>
            </div>
        </div>
    `;
}

// Инициализация функционала для третьей лабораторной работы
function initLab3() {
    // Настройка обработчиков событий
    document.getElementById('encrypt-lab3').addEventListener('click', encryptLab3);
    document.getElementById('decrypt-lab3').addEventListener('click', decryptLab3);
    document.getElementById('generate-key-lab3').addEventListener('click', generateKeyLab3);
    document.getElementById('load-key-lab3').addEventListener('click', loadKeyLab3);
    
    // Привязка обработки файла для загрузки ключа
    loadKeyFromFile('key-file-input-lab3', 'key-lab3');
}

// Загрузка ключа из файла
function loadKeyLab3() {
    document.getElementById('key-file-input-lab3').click();
}

// Шифрование методом гаммирования
function encryptLab3() {
    // Валидация входных данных
    if (!validateInput('message-lab3', 
        value => value.length > 0,
        'Сообщение не должно быть пустым')) {
        return;
    }
    
    const keyParams = document.getElementById('key-lab3').value.split(',');
    if (!validateInput('key-lab3',
        value => validateGammaKey(value),
        'Ключ должен содержать три числа в формате: A,C,T(0)')) {
        return;
    }
    
    const message = document.getElementById('message-lab3').value;
    const [A, C, T0] = keyParams.map(param => parseInt(param.trim()));
    
    // Шифрование с поддержкой Unicode
    const { encryptedHex, gamma } = encryptWithGamma(message, A, C, T0);
    
    // Отображаем результаты
    document.getElementById('encrypted-message-lab3').value = encryptedHex;
}

// Расшифровка методом гаммирования
function decryptLab3() {
    // Валидация входных данных
    if (!validateInput('encrypted-message-lab3', 
        value => validateHexInput(value),
        'Зашифрованное сообщение должно быть в шестнадцатеричном формате')) {
        return;
    }
    
    const keyParams = document.getElementById('key-lab3').value.split(',');
    if (!validateInput('key-lab3',
        value => validateGammaKey(value),
        'Ключ должен содержать три числа в формате: A,C,T(0)')) {
        return;
    }
    
    const encryptedHex = document.getElementById('encrypted-message-lab3').value;
    const [A, C, T0] = keyParams.map(param => parseInt(param.trim()));
    
    // Расшифровка с поддержкой Unicode
    const decrypted = decryptWithGamma(encryptedHex, A, C, T0);
    
    // Отображаем результат
    document.getElementById('message-lab3').value = decrypted;
}

// Проверка корректности ключа для гаммирования
function validateGammaKey(key) {
    const params = key.split(',');
    if (params.length !== 3) {
        return false;
    }
    
    // Проверяем, что все параметры являются числами
    for (const param of params) {
        const num = parseInt(param.trim());
        if (isNaN(num) || num <= 0) {
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
    
    // Проверяем каждый символ на принадлежность к шестнадцатеричному набору
    const hexChars = '0123456789ABCDEFabcdef';
    for (let i = 0; i < input.length; i++) {
        if (!hexChars.includes(input[i])) {
            return false;
        }
    }
    
    return true;
}

// Шифрование с поддержкой Unicode
function encryptWithGamma(text, A, C, T0) {
    // Преобразуем текст в массив байтов в кодировке UTF-8
    const textBytes = textToUtf8Bytes(text);
    
    // Генерируем гамму нужной длины
    const gamma = generateGamma(A, C, T0, textBytes.length);
    
    // Преобразуем гамму в байты
    const gammaBytes = stringToBytes(gamma);
    
    // Выполняем XOR операцию над байтами
    const encryptedBytes = xorBytes(textBytes, gammaBytes);
    
    // Преобразуем результат в шестнадцатеричную строку
    const encryptedHex = bytesToHex(encryptedBytes);
    
    return { encryptedHex, gamma };
}

// Расшифровка с поддержкой Unicode
function decryptWithGamma(encryptedHex, A, C, T0) {
    // Преобразуем шестнадцатеричную строку в массив байтов
    const encryptedBytes = hexToBytes(encryptedHex);
    
    // Генерируем гамму нужной длины
    const gamma = generateGamma(A, C, T0, encryptedBytes.length);
    
    // Преобразуем гамму в байты
    const gammaBytes = stringToBytes(gamma);
    
    // Выполняем XOR операцию над байтами
    const decryptedBytes = xorBytes(encryptedBytes, gammaBytes);
    
    // Преобразуем байты обратно в текст UTF-8
    return utf8BytesToString(decryptedBytes);
}

// Генерация гаммы с использованием линейного конгруэнтного метода
function generateGamma(A, C, T0, length) {
    let gamma = '';
    let x = T0;
    
    for (let i = 0; i < length; i++) {
        // Генерируем следующее псевдослучайное число
        x = (A * x + C) % B_LAB3;
        // Преобразуем число в символ
        gamma += String.fromCharCode(x);
    }
    
    return gamma;
}

// Преобразование текста в массив байтов в кодировке UTF-8
function textToUtf8Bytes(text) {
    const encoder = new TextEncoder();
    return Array.from(encoder.encode(text));
}

// Преобразование массива байтов в строку UTF-8
function utf8BytesToString(bytes) {
    const decoder = new TextDecoder();
    return decoder.decode(new Uint8Array(bytes));
}

// Преобразование строки в массив байтов
function stringToBytes(str) {
    const bytes = [];
    for (let i = 0; i < str.length; i++) {
        bytes.push(str.charCodeAt(i) & 0xFF);
    }
    return bytes;
}

// Преобразование массива байтов в шестнадцатеричную строку
function bytesToHex(bytes) {
    return bytes.map(b => b.toString(16).padStart(2, '0')).join('').toUpperCase();
}

// Преобразование шестнадцатеричной строки в массив байтов
function hexToBytes(hex) {
    const bytes = [];
    for (let i = 0; i < hex.length; i += 2) {
        bytes.push(parseInt(hex.substring(i, i + 2), 16));
    }
    return bytes;
}

// Операция XOR между массивами байтов
function xorBytes(bytes1, bytes2) {
    const result = [];
    const length = Math.min(bytes1.length, bytes2.length);
    
    for (let i = 0; i < length; i++) {
        result.push(bytes1[i] ^ bytes2[i]);
    }
    
    return result;
}

// Генерация случайных параметров для гаммирования
function generateKeyLab3() {
    // Генерируем параметры в соответствии с требованиями
    // A должно удовлетворять условию: A mod 4 = 1
    let A;
    do {
        A = getRandomInt(1, 100);
    } while (A % 4 !== 1);
    
    // C должно быть нечетным
    let C = getRandomInt(1, 100);
    if (C % 2 === 0) {
        C++;
    }
    
    // T0 - начальное значение
    const T0 = getRandomInt(1, 100);
    
    document.getElementById('key-lab3').value = `${A},${C},${T0}`;
}
function saveGammaSequence() {
    const message = document.getElementById('message-lab3').value;
    const keyParams = document.getElementById('key-lab3').value.split(',');
    
    if (!message || keyParams.length !== 3) {
        alert('Введите данные для генерации гаммы!');
        return;
    }
    
    const [A, C, T0] = keyParams.map(p => parseInt(p.trim()));
    const textBytes = textToUtf8Bytes(message);
    const gamma = generateGamma(A, C, T0, textBytes.length);
    
    const content = [
        '=== Гамма для линейного шифрования ===',
        `Параметры: A=${A}, C=${C}, T0=${T0}`,
        `Длина гаммы: ${gamma.length} символов`,
        `Гамма (шестнадцатеричный формат):`,
        bytesToHex(stringToBytes(gamma))
    ].join('\n');
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gamma_sequence.txt';
    a.click();
    URL.revokeObjectURL(url);
}
/*
Документация по использованным функциям и операторам:

1. TextEncoder() - встроенный объект для кодирования текста в UTF-8
   - Используется для преобразования текста в массив байтов
   - Пример: const encoder = new TextEncoder(); encoder.encode(text)

2. TextDecoder() - встроенный объект для декодирования байтов в текст UTF-8
   - Используется для преобразования массива байтов обратно в текст
   - Пример: const decoder = new TextDecoder(); decoder.decode(bytes)

3. Array.from() - создает новый массив из массивоподобного объекта
   - Используется для преобразования TypedArray в обычный массив
   - Пример: Array.from(encoder.encode(text))

4. Uint8Array() - типизированный массив для работы с 8-битными беззнаковыми целыми числами
   - Используется для передачи данных в TextDecoder
   - Пример: new Uint8Array(bytes)

5. String.fromCharCode(code) - создает строку из кодов символов
   - Используется для генерации гаммы из числовых значений
   - Пример: String.fromCharCode(x)

6. String.charCodeAt(index) - возвращает код символа в указанной позиции
   - Используется для преобразования символов в коды
   - Пример: str.charCodeAt(i)

7. String.toString(radix) - преобразует число в строку в указанной системе счисления
   - Используется для преобразования байтов в шестнадцатеричный формат
   - Пример: b.toString(16)

8. String.padStart(targetLength, padString) - дополняет строку другой строкой до указанной длины
   - Используется для форматирования шестнадцатеричных кодов
   - Пример: .padStart(2, '0')

9. parseInt(string, radix) - преобразует строку в целое число в указанной системе счисления
   - Используется для преобразования шестнадцатеричных кодов в числа
   - Пример: parseInt(hex.substring(i, i + 2), 16)

10. Array.map(callback) - создает новый массив с результатами вызова функции для каждого элемента
    - Используется для преобразования массива байтов в шестнадцатеричную строку
    - Пример: bytes.map(b => b.toString(16).padStart(2, '0'))

11. Array.join(separator) - объединяет все элементы массива в строку
    - Используется для объединения шестнадцатеричных кодов в одну строку
    - Пример: .join('')

12. String.toUpperCase() - преобразует строку в верхний регистр
    - Используется для единообразного отображения шестнадцатеричных значений
    - Пример: .toUpperCase()

13. Math.min(value1, value2) - возвращает наименьшее из двух чисел
    - Используется для определения длины обработки в операции XOR
    - Пример: Math.min(bytes1.length, bytes2.length)

14. % (оператор остатка от деления) - возвращает остаток от деления одного числа на другое
    - Используется в генераторе ПСЧ
    - Пример: x = (A * x + C) % B_LAB3

15. ^ (побитовое XOR) - выполняет побитовую операцию исключающего ИЛИ
    - Используется для операции шифрования и дешифрования
    - Пример: bytes1[i] ^ bytes2[i]
*/