// Лабораторная работа №1 - Шифрование методом подстановки

// Алфавит для шифрования (цифры от 0 до 5)
const ALPHABET_LAB1 = '012345';
const BLOCK_SIZE_LAB1 = 2;
const TOTAL_COMBINATIONS_LAB1 = Math.pow(ALPHABET_LAB1.length, BLOCK_SIZE_LAB1); // 36 комбинаций

// HTML-контент для первой лабораторной работы
function getLab1Content() {
    return `
        <div class="lab-section">
            <h2 class="lab-title">Лабораторная работа №1 - Шифрование методом подстановки</h2>
            <p><strong>Цель работы:</strong> Знакомство с классическим криптографическим алгоритмом - алгоритмом шифрования данных при помощи подстановки.</p>
            <p><strong>Индивидуальное задание:</strong> V = {0,1,2,3,4,5}, m = 2, |V| = 6, |V|^m = 36</p>
            
            <label for="message-lab1">Исходное сообщение:</label>
            <textarea id="message-lab1" placeholder="Введите текст для шифрования (только цифры 0-5)"></textarea>
            
            <label for="key-lab1">Ключ (шифрозамена):</label>
            <input type="text" id="key-lab1" class="key-input" placeholder="Введите ключ для шифрования (36 символов)" value="">
            
            <div class="key-input-container">
                <button id="generate-key-lab1" class="btn btn-success">Сгенерировать ключ</button>
                <button id="load-key-lab1" class="btn btn-secondary">Загрузить ключ из файла</button>
                <input type="file" id="key-file-input-lab1" accept=".txt" style="display: none;">
            </div>
            
            <!-- Контейнер для таблицы подстановки (скрыт по умолчанию) -->
            <div id="substitution-table-container" style="display: none; margin-top: 20px;">
                <h3>Таблица подстановки</h3>
                <p>Алфавит: V = {0,1,2,3,4,5}, Длина блока: m = 2</p>
                <div style="overflow-x: auto;">
                    <table class="substitution-table" style="width: 100%; border-collapse: collapse;">
                        <thead>
                            <tr>
                                <th style="background-color: #2c3e50; color: white; padding: 8px; text-align: center;">Блок</th>
                                <th style="background-color: #2c3e50; color: white; padding: 8px; text-align: center;">0</th>
                                <th style="background-color: #2c3e50; color: white; padding: 8px; text-align: center;">1</th>
                                <th style="background-color: #2c3e50; color: white; padding: 8px; text-align: center;">2</th>
                                <th style="background-color: #2c3e50; color: white; padding: 8px; text-align: center;">3</th>
                                <th style="background-color: #2c3e50; color: white; padding: 8px; text-align: center;">4</th>
                                <th style="background-color: #2c3e50; color: white; padding: 8px; text-align: center;">5</th>
                            </tr>
                        </thead>
                        <tbody id="substitution-table-body">
                            <!-- Таблица будет заполнена через JavaScript -->
                        </tbody>
                    </table>
                </div>
            </div>
            
            <label for="encrypted-message-lab1">Зашифрованное сообщение:</label>
            <textarea id="encrypted-message-lab1" placeholder="Результат шифрования"></textarea>
            
            <div class="button-group">
                <button id="encrypt-lab1" class="btn btn-primary">Зашифровать</button>
                <button id="decrypt-lab1" class="btn btn-secondary">Расшифровать</button>
            </div>
        </div>
    `;
}

// Инициализация функционала для первой лабораторной работы
function initLab1() {
    // Настройка обработчиков событий
    document.getElementById('encrypt-lab1').addEventListener('click', encryptLab1);
    document.getElementById('decrypt-lab1').addEventListener('click', decryptLab1);
    document.getElementById('generate-key-lab1').addEventListener('click', generateKeyLab1);
    document.getElementById('load-key-lab1').addEventListener('click', loadKeyLab1);
    
    // Привязка обработки файла для загрузки ключа
    loadKeyFromFile('key-file-input-lab1', 'key-lab1');
    
    // Инициализация пустой таблицы подстановки
    initEmptySubstitutionTable();
}

