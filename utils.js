// Вспомогательные функции, используемые во всех лабораторных работах

// Проверка, является ли строка допустимой для шифрования (содержит только символы алфавита)
function validateAlphabetInput(input, alphabet) {
    for (let i = 0; i < input.length; i++) {
        if (!alphabet.includes(input[i])) {
            return false;
        }
    }
    return true;
}

// Генерация случайного целого числа в диапазоне
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Перемешивание строки
function shuffleString(str) {
    // Создаем массив символов из строки
    const chars = str.split('');
    
    // Применяем алгоритм Фишера-Йетса для перемешивания
    for (let i = chars.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [chars[i], chars[j]] = [chars[j], chars[i]];
    }
    
    // Возвращаем перемешанную строку
    return chars.join('');
}

// Проверка длины ключа
function validateKeyLength(key, requiredLength) {
    if (key.length !== requiredLength) {
        return false;
    }
    return true;
}

// Преобразование текста в массив байтов (для DES)
function textToBytes(text) {
    const bytes = [];
    for (let i = 0; i < text.length; i++) {
        bytes.push(text.charCodeAt(i));
    }
    return bytes;
}

// Генерация случайного 64-битного ключа для DES
function generateDesKey() {
    let key = '';
    for (let i = 0; i < 16; i++) {
        key += getRandomInt(0, 9).toString();
    }
    return key;
}

// Генерация случайного вектора инициализации для DES
function generateDesIV() {
    return generateDesKey(); // Используем ту же функцию для генерации IV
}

// Показать сообщение об ошибке для поля ввода
function showError(inputElement, message) {
    // Удаляем существующие сообщения об ошибках
    const existingError = inputElement.parentElement.querySelector('.validation-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Создаем и добавляем новое сообщение об ошибке
    const errorElement = document.createElement('div');
    errorElement.className = 'validation-error';
    errorElement.textContent = message;
    inputElement.parentElement.insertBefore(errorElement, inputElement.nextSibling);
    
    // Добавляем визуальные эффекты для поля с ошибкой
    inputElement.style.borderColor = '#e74c3c';
}

// Скрыть сообщение об ошибке для поля ввода
function hideError(inputElement) {
    // Удаляем сообщение об ошибке
    const existingError = inputElement.parentElement.querySelector('.validation-error');
    if (existingError) {
        existingError.remove();
    }
    
    // Восстанавливаем стандартный стиль поля
    inputElement.style.borderColor = '#ddd';
}

// Проверка ввода перед шифрованием/дешифрованием
function validateInput(inputId, validationFunction, errorMessage) {
    const inputElement = document.getElementById(inputId);
    const value = inputElement.value;
    
    if (!validationFunction(value)) {
        showError(inputElement, errorMessage);
        return false;
    } else {
        hideError(inputElement);
        return true;
    }
}

// Загрузка ключа из файла
function loadKeyFromFile(fileInputId, keyInputId) {
    const fileInput = document.getElementById(fileInputId);
    const keyInput = document.getElementById(keyInputId);
    
    fileInput.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                // Читаем первые 1024 символа из файла как ключ
                keyInput.value = event.target.result.substring(0, 1024);
            };
            reader.readAsText(file);
        }
    });
}
function validateDesKey(key) {
    if (key.length !== 16) return false;
    const hexChars = '0123456789ABCDEFabcdef';
    for (let i = 0; i < key.length; i++) {
        if (!hexChars.includes(key[i])) return false;
    }
    return true;
}

function validateHexInput(input) {
    if (input.length % 2 !== 0) return false;
    const hexChars = '0123456789ABCDEFabcdef';
    for (let i = 0; i < input.length; i++) {
        if (!hexChars.includes(input[i])) return false;
    }
    return true;
}
/*
Документация по использованным функциям и операторам:

1. String.includes(searchString) - проверяет, содержит ли строка указанную подстроку
2. Math.random() - возвращает псевдослучайное число от 0 до 1
3. Math.floor(number) - округляет число вниз до ближайшего целого
4. Array.split(separator) - разделяет строку на массив подстрок по указанному разделителю
5. Array.join(separator) - объединяет все элементы массива в строку с указанным разделителем
6. String.charCodeAt(index) - возвращает код символа Юникода в указанной позиции строки
7. document.createElement(tagName) - создает новый HTML-элемент указанного типа
8. Element.appendChild(child) - добавляет дочерний элемент к родительскому
9. Element.removeChild(child) - удаляет дочерний элемент из родительского
10. Element.insertBefore(newNode, referenceNode) - вставляет новый узел перед указанным существующим узлом
11. Element.nextSibling - возвращает следующий узел на том же уровне дерева DOM
12. Element.parentElement - возвращает родительский элемент текущего элемента
13. Element.querySelector(selector) - возвращает первый элемент, соответствующий указанному селектору
14. FileReader() - объект для чтения содержимого файлов
15. FileReader.readAsText(file) - читает содержимое файла как текст
16. FileReader.onload - обработчик события, срабатывающий когда файл успешно прочитан
17. Array.push(element) - добавляет элемент в конец массива
18. for (let i = 0; i < length; i++) {} - цикл for для итерации по диапазону значений
19. if (condition) {} else {} - условный оператор для выполнения кода в зависимости от условия
20. return value - оператор для возврата значения из функции
*/