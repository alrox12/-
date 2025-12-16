// Основной файл приложения - инициализация и управление лабораторными работами

// Текущая выбранная лабораторная работа
let currentLab = null;

// Инициализация приложения при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    // Настройка обработчиков для кнопок навигации
    setupNavigation();
    
    // По умолчанию показываем первую лабораторную работу
    showLabContent('lab1');
});

// Настройка навигации между лабораторными работами
function setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const targetLab = this.getAttribute('data-target');
            showLabContent(targetLab);
            
            // Обновляем активную кнопку навигации
            navButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
}

// Отображение содержимого выбранной лабораторной работы
function showLabContent(labId) {
    // Обновляем текущую лабораторную работу
    currentLab = labId;
    
    // Получаем контент для выбранной лабораторной работы
    const contentDiv = document.getElementById('lab-content');
    
    switch(labId) {
        case 'lab1':
            contentDiv.innerHTML = getLab1Content();
            initLab1();
            break;
        case 'lab2':
            contentDiv.innerHTML = getLab2Content();
            initLab2();
            break;
        case 'lab3':
            contentDiv.innerHTML = getLab3Content();
            initLab3();
            break;
        case 'lab4':
            contentDiv.innerHTML = getLab4Content();
            initLab4();
            break;
        default:
            contentDiv.innerHTML = '<p>Лабораторная работа не найдена</p>';
    }
}

/*
Документация по использованным функциям и операторам:

1. document.addEventListener('DOMContentLoaded', function) - добавляет обработчик события, который срабатывает когда DOM полностью загружен
2. document.querySelectorAll(selector) - возвращает NodeList всех элементов, соответствующих указанному селектору
3. NodeList.forEach(callback) - выполняет указанную функцию для каждого элемента в NodeList
4. Element.addEventListener(event, handler) - добавляет обработчик события к элементу
5. Element.getAttribute(name) - возвращает значение указанного атрибута элемента
6. Element.classList.add(className) - добавляет указанный класс к элементу
7. Element.classList.remove(className) - удаляет указанный класс из элемента
8. Element.innerHTML - свойство для получения или установки HTML-содержимого элемента
9. switch(expression) { case value: ... } - оператор множественного выбора, выполняет разные блоки кода в зависимости от значения выражения
10. Element.value - свойство для получения или установки значения элемента формы
11. function() {} - объявление функции
12. const, let - объявление констант и переменных с блочной областью видимости
13. this - ключевое слово, ссылающееся на текущий объект контекста выполнения
*/