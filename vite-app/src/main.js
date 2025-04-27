let tasks = [];

class task {
  constructor(taskName, taskDescription, taskPriority, taskDate, id) {
    this.taskName = taskName;
    this.taskDescription = taskDescription;
    this.taskPriority = taskPriority;
    this.taskDate = taskDate;
    this.id = id;
  }
}
class project {
  constructor(projectName) {
    this.projectName = projectName;
    this.projectTasks = [];
  }
}

const tasksManager = (function () {
  let currentId = 0;

  const addTask = function (
    taskName,
    taskDescription,
    taskPriority,
    taskDate,
    taskProject
  ) {
    let newTask = new task(
      taskName,
      taskDescription,
      taskPriority,
      taskDate,
      ++currentId
    );
    console.log(taskProject);
    const project = tasks.find((proj) => proj.projectName === taskProject);
    console.log(project);
    project.projectTasks.push(newTask);
    uiController.addTask(
      taskName,
      taskDescription,
      taskPriority,
      taskDate,
      taskProject,
      currentId
    );
  };
  const removeTask = function (taskId) {
    tasks = tasks.filter((task) => task.id !== taskId);
  };
  return { addTask, removeTask };
})();

const uiController = (function () {

  const tasksContainer = document.querySelector("#tasks-container");
  const projectTabs = document.querySelector("#project-tabs")

  const addTask = function (
    taskName,
    taskDescription,
    taskPriority,
    taskDate,
    taskProject,
    currentId
  ) {
    tasksContainer.innerHTML += `
          <div
            class="p-4 bg-slate-100 rounded-lg hover:bg-slate-200 transition" id : ${currentId}
          >
            <h4 class="text-xl font-bold">${taskName}</h4>
            <p>${taskDescription}</p>
            <div class="pb-2 pt-2">
              <hr>
            </div>
            <div class="flex items-center justify-between">
              <div>
                <p class="">Due date : ${taskDate}</p>
                <p class="">Priority : ${taskPriority}</p>
              </div>
              <div class="flex">
                <img
                  src="public/icons/delete-task.png"
                  alt=""
                  class="w-8 h-8 cursor-pointer"
                  onclick = "removeTask(event)"
                />
              </div>
            </div>
          </div>
    `;
  };

  const addProject = function(projectName){

    projectTabs.innerHTML += `
    <div
          class="flex items-center gap-x-2 cursor-pointer mt-2 hover:bg-slate-300 p-1 rounded-lg" onclick = "removeProject(event)"
    >
    <img src="public/icons/folder.png" alt="" class="w-8 h-8" />
    <p class="text-xl">${projectName}</p>
    </div>
    `

  }
  return { addTask , addProject};
})();

const inputReciever = (function () {
  const addTaskButton = document.querySelector("#add-task-button");
  const addProjectButton = document.querySelector("#add-project-button");
  const addTaskDialog = document.querySelector("#add-task-dialog");
  const addProjectDialog = document.querySelector("#add-project-dialog");
  const addProjecDialogForm = document.querySelector(
    "#add-project-dialog-form"
  );

  const addTaskDialogForm = document.querySelector("#add-task-dialog-form");
  addTaskButton.addEventListener("click", (event) => {
    addTaskDialog.showModal();
  });

  addProjectButton.addEventListener("click", (event) => {
    addProjectDialog.showModal();
  });

  addProjecDialogForm.addEventListener("submit", (event) => {
    let projectName = document.querySelector("#project-name");
    projectManager.addProject(projectName.value);
    event.preventDefault();
    projectName.value = "";
    addProjectDialog.close();
  });

  addTaskDialogForm.addEventListener("submit", (event) => {
    let taskName = document.querySelector("#task-name").value;
    let taskDescription = document.querySelector("#task-desc").value;
    let taskDate = document.querySelector("#task-date").value;
    let taskPriority = document.querySelector("#task-priority").value;
    let taskProject = document.querySelector("#task-project").value;

    tasksManager.addTask(
      taskName,
      taskDescription,
      taskDate,
      taskPriority,
      taskProject
    );
  });
})();

const projectManager = (function () {
  const addProject = function (projectName) {
    let newProject = new project(projectName);
    tasks.push(newProject);
    addProjectToDom(projectName);
    console.log(tasks);
    uiController.addProject(projectName)
  };
  return { addProject };
})();

const addProjectToDom = function (projectName) {
  const dropdownSelector = document.querySelector("#task-project");
  const newDropdownOption = document.createElement("option");
  newDropdownOption.value = projectName;
  newDropdownOption.textContent = projectName;
  dropdownSelector.appendChild(newDropdownOption);
};

// Task removal 

function removeTask(event){
  let clickedElement = event.target
  let taskContainer = clickedElement.parentElement.parentElement.parentElement
  taskContainer.remove()
}

function removeProject(event){
  let clickedElement = event.target

}
// Rest of the code
projectManager.addProject("default");
tasksManager.addTask("Sample Task", "A sample task for testing purposes", "2024/6/12", "high", "default");
console.log(tasks);
tasksManager.removeTask(1);
console.log(tasks);

// let taskContainer = document.createElement("div");
// console.log("task being added to dom");
// taskContainer.classList.add(
//   "p-4",
//   "bg-slate-100",
//   "rounded-lg",
//   "hover:bg-slate-200",
//   "transition"
// );
// tasksContainer.appendChild(taskContainer);

// let taskTitleElement = document.createElement("h4");
// taskTitleElement.textContent = taskName;
// taskContainer.appendChild(taskTitleElement);

// let taskDescriptionElement = document.createElement("p");
// taskDescriptionElement.textContent = taskDescription;
// taskContainer.appendChild(taskDescriptionElement);

// taskContainer.innerHTML += `
//     <div class="pb-2 pt-2">
//     <hr>
//     </div>
// `;

// taskInnerContainer = document.createElement("div")
// taskContainer.appendChild(taskInnerContainer)
