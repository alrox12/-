// Лабораторная работа №2 - Шифрование методом перестановки

// Алфавит для шифрования (16-ричные цифры)
const ALPHABET_LAB2 = '0123456789ABCDEF';
const BLOCK_SIZE_LAB2 = 16; // Размер блока для перестановки

// HTML-контент для второй лабораторной работы
function getLab2Content() {
    return `
        <div class="lab-section">
            <h2 class="lab-title">Лабораторная работа №2 - Шифрование методом перестановки</h2>
            <p><strong>Цель работы:</strong> Знакомство с классическим криптографическим алгоритмом - алгоритмом шифрования данных при помощи перестановки.</p>
            <p><strong>Индивидуальное задание:</strong> V = {0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F}, m = 16</p>
            
            <label for="message-lab2">Исходное сообщение:</label>
            <textarea id="message-lab2" placeholder="Введите текст для шифрования (только 16-ричные цифры без пробелов)"></textarea>
            
            <label for="key-lab2">Ключ (перестановка позиций):</label>
            <input type="text" id="key-lab2" class="key-input" placeholder="Введите ключ для шифрования (16 символов из алфавита 0-9, A-F)" value="">
            
            <div class="key-input-container">
                <button id="generate-key-lab2" class="btn btn-success">Сгенерировать ключ</button>
                <button id="load-key-lab2" class="btn btn-secondary">Загрузить ключ из файла</button>
                <input type="file" id="key-file-input-lab2" accept=".txt" style="display: none;">
            </div>
            
            <label for="encrypted-message-lab2">Зашифрованное сообщение:</label>
            <textarea id="encrypted-message-lab2" placeholder="Результат шифрования"></textarea>
            
            <div class="button-group">
                <button id="encrypt-lab2" class="btn btn-primary">Зашифровать</button>
                <button id="decrypt-lab2" class="btn btn-secondary">Расшифровать</button>
            </div>
        </div>
    `;
}

// Инициализация функционала для второй лабораторной работы
function initLab2() {
    // Настройка обработчиков событий
    document.getElementById('encrypt-lab2').addEventListener('click', encryptLab2);
    document.getElementById('decrypt-lab2').addEventListener('click', decryptLab2);
    document.getElementById('generate-key-lab2').addEventListener('click', generateKeyLab2);
    document.getElementById('load-key-lab2').addEventListener('click', loadKeyLab2);
    
    // Привязка обработки файла для загрузки ключа
    loadKeyFromFile('key-file-input-lab2', 'key-lab2');
}

// Загрузка ключа из файла
function loadKeyLab2() {
    document.getElementById('key-file-input-lab2').click();
}

// Шифрование методом перестановки
function encryptLab2() {
    // Валидация входных данных
    if (!validateInput('message-lab2', 
        value => validateAlphabetInput(value.toUpperCase(), ALPHABET_LAB2),
        'Сообщение должно содержать только 16-ричные цифры (0-9, A-F)')) {
        return;
    }
    
    const key = document.getElementById('key-lab2').value;
    if (!validateInput('key-lab2',
        value => validatePermutationKey(value),
        'Ключ должен содержать 16 уникальных символов из алфавита 0-9, A-F')) {
        return;
    }
    
    const message = document.getElementById('message-lab2').value.toUpperCase();
    const encrypted = cipherPermutation(message, key);
    
    // Отображаем результат
    document.getElementById('encrypted-message-lab2').value = encrypted;
}

// Расшифровка методом перестановки
function decryptLab2() {
    // Валидация входных данных
    if (!validateInput('encrypted-message-lab2', 
        value => validateAlphabetInput(value.toUpperCase(), ALPHABET_LAB2),
        'Зашифрованное сообщение должно содержать только 16-ричные цифры (0-9, A-F)')) {
        return;
    }
    
    const key = document.getElementById('key-lab2').value;
    if (!validateInput('key-lab2',
        value => validatePermutationKey(value),
        'Ключ должен содержать 16 уникальных символов из алфавита 0-9, A-F')) {
        return;
    }
    
    const encrypted = document.getElementById('encrypted-message-lab2').value.toUpperCase();
    const decrypted = decipherPermutation(encrypted, key);
    
    // Отображаем результат
    document.getElementById('message-lab2').value = decrypted;
}

