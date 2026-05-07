const app = document.querySelector(".app");
const input = document.querySelector(".input-task");
const list = document.querySelector(".list");

const filtered = document.querySelector("#selectFilter");

let currentFilter = "all";

let data = JSON.parse(localStorage.getItem("Tasks")) || [];

function saveTasks() {
  localStorage.setItem("Tasks", JSON.stringify(data));
}

app.addEventListener("click", (event) => {
  const elementAction = event.target.closest("[data-action]");
  const isCheckbox = event.target.matches("input[type=checkbox]");

  if (isCheckbox) {
    const li = event.target.closest("[data-id]");
    const id = Number(li.dataset.id);
    toggleTask(id);

    return;
  }

  if (!elementAction) return;

  const btnAction = elementAction.dataset.action;

  function dataId() {
    const li = elementAction.closest("[data-id]");
    const id = Number(li.dataset.id);
    return id;
  }

  switch (btnAction) {
    case "add":
      handleTask();
      break;

    case "delete":
      deleteTask(dataId());
      break;

    case "edit":
      editTask(dataId());
      break;
  }
});

app.addEventListener("keydown", (event) => {
  const isEditInput = event.target.matches(".inputEdit");

  if (isEditInput && event.key === "Enter") {
    const li = event.target.closest("[data-id]");
    const id = Number(li.dataset.id);

    const newText = event.target.value.trim();

    data = data.map((task) => {
      if (task.id === id) {
        return {
          ...task,
          text: newText || task.text,
          isEditing: false,
        };
      }
      return task;
    });

    render();
    saveTasks();
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
    isEditing: false,
  };

  data.push(getData);
  render();
  saveTasks();
}

function deleteTask(id) {
  data = data.filter((task) => task.id !== id);
  render();
  saveTasks();
}

function editTask(id) {
  data = data.map((task) => {
    return task.id === id ? { ...task, isEditing: !task.isEditing } : task;
  });
  render();
}

function toggleTask(id) {
  data = data.map((task) => {
    return task.id === id ? { ...task, state: !task.state } : task;
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
    let content;
    if (task.isEditing) {
      content = `<input type="text" value = "${task.text}" class ="inputEdit"/>`;
    } else {
      content = `<span class = "${task.state ? "completed" : ""}">${task.text}</span>`;
    }

    li.dataset.id = task.id;
    li.innerHTML = `
    <input type= "checkbox" ${task.state ? "checked" : ""}/>
    ${content}
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
