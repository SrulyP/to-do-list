import * as Projects from './projects.js';
import * as Tasks from './tasks.js';
import * as Storage from './storage.js';


const taskManager = {
    init: function() {
        this.cacheDom();
        this.bindEvents();
        this.render();
        Storage.loadTasksFromStorage();
    },
    cacheDom: function() {
        this.addTaskBtn = document.querySelector("#add-task-btn");
        this.taskDialog = document.querySelector('#add-task-dialog');
        this.taskForm = document.querySelector('.add-task-form');
        this.taskCancelBtn = document.querySelector('.task-cancel-btn');
        
        this.cardTaskTitle = document.querySelector('.card-task-title');
        this.cardTaskDate = document.querySelector('.card-task-due-date');
        this.cardTaskStatus = document.querySelector('.card-task-status');
        this.cardTaskCheckbox = document.querySelector('.task-complete');
        this.cardTaskPriority = document.querySelector('.card-task-priority');

        this.taskEdit = document.querySelector('.card-edit-task');
        this.taskDelete = document.querySelector('.card-delete-task');
    },
    bindEvents: function() {
        this.addTaskBtn.addEventListener("click", () => this.taskDialog.showModal());
        this.taskCancelBtn.addEventListener("click", () => this.taskDialog.close());
    },
    render: function() {

    },
}


const projectManager = {
    init: function() {
        this.cacheDom();
        this.bindEvents();
        this.render();
        Storage.loadProjectsFromStorage();
    },
    cacheDom: function() {
        this.addProjectBtn = document.querySelector("#add-project-btn");
        this.projectDialog = document.querySelector('#add-project-dialog');
        this.projectForm = document.querySelector('.add-project-form');
        this.projectCancelBtn = document.querySelector('.project-cancel-btn');

        this.sideProjectNames = document.querySelectorAll('.side-project-name');
        this.sideProjectEdit = document.querySelector('.side-project-edit');
        this.sideProjectDelete = document.querySelector('.side-project-delete');
        this.centerProjectName = document.querySelector('.center-project-name');
        this.centerProjectDescription = document.querySelector('.center-project-description');
    },
    bindEvents: function() {
        this.addProjectBtn.addEventListener("click", () => this.projectDialog.showModal());
        this.projectCancelBtn.addEventListener("click", () => this.projectDialog.close());
        
        this.sideProjectNames.forEach(span => {
            span.addEventListener('click', () => {
                this.centerProjectName.textContent = span.textContent;
                this.centerProjectDescription.textContent = span.dataset.description;
            });
        });
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

document.addEventListener('DOMContentLoaded', function() {
    taskManager.init();
    projectManager.init();
});