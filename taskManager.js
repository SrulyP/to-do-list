import * as Projects from './projects.js';
import * as Tasks from './tasks.js';
import * as Storage from './storage.js';
import { createElement } from 'react';


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

        this.tasksContainer = document.querySelector('.bottom');
    },
    bindEvents: function() {
        this.addTaskBtn.addEventListener("click", () => this.taskDialog.showModal());
        this.taskCancelBtn.addEventListener("click", () => this.taskDialog.close());
    },
    render: function() {
        // this.tasksContainer.innerHTML = '';
    },
}

const projectManager = {
    init: function() {
        this.cacheDom();
        this.bindEvents();
        Storage.loadProjectsFromStorage();
        this.render();
    },
    cacheDom: function() {
        this.addProjectBtn = document.querySelector("#add-project-btn");
        this.projectDialog = document.querySelector('#add-project-dialog');
        this.projectForm = document.querySelector('.add-project-form');
        this.projectCancelBtn = document.querySelector('.project-cancel-btn');

        this.sideProjectNames = document.querySelectorAll('.side-project-name');
        this.sideProjectEdits = document.querySelectorAll('.side-project-edit');
        this.sideProjectDeletes = document.querySelectorAll('.side-project-delete');
        this.centerProjectName = document.querySelector('.center-project-name');
        this.centerProjectDescription = document.querySelector('.center-project-description');
        
        this.projectsContainer = document.querySelector('.other-projects');
    },
    bindEvents: function() {
        this.addProjectBtn.addEventListener("click", () => {
            this.projectForm.reset();
            this.projectDialog.showModal()}
        );
        this.projectCancelBtn.addEventListener("click", () => this.projectDialog.close());
        
        this.sideProjectNames.forEach(span => {
            span.addEventListener('click', () => {
                this.centerProjectName.textContent = span.textContent;
                this.centerProjectDescription.textContent = span.dataset.description;
            });
        });
    },
    render: function() {
        // this.projectsContainer.innerHTML = '';
        for (const proj of Projects.projects) {

            const projectCard = document.createElement('a')
            projectCard.className('custom-project')
            projectCard.dataset.id = proj.getID();

            const projectName = document.createElement('span');
            projectName.className = 'side-project-name';
            projectName.dataset.description = proj.getDescription() || '';
            projectName.textContent = proj.getTitle();

            const projectEdit = document.createElement('span');
            projectEdit.className = 'side-project-edit';
            projectEdit.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';

            const projectDelete = document.createElement('span');
            projectEdit.className = 'side-project-delete';
            projectEdit.innerHTML = '<i class="fa-solid fa-trash-can"></i>';

            projectCard.appendChild(projectName, projectEdit, projectDelete);
            this.projectsContainer.appendChild(projectCard);
            this.bindProjectEvents(proj, projectCard);
        }
    },
    bindProjectEvents: function(proj, projectCard) {
        const projectID = proj.getID();
        const projEdit = projectCard.querySelector('.side-project-edit');
        const projDelete = projectCard.querySelector('.side-project-delete');

        projEdit.addEventListener('click', () => {
            // figure out how to open the form with info in it to update it
        });
        
        projDelete.addEventListener('click', () => {
            Projects.deleteProject(projectID);
            Storage.saveProjectsToStorage();
            this.render();
        });
    }
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


