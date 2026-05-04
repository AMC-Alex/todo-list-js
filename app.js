const app = document.querySelector(".app");
const input = document.querySelector(".input-task");
const list = document.querySelector(".list");

const filtered = document.querySelector("#selectFilter");

let data = [];
let currentFilter = "all";

app.addEventListener("click", (event) => {
  const elementAction = event.target.closest("[data-action]");
  const isCheckbox = event.target.matches("input[type=checkbox]");

  if (isCheckbox) {
    const li = event.target.closest("[data-id]");
    const id = li.dataset.id;
    toggleTask(id);

    return;
  }

  if (!elementAction) return;

  const btnAction = elementAction.dataset.action;

  switch (btnAction) {
    case "add":
      handleTask();
      break;

    case "delete":
      const li = elementAction.closest("[data-id]");
      const id = li.dataset.id;
      deleteTask(id);
      break;

    case "edit":
      const li = elementAction.closest("[data-id]");
      const id = li.dataset.id;
      break;
  }
});

function handleTask() {
  let getInput = input.value.trim();
  addTask(getInput);
  input.value = "";
}

function addTask(text) {
  if (!text.trim()) return;

  const getData = {
    id: Date.now(),
    text: text,
    state: false,
  };

  data.push(getData);
  render();
}

function deleteTask(id) {
  data = data.filter((task) => task.id !== Number(id));
  render();
}

function editTask(id) {
  
  render();
}

function toggleTask(id) {
  data = data.map((task) => {
    return task.id === Number(id) ? { ...task, state: !task.state } : task;
  });
  render();
}

function render() {
  list.innerHTML = "";

  let tasks = data;

  if (currentFilter === "pending") {
    tasks = tasks.filter((task) => !task.state);
  }

  if (currentFilter === "completed") {
    tasks = tasks.filter((task) => task.state);
  }

  tasks.forEach((task) => {
    const li = document.createElement("li");
    li.dataset.id = task.id;
    li.innerHTML = `
    <input type= "checkbox" ${task.state ? "checked" : ""}/>
    <span class = "${task.state ? "completed" : ""}">${task.text}</span>
    <div class="button-content">
        <button data-action ="edit" class="btn-edit" >Edit</button>
        <button data-action ="delete" class="btn-delete" >Delete</button>
    </div>
    
    `;

    list.appendChild(li);
  });
}

filtered.addEventListener("change", (event) => {
  currentFilter = event.target.value;
  render();
});

render();
console.log(data);
