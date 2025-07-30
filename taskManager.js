/* ========================>>>>>> Imports <<<<<<======================== */

import * as Projects from './projects.js';
import * as Tasks from './tasks.js';
import * as Storage from './storage.js';

/* ========================>>>>>> Task Manager <<<<<<======================== */

const taskManager = {
    init: function() {
        this.cacheDom();
        this.bindEvents();
        Storage.loadTasksFromStorage();
        this.render();
    },

    cacheDom: function() {
        this.addTaskBtn = document.querySelector("#add-task-btn");
        this.taskDialog = document.querySelector('#add-task-dialog');
        this.taskForm = document.querySelector('.add-task-form');
        this.taskCancelBtn = document.querySelector('.task-cancel-btn');

        this.tasksContainer = document.querySelector('.tasks-container');
    },
    bindEvents: function() {
        this.addTaskBtn.addEventListener("click", () => this.taskDialog.showModal());
        this.taskCancelBtn.addEventListener("click", () => this.taskDialog.close());
    },
    setCurrentProject(projectID) {
        this.currentProjectID = projectID;
        this.render();
    },
    render: function() {
        this.tasksContainer.innerHTML = '';
    
        if (!this.currentProjectID) return;

        for (const task of Projects.findProjectByID(this.currentProjectID).getTasks()) {
            const taskCard = document.createElement('div')
            taskCard.className = 'task-card';
            taskCard.dataset.id = task.getID();

            const topRow = document.createElement('div');
            topRow.className = 'top-row';

            const taskTitle = document.createElement('div');
            taskTitle.className = 'card-task-title';
            taskTitle.textContent = task.getTitle();

            const bottomRow = document.createElement('div');
            bottomRow.className = 'bottom-row';
  
            const statusLabel = document.createElement('label');
            statusLabel.className  = 'card-task-status';
            const checkbox = document.createElement('input');
            checkbox.type  = 'checkbox';
            checkbox.className = 'task-complete';
            checkbox.checked = task.isComplete();
            statusLabel.append(checkbox, document.createTextNode('Complete'));
        
            const priorityDiv = document.createElement('div');
            priorityDiv.className = 'card-task-priority';
            priorityDiv.textContent = task.getPriority();

            const dateDiv = document.createElement('div');
            dateDiv.className = 'card-task-due-date';
            dateDiv.textContent = task.getDueDate();

            const editAndRemove = document.createElement('div');
            editAndRemove.className = 'edit-and-remove';

            const editBtn = document.createElement('div');
            editBtn.className = 'card-edit-task';
            editBtn.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
            
            const deleteBtn = document.createElement('div');
            deleteBtn.className = 'card-delete-task';
            deleteBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';


            topRow.appendChild(taskTitle);
            editAndRemove.append(editBtn, deleteBtn);
            bottomRow.append(statusLabel, priorityDiv, dateDiv, editAndRemove);
            taskCard.append(topRow,bottomRow);

            this.tasksContainer.appendChild(taskCard);
        }
    },
}

/* ========================>>>>>> Project Manager <<<<<<======================== */

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
        this.projectsContainer.innerHTML = '';
        for (const proj of Projects.projects) {

            const projectCard = document.createElement('a')
            projectCard.className = 'custom-project'
            projectCard.dataset.id = proj.getID();

            const projectName = document.createElement('span');
            projectName.className = 'side-project-name';
            projectName.dataset.description = proj.getDescription() || '';
            projectName.textContent = proj.getTitle();

            const projectEdit = document.createElement('span');
            projectEdit.className = 'side-project-edit';
            projectEdit.dataset.id = proj.getID(); 
            projectEdit.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';

            const projectDelete = document.createElement('span');
            projectDelete.className = 'side-project-delete';
            projectDelete.innerHTML = '<i class="fa-solid fa-trash-can"></i>';

            projectCard.append(projectName, projectEdit, projectDelete);
            this.projectsContainer.appendChild(projectCard);
            this.bindProjectEvents(proj, projectCard);
        }
    },
    bindProjectEvents: function(proj, projectCard) {
        const projectID = proj.getID();
        const projEdit = projectCard.querySelector('.side-project-edit');
        const projDelete = projectCard.querySelector('.side-project-delete');

        projEdit.addEventListener('click', (e) => {
            e.stopPropagation();
            // figure out how to open the form with info in it to update it
        });

        projDelete.addEventListener('click', (e) => {
            e.stopPropagation();
            Projects.deleteProject(projectID);
            Storage.saveProjectsToStorage();
            this.render();
        });

        projectCard.addEventListener('click', () => {
            taskManager.setCurrentProject(projectID);
        });
    }
}

/* ========================>>>>>> Helper Functions <<<<<<======================== */


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


