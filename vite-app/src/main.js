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
  constructor(projectName, projectTasks) {
    this.projectName = projectName;
    this.projectTasks = projectTasks;
  }
}
class tasksManager {
  constructor() {
    this.currentId = 0;
  }

  addTask(taskName, taskDescription, taskPriority, taskDate, taskProject) {
    let newTask = new task(
      taskName,
      taskDescription,
      taskPriority,
      taskDate,
      ++this.currentId
    );
    console.log(taskProject);
    const project = tasks.find((proj) => proj.projectName === taskProject)
    console.log(project)
    project.projectTasks.push(newTask)
  }
  removeTask(taskId) {
    tasks = tasks.filter((task) => task.id !== taskId);
  }
}

class uiController {
  constructor() {
    this.tasksContainer = document.querySelector("#tasks-container");
  }

  addTask() {
    this.tasksContainer.innerHTML += `
           <div
            class="p-4 bg-slate-100 rounded-lg hover:bg-slate-200 transition"
          >
            <h4 class="text-xl font-bold">Make a website</h4>
            <p>Make a website for one of my clients</p>
            <div class="pb-2 pt-2">
              <hr />
            </div>
            <div class="flex items-center justify-between">
              <div>
                <p class="">Due date : 2025-04-01</p>
                <p class="">Priority : High</p>
              </div>
              <div class="flex">
                <img
                  src="public/icons/check-tast-done.png"
                  alt=""
                  class="w-8 h-8 cursor-pointer"
                /><img
                  src="public/icons/delete-task.png"
                  alt=""
                  class="w-8 h-8 cursor-pointer"
                />
              </div>
            </div>
          </div>`;
  }
}
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
  addTaskDialogForm.addEventListener("click", (event) => {
    let taskName = document.querySelector("#task-name");
    let taskDescription = document.querySelector("#task-desc");
    let taskDate = document.querySelector("#task-date");
    let taskPriority = document.querySelector("#task-priority");
  });
})();

const projectManager = (function () {
  const addProject = function (projectName) {
    let newProject = new project(projectName);
    tasks.push(newProject);
    addProjectToDom(projectName);
    console.log(tasks);
  };
  return { addProject };
})();

const addProjectToDom = function (projectName) {
  const dropdownSelector = document.querySelector("#task-project");
  const newDropdownOption = document.createElement("option");
  newDropdownOption.value = projectName;
  newDropdownOption.textContent = projectName;
  console.log("drop down created");
  dropdownSelector.appendChild(newDropdownOption);
};

const projectTasksManager = new tasksManager();
projectManager.addProject("default");
projectTasksManager.addTask("test task", "1", "2", "3", "default");
projectTasksManager.addTask("test task", "1", "2", "3", "default");
projectTasksManager.addTask("test task", "1", "2", "3");
console.log(tasks);
projectTasksManager.removeTask(1);
console.log(tasks);

projectUiController = new uiController();
projectUiController.addTask();
