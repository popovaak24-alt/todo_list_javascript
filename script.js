// Отримуємо посилання на елементи DOM
const taskInput = document.getElementById('task-input');
const taskAddBtn = document.getElementById('task-add-btn') || document.getElementById('add-btn');
const taskList = document.getElementById('task-list');

document.addEventListener('DOMContentLoaded', () => {
    // Навішуємо події на статичні завдання, якщо вони є в HTML.
    document.querySelectorAll('#task-list .task-list-item').forEach(attachTaskListEvents);
    loadTaskList();
});

// Функція для додавання нового завдання
function addTask() {
    const taskText = taskInput.value.trim();

    if (taskText === '') {
        alert('Будь ласка, введіть текст завдання!');
        return;
    }

    createTaskListElement(taskText, false);
    saveTaskList();

    taskInput.value = '';
    taskInput.focus();
}

// Функція як для додавання нових завдань, так і для
// відтворення збереженого списку завдань з LocalStorage
// із можливістю редагувати завдання у списку
function createTaskListElement(taskText, isCompleted) {
    // Створюємо елемент завдання (контейнер label)
    const label = document.createElement('label');
    label.className = 'task-list-item';

    // Наповнюємо його структурними елементами
    // із значеннями taskText та isCompleted
    label.innerHTML = `
        <input type="checkbox" ${isCompleted ? 'checked' : ''}>
        <span class="task-checkmark"></span>
        <span class="task-text" contenteditable="true" spellcheck="false">${taskText}</span>
        <button class="task-edit-btn" title="Редагувати завдання">✏️</button>
        <button class="task-done-btn" title="Змінити відмітку виконання завдання">✔</button>
        <button class="delete-btn task-delete-btn" title="Видалити завдання">✖</button>
    `;

    const taskEditBtn = label.querySelector('.task-edit-btn');

    // Зберігаємо зміни після редагування
    // при кліку поза текстом завдання (втраті фокусу)
    const textSpan = label.querySelector('.task-text');
    textSpan.addEventListener('blur', () => {
        // Перевіряємо, чи текст не порожній
        if (textSpan.innerText.trim() === '') {
            // Запобігаємо зникненню елемента
            textSpan.innerText = 'Введіть нове завдання';
        }

        // Відновлюємо стан кнопки редагування
        if (label.classList.contains('editing')) {
            label.classList.remove('editing');
            taskEditBtn.innerText = '✏️';
            taskEditBtn.title = 'Редагувати завдання';
        }

        saveTaskList(); // Зберігаємо список завдань після редагування
    });

    // Зберігаємо зміни при натисканні Enter
    textSpan.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Запобігаємо перенесенню рядка
            textSpan.blur();    // Викликаємо подію blur для збереження
        }
    });

    // Запобігаємо спрацюванню події для label
    // при кліку на тексті завданні
    textSpan.addEventListener('click', (e) => {
        e.preventDefault();
    });

    // Змінюємо відображення кнопки для редагування під час редагування
    textSpan.addEventListener('focus', (e) => {
        e.preventDefault();
        if (!label.classList.contains('editing')) {
            label.classList.add('editing');
            taskEditBtn.innerText = '💾';
            taskEditBtn.title = 'Завершіть редагування завдання натисненням клавіші "Enter"';
        }
    });

    // Додаємо подію для checkbox зміни стану виконання завдання
    const checkbox = label.querySelector('input');
    checkbox.addEventListener('change', () => {
        saveTaskList(); // Зберігаємо список завдань після кліку
    });

    // Подія для виконання завдання
    const taskDoneBtn = label.querySelector('.task-done-btn');
    taskDoneBtn.addEventListener('click', (e) => {
        e.preventDefault(); // Запобігаємо спрацюванню label
        checkbox.checked = !checkbox.checked;
        saveTaskList();
    });

    // Додаємо подію для кнопки видалення завдання
    const taskDeleteBtn = label.querySelector('.task-delete-btn, .delete-btn');
    taskDeleteBtn.addEventListener('click', (e) => {
        e.preventDefault(); // Запобігаємо спрацюванню label
        label.remove(); // Видаляємо завдання
        saveTaskList(); // Зберігаємо список завдань після видалення
    });

    // Подія для кнопки редагування та збереження завдання
    taskEditBtn.addEventListener('click', (e) => {
        e.preventDefault(); // Запобігаємо спрацюванню label
        if (label.classList.contains('editing')) {
            textSpan.blur();
        } else {
            textSpan.focus();
        }
    });

    taskList.appendChild(label);
}