// Проверка корректности ключа перестановки
function validatePermutationKey(key) {
    // Проверяем длину ключа
    if (key.length !== ALPHABET_LAB2.length) {
        return false;
    }
    
    // Проверяем, что все символы уникальны
    const uniqueChars = new Set();
    for (let i = 0; i < key.length; i++) {
        // Проверяем, что символ принадлежит алфавиту
        if (!ALPHABET_LAB2.includes(key[i])) {
            return false;
        }
        
        // Проверяем, что символ не повторяется
        if (uniqueChars.has(key[i])) {
            return false;
        }
        
        uniqueChars.add(key[i]);
    }
    
    return true;
}

// Шифрование методом перестановки
function cipherPermutation(text, key) {
    // Дополняем текст до кратности размеру блока
    while (text.length % BLOCK_SIZE_LAB2 !== 0) {
        text += ALPHABET_LAB2[0]; // Дополняем нулями
    }
    
    let result = '';
    
    // Обрабатываем текст блоками
    for (let i = 0; i < text.length; i += BLOCK_SIZE_LAB2) {
        const block = text.substring(i, i + BLOCK_SIZE_LAB2);
        const permutedBlock = permuteBlock(block, key, true);
        result += permutedBlock;
    }
    
    return result;
}

// Расшифровка методом перестановки
function decipherPermutation(text, key) {
    // Дополняем текст до кратности размеру блока (если нужно)
    while (text.length % BLOCK_SIZE_LAB2 !== 0) {
        text += ALPHABET_LAB2[0]; // Дополняем нулями
    }
    
    let result = '';
    
    // Обрабатываем текст блоками
    for (let i = 0; i < text.length; i += BLOCK_SIZE_LAB2) {
        const block = text.substring(i, i + BLOCK_SIZE_LAB2);
        const permutedBlock = permuteBlock(block, key, false);
        result += permutedBlock;
    }
    
    return result;
}

// Перестановка одного блока текста
function permuteBlock(block, key, isEncrypt) {
    const result = new Array(BLOCK_SIZE_LAB2);
    
    if (isEncrypt) {
        // Прямая перестановка при шифровании
        for (let i = 0; i < BLOCK_SIZE_LAB2; i++) {
            const originalChar = ALPHABET_LAB2[i];
            const pos = key.indexOf(originalChar);
            if (pos !== -1) {
                result[pos] = block[i];
            }
        }
    } else {
        // Обратная перестановка при расшифровке
        for (let i = 0; i < BLOCK_SIZE_LAB2; i++) {
            const originalChar = key[i];
            const pos = ALPHABET_LAB2.indexOf(originalChar);
            if (pos !== -1) {
                result[pos] = block[i];
            }
        }
    }
    
    // Если остались не заполненные позиции, копируем оригинальный блок
    for (let i = 0; i < BLOCK_SIZE_LAB2; i++) {
        if (result[i] === undefined) {
            result[i] = block[i];
        }
    }
    
    return result.join('');
}