// Инициализация пустой таблицы подстановки
function initEmptySubstitutionTable() {
    const tableBody = document.getElementById('substitution-table-body');
    tableBody.innerHTML = '';
    
    // Создаем таблицу 6x6
    for (let i = 0; i < 6; i++) {
        const row = document.createElement('tr');
        
        // Первая ячейка - номер строки
        const rowHeader = document.createElement('td');
        rowHeader.textContent = i;
        rowHeader.style.backgroundColor = '#2c3e50';
        rowHeader.style.color = 'white';
        rowHeader.style.padding = '8px';
        rowHeader.style.textAlign = 'center';
        row.appendChild(rowHeader);
        
        // Остальные ячейки - пустые (будут заполнены при генерации ключа)
        for (let j = 0; j < 6; j++) {
            const cell = document.createElement('td');
            cell.textContent = '';
            cell.style.padding = '8px';
            cell.style.textAlign = 'center';
            cell.style.border = '1px solid #ddd';
            cell.style.backgroundColor = '#f9f9f9';
            cell.setAttribute('data-original', `${i}${j}`);
            cell.setAttribute('data-replacement', '');
            row.appendChild(cell);
        }
        
        tableBody.appendChild(row);
    }
}

// Генерация случайного ключа для подстановки и отображение таблицы
function generateKeyLab1() {
    // Показываем таблицу подстановки
    document.getElementById('substitution-table-container').style.display = 'block';
    
    const tableBody = document.getElementById('substitution-table-body');
    const allCombinations = [];
    
    // Собираем все возможные комбинации (00, 01, ..., 55)
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 6; j++) {
            allCombinations.push(`${i}${j}`);
        }
    }
    
    // Перемешиваем комбинации
    const shuffled = [...allCombinations];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    
    // Обновляем таблицу
    const cells = tableBody.querySelectorAll('td:not(:first-child)');
    cells.forEach((cell, index) => {
        const original = allCombinations[index];
        const replacement = shuffled[index];
        
        cell.textContent = replacement;
        cell.setAttribute('data-original', original);
        cell.setAttribute('data-replacement', replacement);
        
        // Выделяем ячейки с одинаковыми значениями
        if (original === replacement) {
            cell.style.backgroundColor = '#ffecb3'; // Желтый фон для отображения неизмененных ячеек
        } else {
            cell.style.backgroundColor = '#e8f5e9'; // Зеленоватый фон для измененных ячеек
        }
    });
    
    // Сохраняем текущую подстановку в поле ввода ключа
    document.getElementById('key-lab1').value = shuffled.join('');
}

// Загрузка ключа из файла
function loadKeyLab1() {
    document.getElementById('key-file-input-lab1').click();
}

// Шифрование методом подстановки
function encryptLab1() {
    // Валидация входных данных
    if (!validateInput('message-lab1', 
        value => validateAlphabetInput(value, ALPHABET_LAB1),
        'Сообщение должно содержать только цифры 0-5')) {
        return;
    }
    
    const key = document.getElementById('key-lab1').value;
    if (!validateInput('key-lab1',
        value => validateKeyLength(value, TOTAL_COMBINATIONS_LAB1 * BLOCK_SIZE_LAB1) && 
                validateAlphabetInput(value, ALPHABET_LAB1),
        `Ключ должен содержать ровно ${TOTAL_COMBINATIONS_LAB1 * BLOCK_SIZE_LAB1} цифр из алфавита 0-5`)) {
        return;
    }
    
    const message = document.getElementById('message-lab1').value;
    const encrypted = cipherSubstitution(message, key);
    
    // Отображаем результат
    document.getElementById('encrypted-message-lab1').value = encrypted;
    
    // Обновляем таблицу подстановки после шифрования
    updateSubstitutionTableAfterEncryption();
}

// Расшифровка методом подстановки
function decryptLab1() {
    // Валидация входных данных
    if (!validateInput('encrypted-message-lab1', 
        value => validateAlphabetInput(value, ALPHABET_LAB1),
        'Зашифрованное сообщение должно содержать только цифры 0-5')) {
        return;
    }
    
    const key = document.getElementById('key-lab1').value;
    if (!validateInput('key-lab1',
        value => validateKeyLength(value, TOTAL_COMBINATIONS_LAB1 * BLOCK_SIZE_LAB1) && 
                validateAlphabetInput(value, ALPHABET_LAB1),
        `Ключ должен содержать ровно ${TOTAL_COMBINATIONS_LAB1 * BLOCK_SIZE_LAB1} цифр из алфавита 0-5`)) {
        return;
    }
    
    const encrypted = document.getElementById('encrypted-message-lab1').value;
    const decrypted = decipherSubstitution(encrypted, key);
    
    // Отображаем результат
    document.getElementById('message-lab1').value = decrypted;
}