// Функція для обробки подій на елементах списку
function attachTaskListEvents(label) {
    const taskEditBtn = label.querySelector('.task-edit-btn');

    // Зберігаємо зміни після редагування
    // при кліку поза текстом завдання (втраті фокусу)
    const textSpan = label.querySelector('.task-text');
    if (textSpan) {
        textSpan.addEventListener('blur', () => {
            // Перевіряємо, чи текст не порожній
            if (textSpan.innerText.trim() === '') {
                // Запобігаємо зникненню елемента
                textSpan.innerText = 'Введіть нове завдання';
            }

            // Відновлюємо стан кнопки редагування
            if (taskEditBtn && label.classList.contains('editing')) {
                label.classList.remove('editing');
                taskEditBtn.innerText = '✏️';
                taskEditBtn.title = 'Редагувати завдання';
            }

            saveTaskList(); // Зберігаємо список завдань після редагування
        });

        // Зберігаємо зміни при натисканні Enter
        textSpan.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault(); // Запобігаємо перенесенню рядка
                textSpan.blur();    // Викликаємо подію blur для збереження
            }
        });

        // Запобігаємо спрацюванню події для label
        // при кліку на тексті завданні
        textSpan.addEventListener('click', (e) => {
            e.preventDefault();
        });

        // Змінюємо відображення кнопки для редагування під час редагування
        textSpan.addEventListener('focus', (e) => {
            e.preventDefault();
            if (taskEditBtn && !label.classList.contains('editing')) {
                label.classList.add('editing');
                taskEditBtn.innerText = '💾';
                taskEditBtn.title = 'Завершіть редагування завдання натисненням клавіші "Enter"';
            }
        });
    }

    // Додаємо подію для чекбокса зміни стану виконання завдання
    const checkbox = label.querySelector('input');
    if (checkbox) {
        checkbox.addEventListener('change', () => {
            saveTaskList(); // Зберігаємо список завдань після кліку
        });
    }

    // Подія для виконання завдання
    const taskDoneBtn = label.querySelector('.task-done-btn');
    if (taskDoneBtn && checkbox) {
        taskDoneBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Запобігаємо спрацюванню label
            checkbox.checked = !checkbox.checked;
            saveTaskList();
        });
    }

    // Додаємо подію для кнопки видалення
    const taskDeleteBtn = label.querySelector('.task-delete-btn, .delete-btn');
    if (taskDeleteBtn) {
        taskDeleteBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Запобігаємо спрацюванню label
            label.remove(); // Видаляємо завдання
            saveTaskList(); // Зберігаємо список завдань після видалення
        });
    }

    // Подія для кнопки редагування та збереження завдання
    if (taskEditBtn && textSpan) {
        taskEditBtn.addEventListener('click', (e) => {
            e.preventDefault(); // Запобігаємо спрацюванню label
            if (label.classList.contains('editing')) {
                textSpan.blur();
            } else {
                textSpan.focus();
            }
        });
    }
}

// Функція для збереження всіх завдань у LocalStorage
function saveTaskList() {
    const myTaskList = [];

    taskList.querySelectorAll('.task-list-item').forEach((item) => {
        myTaskList.push({
            text: item.querySelector('.task-text').innerText.trim(),
            completed: item.querySelector('input').checked
        });
    });

    // Перетворюємо масив об'єктів у рядок JSON
    localStorage.setItem('myTaskList', JSON.stringify(myTaskList));
}

// Функція для завантаження списку завдань з LocalStorage
function loadTaskList() {
    const savedTaskList = localStorage.getItem('myTaskList');
    if (!savedTaskList) {
        return;
    }

    taskList.innerHTML = '';

    const myTaskList = JSON.parse(savedTaskList);
    myTaskList.forEach((task) => {
        createTaskListElement(task.text, task.completed);
    });
}

// Додаємо слухач кліку по кнопці "Додати"
taskAddBtn.addEventListener('click', addTask);

// Дозволяємо додавати завдання натисканням клавіші Enter
taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});


