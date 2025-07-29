import * as Projects from './projects.js';
import * as Tasks from './tasks.js';
import * as Storage from './storage.js';

const taskManager = {
    init: function() {

        this.cacheDom();
        this.bindEvents();
        this.render();
        Storage.loadTasksFromStorage();
        Storage.loadProjectsFromStorage();
    },

    cacheDom: function() {
        this.addProjectBtn = document.querySelector("#add-project-btn");
        this.projectDialog = document.querySelector('#add-project-dialog');
        this.projectForm = document.querySelector('.add-project-form');
        this.addTaskBtn = document.querySelector("#add-task-btn");
        this.taskDialog = document.querySelector('#add-task-dialog');
        this.taskForm = document.querySelector('.add-task-form');
        this.projectCancelBtn = document.querySelector('.project-cancel-btn');
        this.taskCancelBtn = document.querySelector('.task-cancel-btn');


    },
    bindEvents: function() {
        this.addProjectBtn.addEventListener("click", () => this.projectDialog.showModal());
        this.projectCancelBtn.addEventListener("click", () => this.projectDialog.close());
        this.addTaskBtn.addEventListener("click", () => this.taskDialog.showModal());
        this.taskCancelBtn.addEventListener("click", () => this.taskDialog.close());
    },
    render: function() {

    },
}

function removeTaskFromProject(projectID, taskID) {
    const project = Projects.findProjectByID(projectID);
    const task = Tasks.findTaskByID(taskID);
    if (project && task) {
        const tasksArray = project.getTasks();
        const index = tasksArray.indexOf(task);
        tasksArray.splice(index, 1);
    }
}


function addTaskToProject(projectID, taskID) {
    const project = Projects.findProjectByID(projectID);
    const task = Tasks.findTaskByID(taskID)
    if (project && task) {
        project.pushTask(task);
    }
}

taskManager.init();