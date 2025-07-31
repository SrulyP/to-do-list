/* ========================>>>>>> Imports <<<<<<======================== */

import * as Projects from './projects.js';
import * as Tasks from './tasks.js';
import * as Storage from './storage.js';


/* ========================>>>>>> Project Manager <<<<<<======================== */

const projectManager = {
    init: function() {
        this.cacheDom();
        this.bindEvents();
        Storage.loadProjectsFromStorage();
        this.render();
        this.setupDefaultProject();
        if (this.defaultProject) {
            this.defaultProject.click();
        }
    },

    cacheDom: function() {
        this.addProjectBtn = document.querySelector("#add-project-btn");
        this.projectDialog = document.querySelector('#add-project-dialog');
        this.projectForm = document.querySelector('.add-project-form');
        this.projectCancelBtn = document.querySelector('.project-cancel-btn');
        this.projectsContainer = document.querySelector('.other-projects');
        
        this.centerProjectName = document.querySelector('.center-project-name');
        this.centerProjectDescription = document.querySelector('.center-project-description');
        this.defaultProject = document.querySelector('.default');

        this.taskProjectDropdown = document.querySelector('#task-project');
    },

    bindEvents: function() {
        this.addProjectBtn.addEventListener("click", () => {
            this.projectForm.reset();
            this.projectDialog.showModal();
        });
        this.projectCancelBtn.addEventListener("click", () => this.projectDialog.close());
        this.projectForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleProjectForm();
            this.render();
        });
    },

    handleProjectForm: function() {
        const projectFormData = new FormData(this.projectForm);

        const projectTitle = projectFormData.get('project-title');
        const projectDesc = projectFormData.get('project-description');
        
        // Create a new project using the information from the form, then save it
        const newProject = Projects.createProjectFactory(projectTitle, projectDesc);

        Projects.projects.push(newProject);
        Storage.saveProjectsToStorage();
        
        this.projectForm.reset();
        this.projectDialog.close();
    },
    
    setupDefaultProject: function() {
        if (this.defaultProject) {
            this.defaultProject.addEventListener('click', () => {
                this.centerProjectName.textContent = 'Default';
                this.centerProjectDescription.textContent = 'Default tasks';
                taskManager.setCurrentProject('default');
            });
        }
    },

    render: function() {
        this.projectsContainer.innerHTML = '';
        this.taskProjectDropdown.innerHTML = '<option value="default">Default</option>';

        // Populate the side bar with the projects
        for (const proj of Projects.getProjects()) {
            const projectCard = document.createElement('a');
            projectCard.className = 'custom-project';
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

            // Add the project to the dropdown menu when creating tasks
            const projectOption = document.createElement('option');
            projectOption.value = proj.getID();
            projectOption.textContent = proj.getTitle();
            this.taskProjectDropdown.appendChild(projectOption);
        }
    },

    bindProjectEvents: function(proj, projectCard) {
        const projectID = proj.getID();
        const projEdit = projectCard.querySelector('.side-project-edit');
        const projDelete = projectCard.querySelector('.side-project-delete');

        projEdit.addEventListener('click', (e) => {
            e.stopPropagation();
            // figure out how to open the form with info in it to update it
            this.render();
        });

        projDelete.addEventListener('click', (e) => {
            e.stopPropagation();
            Projects.deleteProject(projectID);
            Storage.saveProjectsToStorage();
            this.render();
        });

        projectCard.addEventListener('click', () => {
            this.centerProjectName.textContent = proj.getTitle();
            this.centerProjectDescription.textContent = proj.getDescription() || '';
            taskManager.setCurrentProject(projectID);
        });
    }
}


/* ========================>>>>>> Task Manager <<<<<<======================== */

const taskManager = {
    init: function() {
        this.cacheDom();
        this.bindEvents();
        Storage.loadTasksFromStorage();
        this.setCurrentProject('default');
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
        this.addTaskBtn.addEventListener("click", () => {
            // Set the dropdown to current project when opening dialog
            if (this.currentProjectID) {
                const dropdown = document.querySelector('#task-project');
                dropdown.value = this.currentProjectID;
            }
            this.taskDialog.showModal();
        });
        this.taskCancelBtn.addEventListener("click", () => this.taskDialog.close());
        this.taskForm.addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleTaskForm();
            this.render();
        })
    },

    handleTaskForm: function() {
        const taskFormData = new FormData(this.taskForm);

        const taskTitle = taskFormData.get('task-title');
        const taskDesc = taskFormData.get('task-description');
        const taskDate = taskFormData.get('due-date');
        const taskPriority = taskFormData.get('priority');
        const taskProject = taskFormData.get('task-project');

        // Create a new task using the information from the form
        const newTask = Tasks.createTask(taskTitle, taskDesc, taskDate, taskPriority, taskProject);

        Tasks.tasks.push(newTask);
        Storage.saveTasksToStorage();
        Storage.saveProjectsToStorage();

        this.taskForm.reset();
        this.taskDialog.close();
    },

    setCurrentProject(projectID) {
        this.currentProjectID = projectID;
        this.render();
    },

    getPriorityText(priority) {
        switch(priority) {
            case '1': return 'Low';
            case '2': return 'Medium';
            case '3': return 'Urgent';
            default: return 'Low';
        }
    },

    render: function() {
        this.tasksContainer.innerHTML = '';
    
        if (!this.currentProjectID) return;

        let tasksToShow = [];

        if (this.currentProjectID === 'default') {
            // For default project, show all tasks assigned to 'default'
            tasksToShow = Tasks.getTasks().filter(task => task.getProject() === 'default');
        } else {
            // For other projects, show tasks assigned to that project
            tasksToShow = Tasks.getTasks().filter(task => task.getProject() === this.currentProjectID);
        }

        // Build the task cards for all the tasks in the chosen project
        for (const task of tasksToShow) {
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
            checkbox.checked = task.getCompletedStatus();
            statusLabel.append(checkbox, document.createTextNode('Complete'));
        
            const priorityDiv = document.createElement('div');
            priorityDiv.className = 'card-task-priority';
            priorityDiv.textContent = this.getPriorityText(task.getPriority());

            const dateDiv = document.createElement('div');
            dateDiv.className = 'card-task-due-date';
            dateDiv.textContent = task.getDueDate() || 'No date';

            const editAndRemove = document.createElement('div');
            editAndRemove.className = 'edit-and-remove';

            const editBtn = document.createElement('div');
            editBtn.className = 'card-edit-task';
            editBtn.innerHTML = '<i class="fa-solid fa-pen-to-square"></i>';
            
            const deleteBtn = document.createElement('div');
            deleteBtn.className = 'card-delete-task';
            deleteBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';

            // Add event listeners for edit and delete
            editBtn.addEventListener('click', () => {
                // TODO: Implement edit functionality
                console.log('Edit task:', task.getID());
            });

            deleteBtn.addEventListener('click', () => {
                Tasks.deleteTask(task.getID());
                Storage.saveTasksToStorage();
                this.render();
            });

            // Add event listener for checkbox
            checkbox.addEventListener('change', () => {
                task.setCompletedStatus();
                Storage.saveTasksToStorage();
            });

            topRow.appendChild(taskTitle);
            editAndRemove.append(editBtn, deleteBtn);
            bottomRow.append(statusLabel, priorityDiv, dateDiv, editAndRemove);
            taskCard.append(topRow, bottomRow);

            this.tasksContainer.appendChild(taskCard);
        }
    },
}


document.addEventListener('DOMContentLoaded', function() {
    projectManager.init();
    taskManager.init();
});