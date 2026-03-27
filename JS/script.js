const input = document.getElementById('input');
const button = document.querySelector('.btn');
const task_list = document.querySelector('.tasks');
const msg = document.querySelector('.warning');

button.addEventListener('click', addTask);

input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

window.addEventListener('load', loadTasks);


function addTask() {
    let task_text = input.value;
    if (task_text == '' || task_text.trim() == '') {
        msg.style.display = 'block';
    }
    else {
        msg.style.display = 'none';
        let task = createTaskElement(task_text);
        task_list.appendChild(task);
        saveTasks();
        input.value = '';
    }
}

function createTaskElement(text, checked = false) {
    let task = document.createElement('li');

    let taskContent = document.createElement('div');
    taskContent.classList.add('task-content');

    let textSpan = document.createElement('p');
    textSpan.classList.add('task-text');
    textSpan.textContent = text;
    taskContent.appendChild(textSpan);

    let divBtns = document.createElement('div');
    divBtns.classList.add('Btns');

    let edit_btn = document.createElement('span');
    edit_btn.textContent = '✎';
    edit_btn.classList.add('edit');

    let delete_btn = document.createElement('span');
    delete_btn.textContent = 'X';
    delete_btn.classList.add('delete');

    divBtns.appendChild(edit_btn);
    divBtns.appendChild(delete_btn);

    let taskWrapper = document.createElement('div');
    taskWrapper.classList.add('task-wrapper');
    taskWrapper.appendChild(taskContent);
    taskWrapper.appendChild(divBtns);

    task.appendChild(taskWrapper);

    if (checked) {
        task.classList.add('checked');
    }
    return task;
}



task_list.addEventListener('click', taskAction);
function taskAction(event) {
    if (event.target.tagName == 'LI') {
        event.target.classList.toggle('checked');
        saveTasks();
    } else if (event.target.classList.contains('delete')) {
        event.target.closest('li').remove();
        saveTasks();
    }
    else if (event.target.classList.contains('edit')) {
        let li = event.target.closest('li');
        let textSpan = li.querySelector('.task-text');
        let taskContent = li.querySelector('.task-content');
        let currentText = textSpan.textContent;
        let wasChecked = li.classList.contains('checked');
        li.classList.remove('checked');

        let editInput = document.createElement('input');
        editInput.type = 'text';
        editInput.value = currentText;
        editInput.classList.add('edit-input');

        taskContent.replaceChild(editInput, textSpan);

        editInput.addEventListener('blur', () => {
            if (editInput.value.trim() !== '') {
                textSpan.textContent = editInput.value;
            }
            taskContent.replaceChild(textSpan, editInput);
            if (wasChecked) {
                li.classList.add('checked');
            }
            saveTasks();
        });

        editInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                editInput.blur();
            }
        });

        editInput.focus();

    }
}
function saveTasks() {
    let tasks = [];
    document.querySelectorAll('.tasks li').forEach(li => {
        tasks.push({
            text: li.querySelector('.task-text').textContent,
            checked: li.classList.contains('checked')
        });
    });
    localStorage.setItem('tasks', JSON.stringify(tasks));
}


function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    tasks.forEach(t => {
        let task = createTaskElement(t.text, t.checked);
        task_list.appendChild(task);
    });
}