// Генерация случайного ключа для перестановки
function generateKeyLab2() {
    // Генерируем случайную перестановку алфавита
    const shuffled = shuffleString(ALPHABET_LAB2);
    document.getElementById('key-lab2').value = shuffled;
}
function analyzePermutation() {
    const key = document.getElementById('key-lab2').value;
    const message = document.getElementById('message-lab2').value;
    
    if (!message || !validatePermutationKey(key)) {
        alert('Введите корректные данные!');
        return;
    }
    
    const encrypted = cipherPermutation(message, key);
    const decrypted = decipherPermutation(encrypted, key);
    
    const analysis = [
        '=== Анализ алгоритма перестановки ===',
        `Исходный текст: ${message}`,
        `Ключ: ${key}`,
        `Зашифрованный текст: ${encrypted}`,
        `Расшифрованный текст: ${decrypted}`,
        `Проверка: ${message === decrypted ? 'УСПЕШНО' : 'ОШИБКА'}`,
        `Длина блока: ${BLOCK_SIZE_LAB2}`,
        `Размер алфавита: ${ALPHABET_LAB2.length}`
    ].join('\n');
    
    alert(analysis);
}
/*
Документация по использованным функциям и операторам:

1. document.getElementById(id) - возвращает элемент с указанным ID
   - Используется для получения доступа к элементам интерфейса
   - Пример: document.getElementById('key-lab2') получает поле ввода ключа

2. Element.addEventListener(event, handler) - добавляет обработчик события к элементу
   - Используется для реагирования на клики по кнопкам
   - Пример: document.getElementById('encrypt-lab2').addEventListener('click', encryptLab2)

3. Element.value - свойство для получения или установки значения элемента формы
   - Используется для работы с текстом в полях ввода
   - Пример: document.getElementById('message-lab2').value

4. String.toUpperCase() - преобразует строку в верхний регистр
   - Используется для единообразного представления 16-ричных символов
   - Пример: text.toUpperCase()

5. new Set() - создает новый объект Set для хранения уникальных значений
   - Используется для проверки уникальности символов в ключе
   - Пример: const uniqueChars = new Set()

6. Set.has(value) - проверяет, содержит ли Set указанное значение
   - Используется для проверки уникальности символов
   - Пример: if (uniqueChars.has(key[i])) { ... }

7. Set.add(value) - добавляет значение в Set
   - Используется для добавления символов в Set при проверке
   - Пример: uniqueChars.add(key[i])

8. String.includes(searchString) - проверяет, содержит ли строка указанную подстроку
   - Используется для проверки принадлежности символа алфавиту
   - Пример: ALPHABET_LAB2.includes(key[i])

9. String.substring(start, end) - возвращает подстроку между указанными индексами
   - Используется для разбивки текста на блоки
   - Пример: text.substring(i, i + BLOCK_SIZE_LAB2)

10. String.indexOf(searchString) - возвращает индекс первого вхождения подстроки
    - Используется для поиска позиции символа в алфавите и ключе
    - Пример: key.indexOf(originalChar)

11. for (let i = 0; i < length; i++) {} - цикл for для итерации по диапазону значений
    - Используется для обработки блоков текста и проверки ключа
    - Пример: for (let i = 0; i < key.length; i++) { ... }

12. if (condition) {} else {} - условный оператор для выполнения кода в зависимости от условия
    - Используется для выбора прямой или обратной перестановки
    - Пример: if (isEncrypt) { ... } else { ... }

13. while (condition) {} - цикл, выполняющийся пока условие истинно
    - Используется для дополнения текста до кратности размеру блока
    - Пример: while (text.length % BLOCK_SIZE_LAB2 !== 0) { ... }

14. const, let - объявление констант и переменных с блочной областью видимости
    - Используется для хранения временных значений
    - Пример: const shuffled = shuffleString(ALPHABET_LAB2)

15. Array.forEach(callback) - выполняет указанную функцию для каждого элемента массива
    - Используется в utils.js для обработки файлов
    - Пример: files.forEach(file => { ... })

16. document.createElement(tagName) - создает новый HTML-элемент указанного типа
    - Используется для динамического создания таблицы
    - Пример: const row = document.createElement('tr')

17. Element.appendChild(child) - добавляет дочерний элемент к родительскому
    - Используется для построения структуры таблицы
    - Пример: tableBody.appendChild(row)

18. Math.random() - возвращает псевдослучайное число от 0 до 1
    - Используется для генерации случайного ключа
    - Пример: Math.random()

19. Math.floor(number) - округляет число вниз до ближайшего целого
    - Используется для получения целого случайного числа
    - Пример: Math.floor(Math.random() * 10)

20. new Map() - создает новый объект Map для хранения пар ключ-значение
    - Используется в других лабораторных работах
    - Пример: const substitutionMap = new Map()

21. Element.style - объект, содержащий стили элемента, позволяет динамически менять CSS-свойства
    - Используется для выделения ошибок ввода
    - Пример: inputElement.style.borderColor = '#e74c3c'

22. shuffleString(str) - функция из utils.js для перемешивания строки
    - Используется для генерации случайного ключа
    - Пример: const shuffled = shuffleString(ALPHABET_LAB2)
*/