// Обновление таблицы подстановки после шифрования - подсветка используемых ячеек
function updateSubstitutionTableAfterEncryption() {
    const message = document.getElementById('message-lab1').value;
    const blocks = [];
    
    // Разбиваем сообщение на блоки размером BLOCK_SIZE_LAB1
    for (let i = 0; i < message.length; i += BLOCK_SIZE_LAB1) {
        const block = message.substring(i, i + BLOCK_SIZE_LAB1);
        if (block.length === BLOCK_SIZE_LAB1) {
            blocks.push(block);
        }
    }
    
    // Снимаем предыдущую подсветку
    const cells = document.querySelectorAll('#substitution-table-body td:not(:first-child)');
    cells.forEach(cell => {
        cell.style.fontWeight = 'normal';
        cell.style.color = 'inherit';
        cell.style.borderColor = '';
    });
    
    // Подсвечиваем ячейки, соответствующие блокам сообщения
    blocks.forEach(block => {
        const cell = document.querySelector(`td[data-original="${block}"]`);
        if (cell) {
            cell.style.fontWeight = 'bold';
            cell.style.color = '#e74c3c';
            cell.style.borderColor = '2px solid #e74c3c';
        }
    });
}

// Шифрование методом подстановки
function cipherSubstitution(text, key) {
    // Разбиваем текст на блоки по 2 символа
    const blocks = [];
    for (let i = 0; i < text.length; i += BLOCK_SIZE_LAB1) {
        let block = text.substring(i, i + BLOCK_SIZE_LAB1);
        // Если последний блок неполный, дополняем его первым символом алфавита
        while (block.length < BLOCK_SIZE_LAB1) {
            block += ALPHABET_LAB1[0];
        }
        blocks.push(block);
    }
    
    // Создаем таблицу подстановки
    const substitutionMap = new Map();
    for (let i = 0; i < TOTAL_COMBINATIONS_LAB1; i++) {
        const originalBlock = getCombinationByIndex(i);
        const substitutedBlock = key.substring(i * BLOCK_SIZE_LAB1, i * BLOCK_SIZE_LAB1 + BLOCK_SIZE_LAB1);
        substitutionMap.set(originalBlock, substitutedBlock);
    }
    
    // Шифруем каждый блок
    let encrypted = '';
    for (const block of blocks) {
        encrypted += substitutionMap.get(block) || block;
    }
    
    return encrypted;
}

// Расшифровка методом подстановки
function decipherSubstitution(text, key) {
    // Разбиваем текст на блоки по 2 символа
    const blocks = [];
    for (let i = 0; i < text.length; i += BLOCK_SIZE_LAB1) {
        const block = text.substring(i, i + BLOCK_SIZE_LAB1);
        blocks.push(block);
    }
    
    // Создаем обратную таблицу подстановки
    const reverseMap = new Map();
    for (let i = 0; i < TOTAL_COMBINATIONS_LAB1; i++) {
        const originalBlock = getCombinationByIndex(i);
        const substitutedBlock = key.substring(i * BLOCK_SIZE_LAB1, i * BLOCK_SIZE_LAB1 + BLOCK_SIZE_LAB1);
        reverseMap.set(substitutedBlock, originalBlock);
    }
    
    // Расшифровываем каждый блок
    let decrypted = '';
    for (const block of blocks) {
        decrypted += reverseMap.get(block) || block;
    }
    
    return decrypted;
}

