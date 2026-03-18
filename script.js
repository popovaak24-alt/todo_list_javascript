// Отримуємо посилання на елементи DOM
const input = document.getElementById('task-input');
const addBtn = document.getElementById('add-btn');
const taskList = document.getElementById('task-list');
 
// Функція для створення нового завдання
function addTask() {
    const taskText = input.value.trim();
 
    if (taskText === "") {
        alert("Будь ласка, введіть текст завдання!");
        return;
    }
 
    // Створюємо елемент завдання (наш контейнер label)
    const label = document.createElement('label');
    label.className = 'task-list-item';
 
    // Наповнюємо його структурними елементами
    label.innerHTML = `
        <input type="checkbox">
        <span class="checkmark"></span>
        <span class="text">${taskText}</span>
    `;
 
    // Додаємо нове завдання в список
    taskList.appendChild(label);
 
    // Очищаємо поле вводу
    input.value = "";
    input.focus();
}
 
// Додаємо слухач кліку по кнопці "Додати"
addBtn.addEventListener('click', addTask);
 
// Дозволяємо додавати завдання натисканням клавіші Enter
input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTask();
    }
});


