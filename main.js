
const tasks = [];
let time = 0;
let timer = null;
let timerBreak = null;
let current = null;

const add = document.querySelector("#add");
const itTask = document.querySelector("#itTask");
const form = document.querySelector("#form");
const taskName = document.querySelector("#time #taskName");

renderTime();

form.addEventListener('submit', e => {
    e.preventDefault();
    if (itTask.value != "") {
        createTask(itTask.value);
        itTask.value = "";
        renderTask();
    }
});

const createTask = (value) => {
    const newTask = {
        id: (Math.random() * 100).toString(36).slice(3),
        title: value,
        completed: false,
    };

    tasks.unshift(newTask);
}

const renderTask = () => {
    const html = tasks.map(task => {
        return `
            <div class="task">
                <div class="completed">${task.completed ? `<span class="done">Hecho</span>` : `<button class="start-button" data-id="${task.id}">Iniciar</button>`}</div>
                <div class="title">${task.title}</div>
            </div>
        `;
    });

    const tasksContainer = document.querySelector("#tasks");
    tasksContainer.innerHTML = html.join("");

    const startButtons = document.querySelectorAll(".task .start-button");

    startButtons.forEach(button => {
        button.addEventListener("click", e => {
            if (!timer) {
                const id = button.getAttribute("data-id");
                startButtonHandler(id);
                button.textContent = "En progreso..."
            }
        })
    });
}

const startButtonHandler = (id) => {
    const minutesInput = document.querySelector("#minutesInput");
    const enteredMinutes = parseInt(minutesInput.value || 0);

    if (enteredMinutes <= 0) {
        return; // No iniciar el temporizador si no se ingresaron minutos válidos
    }

    time = enteredMinutes * 60; // Convertir minutos a segundos
    current = id;
    const taskIndex = tasks.findIndex(task => task.id === id);
    taskName.textContent = tasks[taskIndex].title;
    renderTime();
    timer = setInterval(() => {
        timerHandler(id);
    }, 1000);
}

const timerHandler = (id) => {
    time--;
    renderTime();
    if (time === 0) {
        clearInterval(timer);
        marcarCompletada(id);
        timer = null;
        renderTask();
        iniciarDescanso();
        reproducirSonidoTimer();
    }
}

const iniciarDescanso = () => {
    time = 10;
    taskName.textContent = "Descanso";
    renderTime();
    timerBreak = setInterval(() => {
        timerBreakHandler();
    }, 1000);
}

const timerBreakHandler = () => {
    time--;
    renderTime();
    if (time === 0) {
        clearInterval(timerBreak);
        current = null;
        timerBreak = null;
        taskName.textContent = "";
        renderTask();
    }
}

function renderTime() {
    const timeDiv = document.querySelector("#time #value");
    const minutes = parseInt(time / 60);
    const seconds = parseInt(time % 60);

    timeDiv.textContent = `${minutes < 10 ? "0" : ""}${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

const marcarCompletada = (id) => {
    const taskIndex = tasks.findIndex(task => task.id === id);
    tasks[taskIndex].completed = true;
}

function reproducirSonidoTimer() {
    const timerSound = document.querySelector("#timerSound");
    timerSound.play();
}