// Получение комбинации по индексу
function getCombinationByIndex(index) {
    const firstChar = Math.floor(index / ALPHABET_LAB1.length);
    const secondChar = index % ALPHABET_LAB1.length;
    return ALPHABET_LAB1[firstChar] + ALPHABET_LAB1[secondChar];
}
function exportSubstitutionTable() {
    const table = [];
    const key = document.getElementById('key-lab1').value;
    
    if (!validateKeyLength(key, TOTAL_COMBINATIONS_LAB1 * BLOCK_SIZE_LAB1)) {
        alert('Сначала сгенерируйте ключ!');
        return;
    }
    
    for (let i = 0; i < TOTAL_COMBINATIONS_LAB1; i++) {
        const originalBlock = getCombinationByIndex(i);
        const substitutedBlock = key.substring(i * BLOCK_SIZE_LAB1, i * BLOCK_SIZE_LAB1 + BLOCK_SIZE_LAB1);
        table.push(`${originalBlock} -> ${substitutedBlock}`);
    }
    
    const blob = new Blob([table.join('\n')], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'substitution_table.txt';
    a.click();
    URL.revokeObjectURL(url);
}

/*
Документация по использованным функциям и операторам:

1. document.getElementById(id) - возвращает элемент с указанным ID
   - Используется для получения доступа к элементам интерфейса
   - Пример: document.getElementById('key-lab1') получает поле ввода ключа

2. Element.addEventListener(event, handler) - добавляет обработчик события к элементу
   - Используется для реагирования на клики по кнопкам
   - Пример: document.getElementById('encrypt-lab1').addEventListener('click', encryptLab1)

3. Element.style.display - управляет видимостью элемента
   - Используется для скрытия/показа таблицы подстановки
   - Пример: document.getElementById('substitution-table-container').style.display = 'block'

4. Element.querySelector(selector) - возвращает первый элемент, соответствующий селектору
   - Используется для поиска ячеек таблицы
   - Пример: document.querySelector('td[data-original="00"]')

5. Element.textContent - свойство для получения или установки текстового содержимого элемента
   - Используется для заполнения ячеек таблицы
   - Пример: cell.textContent = replacement

6. Element.setAttribute(name, value) - устанавливает атрибут элемента
   - Используется для сохранения оригинальных и замененных значений
   - Пример: cell.setAttribute('data-replacement', replacement)

7. Element.getAttribute(name) - возвращает значение атрибута элемента
   - Используется для получения сохраненных значений при шифровании
   - Пример: cell.getAttribute('data-replacement')

8. String.substring(start, end) - возвращает подстроку между указанными индексами
   - Используется для работы с блоками текста
   - Пример: text.substring(i, i + BLOCK_SIZE_LAB1)

9. Math.floor(number) - округляет число вниз до ближайшего целого
   - Используется для вычисления индексов в комбинациях
   - Пример: const firstChar = Math.floor(index / ALPHABET_LAB1.length)

10. new Map() - создает новый объект Map для хранения пар ключ-значение
    - Используется для создания таблицы подстановки
    - Пример: const substitutionMap = new Map()

11. Map.set(key, value) - устанавливает значение для указанного ключа в Map
    - Используется для заполнения таблицы подстановки
    - Пример: substitutionMap.set(originalBlock, substitutedBlock)

12. Map.get(key) - возвращает значение, связанное с указанным ключом в Map
    - Используется для шифрования и дешифрования
    - Пример: substitutionMap.get(block) || block

13. for (let i = 0; i < length; i++) {} - цикл for для итерации по диапазону значений
    - Используется для обработки блоков текста и заполнения таблицы
    - Пример: for (let i = 0; i < 6; i++) { ... }

14. while (condition) {} - цикл, выполняющийся пока условие истинно
    - Используется для дополнения текста до кратности размеру блока
    - Пример: while (block.length < BLOCK_SIZE_LAB1) { ... }

15. if (condition) {} else {} - условный оператор для выполнения кода в зависимости от условия
    - Используется для проверки ввода и выделения ячеек таблицы
    - Пример: if (original === replacement) { ... } else { ... }

16. const, let - объявление констант и переменных с блочной областью видимости
    - Используется для хранения временных значений
    - Пример: const tableBody = document.getElementById('substitution-table-body')

17. Array.forEach(callback) - выполняет указанную функцию для каждого элемента массива
    - Используется для обработки ячеек таблицы
    - Пример: cells.forEach((cell, index) => { ... })

18. document.createElement(tagName) - создает новый HTML-элемент указанного типа
    - Используется для динамического создания таблицы
    - Пример: const row = document.createElement('tr')

19. Element.appendChild(child) - добавляет дочерний элемент к родительскому
    - Используется для построения структуры таблицы
    - Пример: tableBody.appendChild(row)

20. Element.remove() - удаляет элемент из DOM
    - Используется при очистке таблицы перед перезаполнением
    - Пример: tableBody.innerHTML = ''

21. Math.random() - возвращает псевдослучайное число от 0 до 1
    - Используется для генерации случайного ключа
    - Пример: const j = Math.floor(Math.random() * (i + 1))

22. Element.classList.add(className) - добавляет указанный класс к элементу
    - Не используется в этом коде, но может быть полезен для анимации
    - Пример: rowHeader.classList.add('table-header')

23. Element.classList.remove(className) - удаляет указанный класс из элемента
    - Не используется в этом коде, но может быть полезен для анимации
    - Пример: rowHeader.classList.remove('table-header')

24. String.length - свойство, возвращающее длину строки
    - Используется для проверки длин строк
    - Пример: if (key.length !== TOTAL_COMBINATIONS_LAB1 * BLOCK_SIZE_LAB1) { ... }

25. Element.value - свойство для получения или установки значения элемента формы
    - Используется для работы с текстом в полях ввода
    - Пример: document.getElementById('message-lab1').value
*/