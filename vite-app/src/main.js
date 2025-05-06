class Task {
  constructor(taskName, taskDescription, taskPriority, taskDate, id) {
    this.taskName = taskName;
    this.taskDescription = taskDescription;
    this.taskPriority = taskPriority;
    this.taskDate = taskDate;
    this.id = id;
  }
}

const tasks = [];

const tasksManager = function () {
  let currentId = 0;

  const addTask = function (taskName, taskDescription, taskPriority, taskDate, taskProject) {
    const task = new Task(taskName, taskDescription, taskPriority, taskDate, currentId++);
    const project = tasks.find((proj) => proj.projectName === taskProject);
    if (project) {
      project.projectTasks.push(task);
      if (checkTaskDomAddability(taskProject)) {
        uiController.addTask(taskName, taskDescription, taskPriority, taskDate, task.id);
      }
      saveWebsite();
    }
  };

  const removeTask = function (id) {
    tasks.forEach((project) => {
      project.projectTasks = project.projectTasks.filter((task) => task.id !== id);
    });
    saveWebsite();
  };

  return { addTask, removeTask };
}();

class Project {
  constructor(projectName) {
    this.projectName = projectName;
    this.projectTasks = [];
  }
}

const checkTaskDomAddability = function (taskProject) {
  return projectManager.getCurrentProject() === taskProject;
};

const uiController = (function () {
  const tasksContainer = document.querySelector("#tasks-container");
  const projectTabs = document.querySelector("#project-tabs");

  const addTask = function (taskName, taskDescription, taskPriority, taskDate, currentId) {
    tasksContainer.innerHTML += `
      <div class="p-4 bg-slate-100 rounded-lg hover:bg-slate-200 transition" id="${currentId}">
        <h4 class="text-xl font-bold">${taskName}</h4>
        <p>${taskDescription}</p>
        <div class="pb-2 pt-2"><hr></div>
        <div class="flex items-center justify-between">
          <div>
            <p>Due date : ${taskDate}</p>
            <p>Priority : ${taskPriority}</p>
          </div>
          <div class="flex">
            <img
              src="public/icons/delete-task.png"
              alt=""
              class="w-8 h-8 cursor-pointer"
              onclick="removeTask(event)"
            />
          </div>
        </div>
      </div>
    `;
  };

  const addProject = function (projectName) {
    let pjDisplayer = document.createElement("div");
    pjDisplayer.classList.add("flex", "items-center", "gap-x-2", "cursor-pointer", "mt-2", "hover:bg-slate-300", "p-1", "rounded-lg");
    pjDisplayer.tabIndex = 0;
    projectTabs.appendChild(pjDisplayer);
    pjDisplayer.dataset.projectName = projectName;
    pjDisplayer.addEventListener("click", (event) => {
      let clickedElement = event.target;
      console.log(clickedElement);
    });

    let pjDisplayerImage = document.createElement("img");
    pjDisplayerImage.src = "public/icons/folder.png";
    pjDisplayerImage.classList.add("w-8", "w-8");
    pjDisplayer.appendChild(pjDisplayerImage);

    let pjDisplayerName = document.createElement("p");
    pjDisplayerName.textContent = projectName;
    pjDisplayerName.classList.add("text-xl");
    pjDisplayer.appendChild(pjDisplayerName);

    let pjDisplayerRemoveButton = document.createElement("img");
    pjDisplayerRemoveButton.src = "public/icons/delete-task.png";
    pjDisplayerRemoveButton.classList.add("w-8", "ml-auto");
    pjDisplayer.appendChild(pjDisplayerRemoveButton);
    pjDisplayerRemoveButton.addEventListener("click", () => {
      projectManager.removeProject(projectName);
    });

    if (tasks.length === 1) {
      projectManager.changeCurrentProjectDomElement(pjDisplayer);
    }
  };

  return { addTask, addProject };
})();

const inputReceiver = (function () {
  const addTaskButton = document.querySelector("#add-task-button");
  const addProjectButton = document.querySelector("#add-project-button");
  const addTaskDialog = document.querySelector("#add-task-dialog");
  const addProjectDialog = document.querySelector("#add-project-dialog");
  const addProjectDialogForm = document.querySelector("#add-project-dialog-form");
  const taskFormCancel = document.querySelector("#task-form-cancel");
  const projectFormCancel = document.querySelector("#project-form-cancel");
  const addTaskDialogForm = document.querySelector("#add-task-dialog-form");
  console.log(taskFormCancel);


  addTaskButton.addEventListener("click", () => addTaskDialog.showModal());
  addProjectButton.addEventListener("click", () => addProjectDialog.showModal());
  taskFormCancel.addEventListener("click", () => addTaskDialog.close());
  projectFormCancel.addEventListener("click", () => addProjectDialog.close());

  addProjectDialogForm.addEventListener("submit", (event) => {
    event.preventDefault();
    let projectName = document.querySelector("#project-name");
    projectManager.addProject(projectName.value);
    projectName.value = "";
    addProjectDialog.close();
  });

  addTaskDialogForm.addEventListener("submit", (event) => {
    event.preventDefault();
    let taskName = document.querySelector("#task-name").value;
    let taskDescription = document.querySelector("#task-desc").value;
    let taskDate = document.querySelector("#task-date").value;
    let taskPriority = document.querySelector("#task-priority").value;
    let taskProject = document.querySelector("#task-project").value;
    addTaskDialog.close();
    tasksManager.addTask(taskName, taskDescription, taskPriority, taskDate, taskProject);
  });
})();

const projectManager = (function () {
  let currentProject = "default";
  let currentProjectDomElement = null;

  const addProject = function (projectName) {
    let newProject = new Project(projectName);
    tasks.push(newProject);
    addProjectToDom(projectName);
    uiController.addProject(projectName);
    saveWebsite();
    console.log(tasks);
  };

  const removeProject = function (projectName) {
    let index = tasks.findIndex((project) => project.projectName === projectName);
    if (index !== -1) {
      tasks.splice(index, 1);
    }
  };

  const changeCurrentProject = function (projectName) {
    currentProject = projectName;
    changeProject(projectName);
    saveWebsite();
  };

  const getCurrentProject = function () {
    return currentProject;
  };

  const getCurrentProjectDomElement = function () {
    return currentProjectDomElement;
  };

  const getCurrentProjectDomByName = function (projectName) {
    return document.querySelector(`[data-project-name="${projectName}"]`);
  };

  const changeCurrentProjectDomElement = function (element) {
    if (tasks.length === 1) {
      currentProjectDomElement = element;
    }
    currentProjectDomElement?.classList.remove("bg-slate-300");
    currentProjectDomElement = element;
    currentProjectDomElement.classList.add("bg-slate-300");
    saveWebsite();
  };

  return {
    addProject,
    changeCurrentProject,
    getCurrentProject,
    getCurrentProjectDomElement,
    changeCurrentProjectDomElement,
    getCurrentProjectDomByName,
    removeProject
  };
})();

const changeProject = function (projectName) {
  const project = tasks.find((proj) => proj.projectName === projectName);
  const tasksContainer = document.querySelector("#tasks-container");
  tasksContainer.innerHTML = "";
  project.projectTasks.forEach((task) => {
    uiController.addTask(task.taskName, task.taskDescription, task.taskPriority, task.taskDate, task.id);
  });
};

const addProjectToDom = function (projectName) {
  const dropdownSelector = document.querySelector("#task-project");
  const newDropdownOption = document.createElement("option");
  newDropdownOption.value = projectName;
  newDropdownOption.textContent = projectName;
  dropdownSelector.appendChild(newDropdownOption);
};

function removeTask(event) {
  let clickedElement = event.target;
  let taskContainer = clickedElement.closest(".p-4");
  taskContainer.remove();
  tasksManager.removeTask(parseInt(taskContainer.id));
}



function saveWebsite() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
  localStorage.setItem("currentProject", projectManager.getCurrentProject());
}

function loadWebsite() {
  let loadedTasks = JSON.parse(localStorage.getItem("tasks"));
  let loadedCurrentProjectName = localStorage.getItem("currentProject");

  if (loadedTasks) {
    loadedTasks.forEach((project) => {
      projectManager.addProject(project.projectName);
    });
    projectManager.changeCurrentProject(loadedCurrentProjectName);
    projectManager.changeCurrentProjectDomElement(
      projectManager.getCurrentProjectDomByName(loadedCurrentProjectName)
    );

    loadedTasks.forEach((project) => {
      project.projectTasks.forEach((task) => {
        tasksManager.addTask(
          task.taskName,
          task.taskDescription,
          task.taskPriority,
          task.taskDate,
          project.projectName
        );
      });
    });
  }
}

if (localStorage.getItem("tasks") === null) {
  projectManager.addProject("default");
  projectManager.changeCurrentProject("default");

  tasksManager.addTask("Sample Task", "A sample task", "high", "2024/6/12", "default");
  tasksManager.removeTask(1);
} else {
  loadWebsite();
}
